from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB

db = SQLAlchemy()


class Base(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=text("(now() at time zone 'utc')"))


class User(Base):
    handle = db.Column(db.String)
    site_id = db.Column(db.Integer, db.ForeignKey('site.id'))
    site = relationship('Site', foreign_keys=[site_id])


class Document(Base):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = relationship('User', foreign_keys=[user_id])
    contents = db.Column(db.String)
    user_mentions = relationship('UserMention', uselist=True)
    ticker_mentions = relationship('TickerMention', uselist=True)
    posted_at = db.Column(db.DateTime)
    sentiments = relationship('DocumentSentiment', uselist=True)
    site_id = db.Column(db.Integer, db.ForeignKey('site.id'), index=True)
    site_resource = db.Column(db.String)


class UserMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = relationship('User', foreign_keys=[user_id])


class TickerMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False, index=True)
    ticker_id = db.Column(db.Integer, db.ForeignKey('ticker.id'), nullable=False)
    ticker = relationship('Ticker', foreign_keys=[ticker_id])


class Ticker(Base):
    short_code = db.Column(db.String, unique=True)
    name = db.Column(db.String)
    classification = db.Column(JSONB)


class Site(Base):
    name = db.Column(db.String, nullable=False, unique=True)
    url_domain = db.Column(db.String, nullable=False)


class DocumentSentiment(Base):
    sentiment = db.Column(JSONB, default={})
    model_version = db.Column(db.String, nullable=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
