import json
import os
from typing import Optional

from rq.decorators import job
from sqlalchemy import desc

from cff import conn, db
from cff.models import Document, Site, TickerMention, Ticker

TEMP_DIR = "temp"


def _get_latest_tweet_external_uid_by_ticker(lookup_symbol: Optional[str] = None):
    query = (
        db.session.query(Document.external_uid)
        .join(Site, Site.id == Document.site_id)
        .join(TickerMention)
        .join(Ticker)
        .filter(Site.name == "Twitter")
        .order_by(desc(Document.posted_at))
    )

    if lookup_symbol:
        query = query.filter(Ticker.symbol == lookup_symbol)

    return query.first().external_uid


@job("twitter", connection=conn, timeout=-1)
def do_the_job(lookup_symbol: str):
    if not lookup_symbol:
        return []

    latest_external_id = _get_latest_tweet_external_uid_by_ticker(lookup_symbol)
    temp_file_name = f"{lookup_symbol}-{latest_external_id}"
    temp_file = f"{TEMP_DIR}/{temp_file_name}.json"
    os.system(
        f"snscrape --jsonl --max-results 500 twitter-search "
        f'"#{lookup_symbol} OR \${lookup_symbol} min_faves:4 lang:en since_id:{latest_external_id}" '
        f"> {temp_file}"
    )

    tweets = []
    with open(temp_file) as reader:
        for line in reader:
            tweets.append(json.loads(line))

    print(f"Found {len(tweets)} new tweets, for {lookup_symbol}.")
    new_doc_ids = []
    for tweet in tweets:
        doc_id = Document.generate_document_context_from_twitter(tweet)
        new_doc_ids.append(doc_id)

    db.session.commit()

    print(f"New documents: {new_doc_ids}, created.")
    if os.path.isfile(temp_file):
        os.remove(temp_file)
        print(f"Deleting temp file: {temp_file}")
    else:
        print(f"Error: {temp_file} not found.")

    return new_doc_ids
