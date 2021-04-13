import json
import os

import click
from flask.cli import AppGroup

from cff.models import db, Document

twitter_cli = AppGroup('twitter')


@twitter_cli.command('db_seed')
def twitter_seed():
    os.chdir('seed')

    data = []

    for file_name in os.listdir(os.getcwd()):
        with open(file_name) as file:
            for line in file:
                data.append(json.loads(line))

    live_run = False
    total_tweets = len(data)
    if click.confirm(f'Generate {total_tweets} test data tweets?'):
        live_run = True

    count = 1
    for tweet in data:
        Document.generate_document_context_from_twitter(tweet)

        if count % 100 == 0 and live_run:
            db.session.commit()
            click.secho(f'Saved {count} of {total_tweets} test data tweets.', fg="green")

        count = count + 1

    if live_run:
        click.secho(f'Committed remaining tweets.', fg="green")
