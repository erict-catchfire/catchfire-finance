from flask import Blueprint, request, jsonify
from sqlalchemy.ext.indexable import index_property
from sqlalchemy.sql.expression import null
from cff.models import Ticker, Document, DocumentSentiment, TickerMention
from datetime import datetime, timedelta
import yfinance as yf
from cff.sentiment import predict_sentiment
from cff.sentiment import process_text
from sqlalchemy import text, func
from cff import db
from collections import Counter
import json
import pyEX as px
from cff import config
import pandas as pd

main = Blueprint("main", __name__)
stop_words = [
    "&amp;",
    "It’s",
    "#",
    "-",
    "i",
    "me",
    "my",
    "myself",
    "we",
    "our",
    "ours",
    "ourselves",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
    "he",
    "him",
    "his",
    "himself",
    "she",
    "her",
    "hers",
    "herself",
    "it",
    "its",
    "itself",
    "they",
    "them",
    "their",
    "theirs",
    "themselves",
    "what",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "am",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "having",
    "do",
    "does",
    "did",
    "doing",
    "a",
    "an",
    "the",
    "and",
    "but",
    "if",
    "or",
    "because",
    "as",
    "until",
    "while",
    "of",
    "at",
    "by",
    "for",
    "with",
    "about",
    "against",
    "between",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "to",
    "from",
    "up",
    "down",
    "in",
    "out",
    "on",
    "off",
    "over",
    "under",
    "again",
    "further",
    "then",
    "once",
    "here",
    "there",
    "when",
    "where",
    "why",
    "how",
    "all",
    "any",
    "both",
    "each",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "no",
    "nor",
    "not",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "s",
    "t",
    "can",
    "will",
    "just",
    "don",
    "should",
    "now",
]


@main.route("/getPriceTimeSeries", methods=["POST"])
def get_price_timeseries():
    request_object = request.get_json()
    ticker = request_object["ticker"]
    length = request_object["length"]

    iex = px.Client(api_token=config.IEX_TOKEN, version=config.IEX_ENV)
    data = iex.chartDF(ticker, closeOnly=True, timeframe="1y").reset_index()

    data["date"] = data["date"].dt.strftime("%Y-%m-%d")

    return jsonify(data[["close", "date"]].to_dict("records"))


@main.route("/getVolumeTimeSeries", methods=["POST"])
def get_volume_timeseries():
    request_object = request.get_json()
    ticker = request_object["ticker"]
    length = request_object["length"]

    iex = px.Client(api_token=config.IEX_TOKEN, version=config.IEX_ENV)
    data = iex.chartDF(ticker, closeOnly=True, timeframe="1y").reset_index()

    data["date"] = data["date"].dt.strftime("%Y-%m-%d")

    return jsonify(data[["volume", "date"]].to_dict("records"))


@main.route("/getSentimentTimeSeries", methods=["POST"])
def get_sentiment_timeseries():
    request_object = request.get_json()
    ticker = request_object["ticker"]
    length = request_object["length"]
    sentiment = request_object["sentiment"]

    to_return = []

    ticker_id = db.session.query(Ticker).filter(Ticker.symbol == ticker).all()[0].id

    if sentiment == "all":
        data = (
            db.session.query(func.date_trunc("hour", Document.posted_at).label("m"), func.count(Document.posted_at))
            .join(TickerMention, Document.id == TickerMention.document_id)
            .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
            .filter(TickerMention.ticker_id == ticker_id)
            .filter(DocumentSentiment.model_version == "electra_5_19_bert")
            .filter(Document.posted_at > datetime.now() - timedelta(days=length))
            .group_by("m")
            .order_by(text("m desc"))
        )
    else:
        data = (
            db.session.query(func.date_trunc("hour", Document.posted_at).label("m"), func.count(Document.posted_at))
            .join(TickerMention, Document.id == TickerMention.document_id)
            .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
            .filter(TickerMention.ticker_id == ticker_id)
            .filter(DocumentSentiment.model_version == "electra_5_19_bert")
            .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment)
            .filter(Document.posted_at > datetime.now() - timedelta(days=length))
            .group_by("m")
            .order_by(text("m desc"))
        )

    for doc in data:
        to_return.append({"date": doc[0], "amount": doc[1]})

    return jsonify(to_return)


@main.route("/getTopSentimentAll", methods=["POST"])
def get_top_sentiment_all():
    top_tickers = []
    to_return = []
    ticker_array_short = []
    ticker_dict_long = {}

    documents_long = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=31))
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .all()
    )

    documents_short = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=1))
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .all()
    )

    for doc in documents_long:
        for mention in doc.ticker_mentions:
            if mention.ticker.symbol in ticker_dict_long:
                ticker_dict_long[mention.ticker.symbol] = ticker_dict_long[mention.ticker.symbol] + 1
            else:
                ticker_dict_long[mention.ticker.symbol] = 1

    for doc in documents_short:
        for mention in doc.ticker_mentions:
            ticker_array_short = ticker_array_short + [mention.ticker.symbol]

    c = Counter(ticker_array_short)
    top_tickers = c.most_common(10)

    for tick in top_tickers:
        to_return.append(
            {
                "ticker": tick[0],
                "long_count": ticker_dict_long[tick[0]],
                "short_count": tick[1],
            }
        )

    return jsonify(to_return)


@main.route("/getTopSentiment", methods=["POST"])
def get_top_sentiment():
    request_object = request.get_json()
    sentiment = request_object["sentiment"]
    ticker_array = []
    top_tickers = []
    to_return = []
    ticker_array_short = []
    ticker_dict_long = {}

    documents_long = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=31))
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment)
        .all()
    )

    documents_short = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=7))
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment)
        .all()
    )

    for doc in documents_long:
        for mention in doc.ticker_mentions:
            if mention.ticker.symbol in ticker_dict_long:
                ticker_dict_long[mention.ticker.symbol] = ticker_dict_long[mention.ticker.symbol] + 1
            else:
                ticker_dict_long[mention.ticker.symbol] = 1

    for doc in documents_short:
        for mention in doc.ticker_mentions:
            ticker_array_short = ticker_array_short + [mention.ticker.symbol]

    c = Counter(ticker_array_short)
    top_tickers = c.most_common(10)

    for tick in top_tickers:
        to_return.append(
            {
                "ticker": tick[0],
                "long_count": ticker_dict_long[tick[0]],
                "short_count": tick[1],
            }
        )

    return jsonify(to_return)


@main.route("/getWords", methods=["POST"])
def get_words():
    request_object = request.get_json()
    days = request_object["days"]
    word_array = []
    sent_array = []
    to_return = []

    joy_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "joy")
        .all()
    )

    fear_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "fear")
        .all()
    )

    anger_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "anger")
        .all()
    )

    sadness_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "sadness")
        .all()
    )

    confident_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "confident")
        .all()
    )

    tentative_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "tentative")
        .all()
    )

    analytical_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "analytical")
        .all()
    )

    null_documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == "electra_5_19_bert")
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == "analytical")
        .all()
    )

    print(
        len(joy_documents),
        len(fear_documents),
        len(anger_documents),
        len(sadness_documents),
        len(confident_documents),
        len(tentative_documents),
        len(analytical_documents),
        len(null_documents),
    )

    for doc in joy_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "joy"})
    for doc in fear_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "fear"})
    for doc in anger_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "anger"})
    for doc in sadness_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "sadness"})
    for doc in confident_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "confident"})
    for doc in tentative_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "tentative"})
    for doc in analytical_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "analytical"})
    for doc in null_documents:
        word_array = word_array + doc.contents.lower().split()
        sent_array.append({"words": doc.contents.lower().split(), "sentiment": "none"})

    stopword_removed = [word for word in word_array if word.lower() not in stop_words]
    c = Counter(stopword_removed)

    top_words = c.most_common(50)

    for i in range(0, len(top_words)):
        counter = [0, 0, 0, 0, 0, 0, 0, 0]
        for entry in sent_array:
            if top_words[i][0] in entry["words"]:
                if entry["sentiment"] == "joy":
                    counter[0] = counter[0] + 1
                elif entry["sentiment"] == "fear":
                    counter[1] = counter[1] + 1
                elif entry["sentiment"] == "anger":
                    counter[2] = counter[2] + 1
                elif entry["sentiment"] == "sadness":
                    counter[3] = counter[3] + 1
                elif entry["sentiment"] == "confident":
                    counter[4] = counter[4] + 1
                elif entry["sentiment"] == "tentative":
                    counter[5] = counter[5] + 1
                elif entry["sentiment"] == "analytical":
                    counter[6] = counter[6] + 1
                elif entry["sentiment"] == "none":
                    counter[7] = counter[7] + 1

        max_amount = max(counter)
        max_position = counter.index(max_amount)
        sum_amount = sum(counter)

        to_return.append(
            {
                "word": top_words[i][0],
                "count": top_words[i][1],
                "sentiment": max_position,
                "amount": (max_amount / sum_amount),
            }
        )

    return jsonify(to_return)


@main.route("/getSentiment", methods=["POST"])
def get_sentiment():
    request_object = request.get_json()
    sentiment_dict = {}

    strings_for_processing = request_object["strings"]
    if not strings_for_processing:
        return "Include valid strings for request", 400

    processed_text = process_text(strings_for_processing)
    sentiment_dict["results"] = predict_sentiment(processed_text)

    return jsonify(sentiment_dict)


@main.route("/getPrice", methods=["POST"])
def get_price():
    request_object = request.get_json()
    ticker_dict = {}

    requested_tickers = request_object["tickers"]
    if not requested_tickers:
        return "Include valid tickers for request", 400

    for tick in requested_tickers:
        ticker_dict[tick] = yf.Ticker(tick).history(period="1d")["Close"][0]

    return jsonify(ticker_dict)


@main.route("/getTableData", methods=["POST"])
def get_table_data():
    ticker_dict = {}
    request_object = request.get_json()
    requested_tickers = request_object["tickers"]

    if not requested_tickers:
        return "Include valid tickers for request", 400

    tickers = Ticker.query.filter(Ticker.symbol.in_(request_object["tickers"]))

    # This is totally arbitrary for now.
    for ticker in tickers:
        prices = yf.Ticker(ticker.symbol).history(period="1mo")["Close"]
        average = sum(prices) / len(prices)

        ticker_dict[ticker.symbol] = [
            ticker.long_name,
            ticker.classification["sector"],
            round(prices[0] * 100) / 100,
            round(prices[1] * 100) / 100,
            round(prices[2] * 100) / 100,
            round(average * 100) / 100,
        ]

    return jsonify(ticker_dict)


@main.route("/getTickers", methods=["GET"])
def get_tickers():
    tickers = Ticker.query.all()
    ticker_dict = {}

    for tick in tickers:
        ticker_dict[tick.symbol] = {"longName": tick.long_name}

    return ticker_dict
