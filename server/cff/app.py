from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from healthcheck import HealthCheck
import tensorflow as tf

from cff.views import main

LOAD_MODEL = True
loaded_model = None

app = Flask(__name__)
app.register_blueprint(main)
app.config.from_pyfile("config.py")

MODEL_FILE = app.config.get("MODEL_FILE")

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

if __name__ == "__main__":
    if LOAD_MODEL and MODEL_FILE:
        print(f"Loading model...")
        import nltk
        import tensorflow_text

        loaded_model = tf.keras.models.load_model(f"./cff/model/{MODEL_FILE}")
        print(f"Loaded model: {MODEL_FILE}")

    app.run(host="localhost", port=5000, debug=False)
