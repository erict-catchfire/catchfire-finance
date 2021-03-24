import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from healthcheck import HealthCheck

from server.views import main

app = Flask(__name__)
app.register_blueprint(main)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['DATABASE_URL']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)

health = HealthCheck()
app.add_url_rule("/healthcheck", "healthcheck", view_func=lambda: health.run())
