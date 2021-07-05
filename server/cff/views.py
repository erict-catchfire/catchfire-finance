import operator
import re
from collections import Counter
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify
from sqlalchemy import text, func, desc, distinct
from sqlalchemy.sql.expression import outerjoin
import yfinance as yf
import pyEX as px
import numpy as np
import pandas as pd
from scipy.stats.stats import pearsonr
import math

from cff import config
from cff.sentiment import predict_sentiment, process_text
from cff.models import db, Ticker, Document, DocumentSentiment, TickerMention

MODEL_FILE = config.MODEL_FILE
iex = px.Client(api_token=config.IEX_TOKEN, version=config.IEX_ENV)
main = Blueprint("main", __name__)

# fmt: off
stop_words = ["","%", ")","(","/", "&amp", "&amp;", "It’s", "#", "-", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"]
# fmt: on


@main.route("/getTopDays", methods=["POST"])
def get_top_days():
    request_object = request.get_json()
    ticker = request_object["ticker"]
    length = request_object["length"]
    sentiment = request_object["sentiment"]
    amount = request_object["amount"]
    to_return = []

    ticker_id = db.session.query(Ticker).filter(Ticker.symbol == ticker).first().id

    # I feel like this could definatly be one query. I made a query that had each day with the counts for each sentiment, however couldnt figure out how to sort them

    # Find top dates for the given sentiment
    sentiment_query = (
        db.session.query(func.date_trunc("day", Document.posted_at), func.count())
        .join(TickerMention, Document.id == TickerMention.document_id)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(TickerMention.ticker_id == ticker_id)
        .filter(DocumentSentiment.model_version == MODEL_FILE)
        .filter(Document.posted_at > datetime.now() - timedelta(days=length))
        .group_by(func.date_trunc("day", Document.posted_at))
        .order_by(desc(func.count()))
    )

    if sentiment != "all":
        sentiment_query = sentiment_query.filter(DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment)

    # Get top x
    data = sentiment_query.limit(amount).all()

    # For each date lookup all sentiment counts and return
    for date, _ in data:
        # Get sentiment sums for each of the days
        count_query = (
            db.session.query(
                func.date_trunc("day", Document.posted_at),
                DocumentSentiment.sentiment["strongest_emotion"],
                func.count(),
            )
            .join(TickerMention, Document.id == TickerMention.document_id)
            .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
            .filter(TickerMention.ticker_id == ticker_id)
            .filter(DocumentSentiment.model_version == MODEL_FILE)
            .filter(func.date_trunc("day", Document.posted_at) == date)
            .group_by(func.date_trunc("day", Document.posted_at), DocumentSentiment.sentiment["strongest_emotion"])
            .all()
        )

        r_dict = {
            "joy": 0,
            "fear": 0,
            "anger": 0,
            "sadness": 0,
            "confident": 0,
            "tentative": 0,
            "analytical": 0,
            "none": 0,
        }

        for date, sent, amount in count_query:
            if sent == None:
                r_dict["none"] = amount
            else:
                r_dict[sent] = amount
        r_dict["date"] = date.strftime("%Y-%m-%d")
        to_return.append(r_dict)

    return jsonify(to_return)


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

    to_return = get_sentiment_timeseries_helper(ticker, length, sentiment, "hour")

    return jsonify(to_return)


def get_sentiment_timeseries_helper(ticker, length, sentiment, trunc_amount):
    to_return = []

    ticker_id = db.session.query(Ticker).filter(Ticker.symbol == ticker).first().id

    if trunc_amount == "hour":
        delta = 1
    else:
        delta = 24

    series = db.session.query(
        db.func.generate_series(
            db.func.min(func.date_trunc(trunc_amount, datetime.now()) - timedelta(days=length)),
            db.func.max(func.date_trunc(trunc_amount, datetime.now())),
            timedelta(hours=delta),
        ).label("ts")
    ).subquery()

    time_series_values = (
        db.session.query(
            func.date_trunc(trunc_amount, Document.posted_at).label("m"), func.count(Document.posted_at).label("cnt")
        )
        .join(TickerMention, Document.id == TickerMention.document_id)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(TickerMention.ticker_id == ticker_id)
        .filter(DocumentSentiment.model_version == MODEL_FILE)
        .filter(Document.posted_at > datetime.now() - timedelta(days=length))
        .group_by("m")
        .order_by(text("m desc"))
    )

    if sentiment != "all":
        time_series_values = time_series_values.filter(
            DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment
        ).subquery()
    else:
        time_series_values = time_series_values.subquery()

    data = (
        db.session.query(series.c.ts, db.func.coalesce(time_series_values.c.cnt, 0))
        .outerjoin(time_series_values, time_series_values.c.m == series.c.ts)
        .order_by(series.c.ts)
        .all()
    )

    for date, amount in data:
        to_return.append({"date": date, "amount": amount})

    return to_return


@main.route("/getTopSentiment", methods=["POST"])
def get_top_sentiment():
    request_object = request.get_json()
    sentiment = request_object["sentiment"]
    long = request_object["long"]
    short = request_object["short"]
    to_return = []

    counts_query = (
        db.session.query(Ticker.symbol, func.count(Ticker.symbol))
        .join(TickerMention, TickerMention.ticker_id == Ticker.id)
        .join(Document, Document.id == TickerMention.document_id)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(DocumentSentiment.model_version == MODEL_FILE)
        .group_by(Ticker.symbol)
        .order_by(desc(func.count(Ticker.symbol)))
    )

    long_counts_query = counts_query.filter(Document.posted_at > datetime.now() - timedelta(days=long))
    short_counts_query = counts_query.filter(Document.posted_at > datetime.now() - timedelta(days=short))

    if sentiment != "all":
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
            stripped_word = re.sub("[.,;%&?!0-9]", "", word)
            if stripped_word.lower() not in stop_words:
                trimmed_words.append(stripped_word.lower())
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
                sentiment_counts[sentiment] += words.count(top_word)

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


def nan_to(input, to):
    if math.isnan(input):
        return to
    else:
        return input


@main.route("/getTableData", methods=["POST"])
def get_table_data():
    ticker_dict = {}
    request_object = request.get_json()
    requested_tickers = request_object["tickers"]

    if not requested_tickers:
        return "Include valid tickers for request", 400

    tickers = Ticker.query.filter(Ticker.symbol.in_(request_object["tickers"]))

    all_fill = np.zeros(30)
    joy_fill = np.zeros(30)
    fear_fill = np.zeros(30)
    anger_fill = np.zeros(30)
    sadness_fill = np.zeros(30)
    confident_fill = np.zeros(30)
    tentative_fill = np.zeros(30)
    analytical_fill = np.zeros(30)

    # This is totally arbitrary for now.
    for ticker in tickers:
        all = get_sentiment_timeseries_helper(ticker.symbol, 29, "all", "day")
        joy = get_sentiment_timeseries_helper(ticker.symbol, 29, "joy", "day")
        fear = get_sentiment_timeseries_helper(ticker.symbol, 29, "fear", "day")
        anger = get_sentiment_timeseries_helper(ticker.symbol, 29, "anger", "day")
        sadness = get_sentiment_timeseries_helper(ticker.symbol, 29, "sadness", "day")
        confident = get_sentiment_timeseries_helper(ticker.symbol, 29, "confident", "day")
        tentative = get_sentiment_timeseries_helper(ticker.symbol, 29, "tentative", "day")
        analytical = get_sentiment_timeseries_helper(ticker.symbol, 29, "analytical", "day")

        for i in range(0, 30):
            all_fill[i] = all[i]["amount"]
            joy_fill[i] = joy[i]["amount"]
            fear_fill[i] = fear[i]["amount"]
            anger_fill[i] = anger[i]["amount"]
            sadness_fill[i] = sadness[i]["amount"]
            confident_fill[i] = confident[i]["amount"]
            tentative_fill[i] = tentative[i]["amount"]
            analytical_fill[i] = analytical[i]["amount"]

        data = iex.chartDF(ticker.symbol, closeOnly=True, timeframe="3m").reset_index()

        thDayData = data[:30]
        percentChange = thDayData["changePercent"].to_numpy()
        volume = pd.to_numeric(data.iloc[::-1]["volume"]).pct_change().iloc[::-1][:30].to_numpy()

        # Returns (r-value, two-tailed p-test)
        # Warning: Small sample size makes p-test harder to pass
        all_corr_p = pearsonr(all_fill, percentChange)
        all_corr_v = pearsonr(all_fill, volume)

        joy_corr_p = pearsonr(joy_fill, percentChange)
        joy_corr_v = pearsonr(joy_fill, volume)

        fear_corr_p = pearsonr(fear_fill, percentChange)
        fear_corr_v = pearsonr(fear_fill, volume)

        anger_corr_p = pearsonr(anger_fill, percentChange)
        anger_corr_v = pearsonr(anger_fill, volume)

        sadness_corr_p = pearsonr(sadness_fill, percentChange)
        sadness_corr_v = pearsonr(sadness_fill, volume)

        confident_corr_p = pearsonr(confident_fill, percentChange)
        confident_corr_v = pearsonr(confident_fill, volume)

        tentative_corr_p = pearsonr(tentative_fill, percentChange)
        tentative_corr_v = pearsonr(tentative_fill, volume)

        analytical_corr_p = pearsonr(analytical_fill, percentChange)
        analytical_corr_v = pearsonr(analytical_fill, volume)

        ticker_dict[ticker.symbol] = [
            ticker.long_name,
            ticker.classification["sector"],
            nan_to(all_corr_p[0], 0),
            nan_to(all_corr_p[1], 1),
            nan_to(all_corr_v[0], 0),
            nan_to(all_corr_v[1], 1),
            nan_to(joy_corr_p[0], 0),
            nan_to(joy_corr_p[1], 1),
            nan_to(joy_corr_v[0], 0),
            nan_to(joy_corr_v[1], 1),
            nan_to(fear_corr_p[0], 0),
            nan_to(fear_corr_p[1], 1),
            nan_to(fear_corr_v[0], 0),
            nan_to(fear_corr_v[1], 1),
            nan_to(anger_corr_p[0], 0),
            nan_to(anger_corr_p[1], 1),
            nan_to(anger_corr_v[0], 0),
            nan_to(anger_corr_v[1], 1),
            nan_to(sadness_corr_p[0], 0),
            nan_to(sadness_corr_p[1], 1),
            nan_to(sadness_corr_v[0], 0),
            nan_to(sadness_corr_v[1], 1),
            nan_to(confident_corr_p[0], 0),
            nan_to(confident_corr_p[1], 1),
            nan_to(confident_corr_v[0], 0),
            nan_to(confident_corr_v[1], 1),
            nan_to(tentative_corr_p[0], 0),
            nan_to(tentative_corr_p[1], 1),
            nan_to(tentative_corr_v[0], 0),
            nan_to(tentative_corr_v[1], 1),
            nan_to(analytical_corr_p[0], 0),
            nan_to(analytical_corr_p[1], 1),
            nan_to(analytical_corr_v[0], 0),
            nan_to(analytical_corr_v[1], 1),
        ]

    return jsonify(ticker_dict)


@main.route("/getTickers", methods=["GET"])
def get_tickers():
    tickers = (
        db.session.query(Ticker.symbol, Ticker.long_name)
        .join(Document, Document.context["lookup_symbol"].astext == Ticker.symbol)
        .distinct(Ticker.symbol)
        .all()
    )
    return {ticker: name for (ticker, name) in tickers}
