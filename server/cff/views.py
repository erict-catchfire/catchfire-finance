from flask import Blueprint, request, jsonify
from cff.models import Ticker
import yfinance as yf
from cff.sentiment import predict_sentiment
from cff.sentiment import process_text

main = Blueprint("main", __name__)


@main.route("/getSentiment", methods=["POST"])
def get_sentiment():
    request_object = request.get_json()
    sentiment_dict = {}

    strings_for_processing = request_object["strings"]
    if not strings_for_processing:
        return "Include valid strings for request", 400

    processed_text = process_text(strings_for_processing)
    sentiment_dict["results"] = predict_sentiment(processed_text)
    print(sentiment_dict)

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
