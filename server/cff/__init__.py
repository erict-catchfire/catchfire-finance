import logging

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from healthcheck import HealthCheck
from sshtunnel import SSHTunnelForwarder

app = Flask(__name__)
app.config.from_pyfile("config.py")
app.logger.setLevel(logging.ERROR)

IEX_TOKEN = app.config.get("IEX_TOKEN", None)
if not IEX_TOKEN:
    raise ValueError("Missing IEX token for current environment.")

SQLALCHEMY_DATABASE_URI = app.config.get("SQLALCHEMY_DATABASE_URI", None)
if not SQLALCHEMY_DATABASE_URI:
    raise ValueError("No database uri provided for catchfire-finance.")

_SSH_USER = app.config.get("SSH_USER", None)
_SSH_PASSWORD = app.config.get("SSH_PASSWORD", None)
_DB_READER = app.config.get("DB_READER", None)
_DB_READER_PASSWORD = app.config.get("DB_READER_PASSWORD", None)
should_ssh = _SSH_USER and _SSH_PASSWORD
can_attempt_read = _DB_READER and _DB_READER_PASSWORD and app.config.get("USE_PROD_DB", False)
if should_ssh and can_attempt_read:
    server = SSHTunnelForwarder(
        ("catchfire.finance", 22),
        ssh_username=_SSH_USER,
        ssh_password=_SSH_PASSWORD,
        remote_bind_address=("127.0.0.1", 5432),
    )
    server.start()
    app.config.update(
        SQLALCHEMY_DATABASE_URI=f"postgresql://{_DB_READER}:{_DB_READER_PASSWORD}@localhost:{server.local_bind_port}/catchfire"
    )

db = SQLAlchemy(app)

from cff.cli.site import site_cli
from cff.cli.defaults import defaults_cli
from cff.cli.twitter import twitter_cli

app.cli.add_command(site_cli)
app.cli.add_command(defaults_cli)
app.cli.add_command(twitter_cli)

health = HealthCheck()
app.add_url_rule("/healthcheck", "healthcheck", view_func=lambda: health.run())

from .api import cache, main

cache.init_app(app)
app.register_blueprint(main)
