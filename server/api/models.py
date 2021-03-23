from . import db

from sqlalchemy import text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB


class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50))
    rating = db.Column(db.Integer)


class Base(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=text("(now() at time zone 'utc')"))


class User(Base):
    handle = db.Column(db.String)
    site = db.Column(db.Integer, db.ForeignKey('site.id'))


class Document(Base):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    contents = db.Column(db.String)
    user_mentions = relationship('UserMention', uselist=True)
    ticker_mentions = relationship('TickerMention', uselist=True)
    posted_at = db.Column(db.DateTime)
    sentiment_id = db.Column(db.Integer, db.ForeignKey('document_sentiment.id'))
    site_resource = db.Column(db.String)


class UserMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)


class TickerMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('ticker.id'), nullable=False)


class Ticker(Base):
    short_code = db.Column(db.String)
    name = db.Column(db.String)


class Site(Base):
    name = db.Column(db.String)
    url_domain = db.Column(db.String)


class DocumentSentiment(Base):
    sentiment = db.Column(JSONB)
    model_version = db.Column(db.String, nullable=True)
