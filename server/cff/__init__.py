from flask import Flask
from healthcheck import HealthCheck
from rq import Queue
from worker import conn

from cff.models import db
from cff.views import main


app = Flask(__name__)
app.register_blueprint(main)
app.config.from_pyfile("config.py")

db.app = app
db.init_app(app)

q = Queue(connection=conn)

from cff.cli.site import site_cli
from cff.cli.defaults import defaults_cli
from cff.cli.twitter import twitter_cli

app.cli.add_command(site_cli)
app.cli.add_command(defaults_cli)
app.cli.add_command(twitter_cli)

health = HealthCheck()
app.add_url_rule("/healthcheck", "healthcheck", view_func=lambda: health.run())
