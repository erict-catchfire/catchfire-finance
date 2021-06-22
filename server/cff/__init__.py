from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from healthcheck import HealthCheck


app = Flask(__name__)
app.config.from_pyfile("config.py")

IEX_TOKEN = app.config.get("IEX_TOKEN", None)
if not IEX_TOKEN:
    raise ValueError("Missing IEX token for current environment.")

SQLALCHEMY_DATABASE_URI = app.config.get("SQLALCHEMY_DATABASE_URI", None)
if not SQLALCHEMY_DATABASE_URI:
    raise ValueError("No database uri provided for catchfire-finance.")

db = SQLAlchemy(app)

from cff.cli.site import site_cli
from cff.cli.defaults import defaults_cli
from cff.cli.twitter import twitter_cli

app.cli.add_command(site_cli)
app.cli.add_command(defaults_cli)
app.cli.add_command(twitter_cli)

health = HealthCheck()
app.add_url_rule("/healthcheck", "healthcheck", view_func=lambda: health.run())

from .api import main

app.register_blueprint(main)
