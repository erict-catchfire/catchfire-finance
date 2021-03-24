from flask import Flask
from healthcheck import HealthCheck

from . import config
from .models import db
from .views import main


app = Flask(__name__)
app.register_blueprint(main)
app.config.from_pyfile('config.py')

db.init_app(app)

health = HealthCheck()
app.add_url_rule("/healthcheck", "healthcheck", view_func=lambda: health.run())

