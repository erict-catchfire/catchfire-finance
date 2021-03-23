from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:catchfireprodpassword@localhost:5432/catchfire'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

