from flask import Flask
from healthcheck import HealthCheck

from cff.models import db
from cff.views import main

app = Flask(__name__)
app.register_blueprint(main)
app.config.from_pyfile("config.py")

IEX_TOKEN = app.config.get("IEX_TOKEN", None)
if not IEX_TOKEN:
    raise ValueError("Missing IEX token for current environment.")

SQLALCHEMY_DATABASE_URI = app.config.get("SQLALCHEMY_DATABASE_URI", None)
if not SQLALCHEMY_DATABASE_URI:
    raise ValueError("No database uri provide for catchfire-finance.")

db.app = app
db.init_app(app)

IS_DEVELOPMENT = app.config.get("DEVELOPMENT", None)

from .cli.site import site_cli
from .cli.defaults import defaults_cli
from .cli.twitter import twitter_cli

app.cli.add_command(site_cli)
app.cli.add_command(defaults_cli)
app.cli.add_command(twitter_cli)

health = HealthCheck()
app.add_url_rule("/healthcheck", "healthcheck", view_func=lambda: health.run())
