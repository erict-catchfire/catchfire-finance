import operator
import re
from collections import Counter
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from sqlalchemy import text, func, desc
import yfinance as yf
import pyEX as px

from cff import config
from cff.sentiment import predict_sentiment, process_text
from cff.models import db, Ticker, Document, DocumentSentiment, TickerMention

MODEL_FILE = config.MODEL_FILE
iex = px.Client(api_token=config.IEX_TOKEN, version=config.IEX_ENV)
main = Blueprint("main", __name__)

stop_words = [
    "&amp",
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

    data = iex.chartDF(ticker, closeOnly=True, timeframe="1y").reset_index()

    data["date"] = data["date"].dt.strftime("%Y-%m-%d")

    return jsonify(data[["close", "date"]].to_dict("records"))


@main.route("/getVolumeTimeSeries", methods=["POST"])
def get_volume_timeseries():
    request_object = request.get_json()
    ticker = request_object["ticker"]
    length = request_object["length"]

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

    ticker_id = db.session.query(Ticker).filter(Ticker.symbol == ticker).first().id

    time_series_query = (
        db.session.query(func.date_trunc("hour", Document.posted_at).label("m"), func.count(Document.posted_at))
        .join(TickerMention, Document.id == TickerMention.document_id)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(TickerMention.ticker_id == ticker_id)
        .filter(DocumentSentiment.model_version == MODEL_FILE)
        .filter(Document.posted_at > datetime.now() - timedelta(days=length))
        .group_by("m")
        .order_by(text("m desc"))
    )
    if sentiment != "all":
        time_series_query = time_series_query.filter(
            DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment
        )

    data = time_series_query.all()

    for date, amount in data:
        to_return.append({"date": date, "amount": amount})

    return jsonify(to_return)


@main.route("/getTopSentiment", methods=["POST"])
def get_top_sentiment():
    request_object = request.get_json()
    sentiment = request_object["sentiment"]
    to_return = []

    long_counts_query = (
        db.session.query(Ticker.symbol, func.count(Ticker.symbol))
        .join(TickerMention, TickerMention.ticker_id == Ticker.id)
        .join(Document, Document.id == TickerMention.document_id)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=31))
        .filter(DocumentSentiment.model_version == MODEL_FILE)
        .group_by(Ticker.symbol)
        .order_by(desc(func.count(Ticker.symbol)))
    )

    short_counts_query = (
        db.session.query(Ticker.symbol, func.count(Ticker.symbol))
        .join(TickerMention, TickerMention.ticker_id == Ticker.id)
        .join(Document, Document.id == TickerMention.document_id)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=1))
        .filter(DocumentSentiment.model_version == MODEL_FILE)
        .group_by(Ticker.symbol)
        .order_by(desc(func.count(Ticker.symbol)))
    )

    if sentiment != "All":
        long_counts_query = long_counts_query.filter(
            DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment
        )
        short_counts_query = short_counts_query.filter(
            DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment
        )

    short_counts_query = short_counts_query.limit(10)

    document_long_counts = long_counts_query.all()
    document_short_counts = short_counts_query.all()
    ticker_dict_long = {ticker: count for (ticker, count) in document_long_counts}

    for tick, count in document_short_counts:
        to_return.append(
            {
                "ticker": tick,
                "long_count": ticker_dict_long[tick],
                "short_count": count,
            }
        )

    return jsonify(to_return)


@main.route("/getWords", methods=["POST"])
def get_words():
    request_object = request.get_json()
    days = request_object["days"]
    to_return = []

    # TODO: This is gross; Do this less bad.
    words_by_sentiment = (
        db.session.query(
            DocumentSentiment.sentiment["strongest_emotion"].astext,
            func.string_to_array(
                func.string_agg(
                    func.array_to_string(func.regexp_split_to_array(Document.contents, "[\\s,]+"), ","), ","
                ),
                ",",
            ),
        )
        .join(Document, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=days))
        .filter(DocumentSentiment.model_version == MODEL_FILE)
        .group_by(DocumentSentiment.sentiment["strongest_emotion"].astext)
        .all()
    )

    word_array = []
    sentiment_word_map = {}
    for sentiment, array_of_words in words_by_sentiment:
        trimmed_words = []
        for word in array_of_words:
            stripped_word = re.sub("[.,;&?!]", "", word)
            if stripped_word.lower() not in stop_words:
                trimmed_words.append(stripped_word)
        sentiment_word_map[sentiment] = trimmed_words
        word_array = word_array + trimmed_words

    c = Counter(word_array)
    top_words = c.most_common(50)

    for top_word, top_count in top_words:
        sentiment_counts = {
            "joy": 0,
            "fear": 0,
            "anger": 0,
            "sadness": 0,
            "confident": 0,
            "tentative": 0,
            "analytical": 0,
            "none": 0,
        }
        for sentiment, words in sentiment_word_map.items():
            if top_word in words and sentiment:
                sentiment_counts[sentiment] += 1
        max_sentiment = max(sentiment_counts.items(), key=operator.itemgetter(1))[0]
        sum_amount = sum(sentiment_counts.values())
        to_return.append(
            {
                "word": top_word,
                "count": top_count,
                "sentiment": max_sentiment,
                "amount": (sentiment_counts[max_sentiment] / sum_amount) if sum_amount > 0 else 0,
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
