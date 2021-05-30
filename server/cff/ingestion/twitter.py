import json
import os
from datetime import timedelta
from typing import Optional, Union

import sqlalchemy
from rq import Queue
from rq.decorators import job

from cff.models import db, Document, Site
from cff.historical_worker import conn as hist_conn
from cff.realtime_worker import conn as real_conn

TEMP_DIR = "temp"
MINIMUM_FAVES = 2


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
        doc_id = Document.generate_document_context_from_twitter(tweet, lookup_symbol)
        new_doc_ids.append(doc_id)

    db.session.commit()

    print(f"New documents: {new_doc_ids}, created.")
    if os.path.isfile(temp_file):
        os.remove(temp_file)
        print(f"Deleting temp file: {temp_file}")
    else:
        print(f"Error: {temp_file} not found.")

    probably_more_tweets = len(new_doc_ids) == 500

    if asc_or_desc == sqlalchemy.desc:
        if probably_more_tweets:
            bg_query_realtime_by_symbol.delay(lookup_symbol)
        else:
            realtime_queue = Queue("realtime", connection=real_conn)
            realtime_queue.enqueue_in(timedelta(minutes=30), bg_query_realtime_by_symbol, lookup_symbol)
    elif asc_or_desc == sqlalchemy.asc and probably_more_tweets:
        bg_query_historical_by_symbol.delay(lookup_symbol)

    return new_doc_ids


def _get_tweet_by_ticker(lookup_symbol: Optional[str] = None, asc_or_desc=None):
    query = db.session.query(Document).join(Site, Site.id == Document.site_id).filter(Site.name == "Twitter")

    if lookup_symbol:
        query = query.filter(Document.lookup_symbol.astext == lookup_symbol)

    if asc_or_desc:
        query = query.order_by(asc_or_desc(Document.posted_at))

    first = query.first()
    return first if first else None
