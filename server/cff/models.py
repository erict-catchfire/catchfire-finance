from datetime import datetime

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from sqlalchemy.ext.indexable import index_property
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB

db = SQLAlchemy()


class Base(db.Model):
    __abstract__ = True

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, server_default=text("(now() at time zone 'utc')"))
    updated_at = db.Column(db.DateTime, server_default=text("(now() at time zone 'utc')"))

    def save(self, session=None):
        self.updated_at = datetime.now()
        if not session:
            session = db.session

        session.add(self)

        return self


class Account(Base):
    handle = db.Column(db.String)
    site_id = db.Column(db.Integer, db.ForeignKey('site.id'))
    site = relationship('Site', foreign_keys=[site_id])


class Document(Base):
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    account = relationship('Account', foreign_keys=[account_id])
    contents = db.Column(db.String)
    account_mentions = relationship('AccountMention', uselist=True)
    ticker_mentions = relationship('TickerMention', uselist=True)
    posted_at = db.Column(db.DateTime)
    sentiments = relationship('DocumentSentiment', uselist=True)
    site_id = db.Column(db.Integer, db.ForeignKey('site.id'), index=True)
    site_resource = db.Column(db.String)


class AccountMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False, index=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    account = relationship('Account', foreign_keys=[account_id])


class TickerMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False, index=True)
    ticker_id = db.Column(db.Integer, db.ForeignKey('ticker.id'), nullable=False)
    ticker = relationship('Ticker', foreign_keys=[ticker_id])


class Ticker(Base):
    symbol = db.Column(db.String, unique=True)
    short_name = db.Column(db.String)
    long_name = db.Column(db.String)
    classification = db.Column(JSONB, default={})

    sector = index_property('classification', 'sector')
    industry = index_property('classification', 'industry')


class Site(Base):
    name = db.Column(db.String, nullable=False, unique=True)
    url_domain = db.Column(db.String, nullable=False)


class DocumentSentiment(Base):
    sentiment = db.Column(JSONB, default={})
    model_version = db.Column(db.String, nullable=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
