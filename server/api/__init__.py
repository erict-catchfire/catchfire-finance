from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from server.api.models import User, Site

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:catchfireprodpassword@localhost:5432/catchfire'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = SQLAlchemy(app)
migrate = Migrate(app, db)

db.create_all()
db.session.commit()

instagram = Site(name='Instagram', url_domain='instagram.com')
db.session.commit()
taytay = User(handle='taytaysounds', site=instagram.id)
db.session.commit()
