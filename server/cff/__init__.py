from flask import Flask
from healthcheck import HealthCheck

from cff.models import db
from cff.views import main


app = Flask(__name__)
app.register_blueprint(main)
app.config.from_pyfile('config.py')

db.init_app(app)

from cff.cli.site import site_cli
from cff.cli.defaults import defaults_cli

app.cli.add_command(site_cli)
app.cli.add_command(defaults_cli)

health = HealthCheck()
app.add_url_rule("/healthcheck", "healthcheck", view_func=lambda: health.run())

