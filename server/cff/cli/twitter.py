import json
import os
import random

import click
from flask.cli import AppGroup

from cff.models import db, Document, DocumentSentiment

twitter_cli = AppGroup("twitter")


@twitter_cli.command("db_seed")
@click.option(
    "--seed-sentiment",
    "seed_sentiment",
    required=False,
    default=False,
    help="True/False generate random sentiment data.",
)
def twitter_seed(seed_sentiment: bool):
    click.secho(f"Seeding twitter dataset; Creating sentiments? {seed_sentiment}", fg="green")

    os.chdir("seed")

    data = []

    for file_name in os.listdir(os.getcwd()):
        with open(file_name) as file:
            for line in file:
                data.append(json.loads(line))

    live_run = False
    total_tweets = len(data)
    if click.confirm(f"Generate {total_tweets} test data tweets?"):
        live_run = True

    count = 1
    for tweet in data:
        doc_id = Document.generate_document_context_from_twitter(tweet)
        doc: Document = Document.query.get(doc_id)
        quoted_id = doc.context["quoted_doc_id"] if doc.context["quoted_doc_id"] else None
        if seed_sentiment:
            _seed_sentiment_posneg(doc_id)
            _seed_sentiment_emotions(doc_id)

            if quoted_id:
                _seed_sentiment_posneg(quoted_id)
                _seed_sentiment_emotions(quoted_id)

        if count % 100 == 0 and live_run:
            db.session.commit()
            click.secho(f"Saved {count} of {total_tweets} test data tweets.", fg="green")

        count = count + 1

    if live_run:
        click.secho(f"Committed remaining tweets.", fg="green")


def _seed_sentiment_posneg(doc_id: int):
    score = random.randrange(-1000, 1000) / 1000
    confidence = random.randrange(0, 10) / 10
    sentiment = {"score": score, "confidence": confidence}

    DocumentSentiment.create_or_noop(doc_id, "seed_posneg", sentiment)


def _seed_sentiment_emotions(doc_id: int):
    emotions = ["happy", "sad", "excited", "anger", "fear"]
    emotion_scores = [round(random.random(), 4) for _ in range(0, 5)]
    confidence_scores = [random.randrange(0, 10) / 10 for _ in range(0, 5)]

    sentiment_emotions = []

    for index, emote in enumerate(emotions):
        result = {"name": emote, "score": emotion_scores[index], "confidence": confidence_scores[index]}
        sentiment_emotions.append(result)

    index_of_max_emotion = emotion_scores.index(max(emotion_scores))
    index_of_max_confidence = confidence_scores.index(max(confidence_scores))

    sentiment = {
        "strongest_emotion": emotions[index_of_max_emotion],
        "confidence_emotion": emotions[index_of_max_confidence],
        "emotions": sentiment_emotions,
    }

    DocumentSentiment.create_or_noop(doc_id, "seed_emotions", sentiment)
