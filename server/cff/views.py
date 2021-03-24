from flask import Blueprint


main = Blueprint('main', __name__)


@main.route('/test')
def test():
    return 'Hello world!'
