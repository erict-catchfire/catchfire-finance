from flask import Blueprint, request, jsonify
import yfinance as yf;

main = Blueprint('main', __name__)


@main.route('/test')
def test():
    return 'Hello world!'

@main.route('/getPrice', methods=['POST'])
def getPrice():
    request_object = request.get_json()
    Dict = {}
    for tick in request_object['tickers'] :
        Dict[tick] = yf.Ticker(tick).history(period='1d')['Close'][0]

    return jsonify(Dict)
