from flask import Blueprint, request, jsonify
from .models import Ticker;
import yfinance as yf;

main = Blueprint('main', __name__)


@main.route('/test')
def test():
    return 'Hello world!'

@main.route('/getPrice', methods=['POST'])
def getPrice():
    request_object = request.get_json()
    ticker_dict = {}

    requested_tickers = request_object['tickers']
    if not requested_tickers:
        return "Include valid tickers for request", 400

    for tick in requested_tickers:
        ticker_dict[tick] = yf.Ticker(tick).history(period='1d')['Close'][0]

    return jsonify(ticker_dict)

@main.route('/getTickers', methods=['GET'])
def getTickers():
    tickers = Ticker.query.all()
    ticker_dict = {}

    for tick in tickers:
        ticker_dict[tick.symbol] = {
            "longName" : tick.long_name
        }
        print(tick.symbol)

    return ticker_dict
