import json
import operator
import os
from datetime import timedelta
from typing import Optional, Union, List

import numpy as np
import sqlalchemy
from rq import Queue
from rq.decorators import job
from sqlalchemy import asc

from cff import sentiment
from cff.models import db, Document, Site, DocumentSentiment
from cff.historical_worker import conn as hist_conn
from cff.realtime_worker import conn as real_conn
from cff.sentiment_worker import conn as sent_conn

TEMP_DIR = "temp"
MINIMUM_FAVES = 2
STRONGEST_THRESHOLD = 0.4


@job("historical", connection=hist_conn, timeout=-1)
def bg_query_historical_by_symbol(symbol: str, fresh: bool = False):
    _bg_query_tweets_for_symbol(symbol, sqlalchemy.asc, fresh)


@job("realtime", connection=real_conn, timeout=-1)
def bg_query_realtime_by_symbol(symbol: str):
    _bg_query_tweets_for_symbol(symbol, sqlalchemy.desc)


def _bg_query_tweets_for_symbol(
    lookup_symbol: str, asc_or_desc: Union[sqlalchemy.asc, sqlalchemy.desc], fresh: bool = False
):
    if not lookup_symbol:
        # TODO: Log or raise
        return []

    if not asc_or_desc:
        # TODO: Log or raise
        return []

    time_param = ""
    if not fresh:
        document = _get_tweet_by_ticker(lookup_symbol, asc_or_desc)

        job_type = ""
        if asc_or_desc == sqlalchemy.desc:
            time_param = f"since_id:{document.external_uid}" if document else ""
            job_type = "realtime"
        elif asc_or_desc == sqlalchemy.asc:
            time_param = f"max_id:{document.external_uid}" if document else ""
            job_type = "historical"

        temp_file_name = f"{lookup_symbol}-{document.external_uid}-{job_type}"
    else:
        temp_file_name = f"{lookup_symbol}-fresh"

    temp_file = f"{TEMP_DIR}/{temp_file_name}.json"

    sns_query_string = (
        f"snscrape --jsonl --max-results 500 twitter-search "
        f'"#{lookup_symbol} OR \${lookup_symbol} min_faves:{MINIMUM_FAVES} lang:en {time_param}" '
        f"> {temp_file}"
    )
    os.system(sns_query_string)

    tweets = []
    with open(temp_file) as reader:
        for line in reader:
            tweets.append(json.loads(line))

    print(f"Found {len(tweets)} new tweets, for {lookup_symbol}.")

    new_doc_ids = []
    for tweet in tweets:
        docs_created = Document.generate_document_context_from_twitter(tweet, lookup_symbol)
        for doc_id, is_new in docs_created:
            if is_new:
                new_doc_ids.append(doc_id)

    db.session.commit()

    if os.path.isfile(temp_file):
        os.remove(temp_file)
        print(f"Deleting temp file: {temp_file}")
    else:
        print(f"Error: {temp_file} not found.")

    probably_more_tweets = len(tweets) == 500

    if asc_or_desc == sqlalchemy.desc:
        if probably_more_tweets:
            bg_query_realtime_by_symbol.delay(lookup_symbol)
        else:
            realtime_queue = Queue("realtime", connection=real_conn)
            realtime_queue.enqueue_in(timedelta(minutes=30), bg_query_realtime_by_symbol, lookup_symbol)
    elif asc_or_desc == sqlalchemy.asc and probably_more_tweets:
        bg_query_historical_by_symbol.delay(lookup_symbol)

    if new_doc_ids:
        bg_generate_sentiments.delay(new_doc_ids)

    return new_doc_ids


def _get_tweet_by_ticker(lookup_symbol: Optional[str] = None, asc_or_desc=None):
    query = db.session.query(Document).join(Site, Site.id == Document.site_id).filter(Site.name == "Twitter")

    if lookup_symbol:
        query = query.filter(Document.lookup_symbol.astext == lookup_symbol)

    if asc_or_desc:
        query = query.order_by(asc_or_desc(Document.posted_at))

    first = query.first()
    return first if first else None


@job("sentiment", connection=sent_conn, timeout=-1)
def bg_generate_sentiments(doc_ids: List[int]):
    _generate_sentiments_for_doc_ids(doc_ids)


def _generate_sentiments_for_doc_ids(doc_ids: List[int]):
    docs = (
        db.session.query(Document.id, Document.contents)
        .filter(Document.id.in_(doc_ids))
        .order_by(asc(Document.id))
        .all()
    )

    doc: Document
    array_of_doc_ids = [doc.id for doc in docs]
    array_of_doc_text = [doc.contents for doc in docs]

    processed_text: np.array = sentiment.process_text(array_of_doc_text)
    doc_sentiments: np.array = sentiment.predict_sentiment(processed_text)

    if doc_sentiments.size == 0:
        print(f"Model is probably not loaded; No sentiments returned.")
        return  # Do Nothing

    for (doc_id, doc_sentiment) in zip(array_of_doc_ids, doc_sentiments):
        sentiments = {
            "anger": doc_sentiment[0],
            "fear": doc_sentiment[1],
            "joy": doc_sentiment[2],
            "sadness": doc_sentiment[3],
            "analytical": doc_sentiment[4],
            "confident": doc_sentiment[5],
            "tentative": doc_sentiment[6],
        }
        strongest_value = max(sentiments.items(), key=operator.itemgetter(1))[0]
        strongest_emotion = strongest_value if sentiments[strongest_value] > STRONGEST_THRESHOLD else None
        sentiment_map = {"strongest_emotion": strongest_emotion, "emotions": sentiments}

        DocumentSentiment(document_id=doc_id, model_version=sentiment.MODEL_FILE, sentiment=sentiment_map).save()

    db.session.commit()
