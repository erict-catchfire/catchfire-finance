from flask import Blueprint, request, jsonify
from cff.models import db, Ticker, Document, DocumentSentiment
from datetime import datetime, timedelta
import yfinance as yf

# from cff.sentiment import predict_sentiment
# from cff.sentiment import process_text
from collections import Counter

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
        .filter(Document.posted_at > datetime.now() - timedelta(days=70))
        .filter(DocumentSentiment.model_version == "seed_emotions")
        .filter(DocumentSentiment.sentiment["strongest_emotion"].astext == sentiment)
        .all()
    )

    documents_short = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=65))
        .filter(DocumentSentiment.model_version == "seed_emotions")
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
                "long_count": tick[1],
                "short_count": ticker_dict_long[tick[0]],
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

    documents = (
        db.session.query(Document)
        .join(DocumentSentiment, Document.id == DocumentSentiment.document_id)
        .filter(Document.posted_at > datetime.now() - timedelta(days=65))
        .all()
    )

    for doc in documents:
        word_array = word_array + doc.contents.split()

        if "strongest_emotion" in doc.sentiments[1].sentiment:
            sent_array.append(
                {"words": doc.contents.split(), "sentiment": doc.sentiments[1].sentiment["strongest_emotion"]}
            )
        else:
            sent_array.append(
                {"words": doc.contents.split(), "sentiment": doc.sentiments[0].sentiment["strongest_emotion"]}
            )

    stopword_removed = [word for word in word_array if word.lower() not in stop_words]
    c = Counter(stopword_removed)

    top_words = c.most_common(50)

    for i in range(0, len(top_words)):
        counter = [0, 0, 0, 0, 0]
        for entry in sent_array:
            if top_words[i][0] in entry["words"]:
                if entry["sentiment"] == "happy":
                    counter[0] = counter[0] + 1
                elif entry["sentiment"] == "sad":
                    counter[1] = counter[1] + 1
                elif entry["sentiment"] == "excited":
                    counter[2] = counter[2] + 1
                elif entry["sentiment"] == "anger":
                    counter[3] = counter[3] + 1
                elif entry["sentiment"] == "fear":
                    counter[4] = counter[4] + 1

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


# @main.route("/getSentiment", methods=["POST"])
# def get_sentiment():
#     request_object = request.get_json()
#     sentiment_dict = {}
#
#     strings_for_processing = request_object["strings"]
#     if not strings_for_processing:
#         return "Include valid strings for request", 400
#
#     processed_text = process_text(strings_for_processing)
#     sentiment_dict["results"] = predict_sentiment(processed_text)
#
#     return jsonify(sentiment_dict)


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

        # Dont try and be fancy about structure here. FE knows what its asking for.
        # "Data Group 1" : {
        #     "Item 1": ticker.long_name,
        #     "Item 2": ticker.classification['sector']
        # },
        # "Data Group 2" : {
        #     "Item A": round(prices[0]*100)/100,
        #     "Item B": round(prices[1]*100)/100,
        #     "Item C": round(prices[2]*100)/100,
        #     "Item D": round(prices[3]*100)/100,
        #     "Average": round(average*100)/100
        # }

    return jsonify(ticker_dict)


@main.route("/getTickers", methods=["GET"])
def get_tickers():
    tickers = Ticker.query.all()
    ticker_dict = {}

    for tick in tickers:
        ticker_dict[tick.symbol] = {"longName": tick.long_name}

    return ticker_dict
