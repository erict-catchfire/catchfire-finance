from datetime import datetime

import click
import re
import yfinance as yf

from reticker import TickerExtractor, TickerMatchConfig
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
        self.updated_at = datetime.utcnow()
        if not session:
            session = db.session

        session.add(self)

        return self


class Account(Base):
    handle = db.Column(db.String, index=True)
    external_uid = db.Column(db.BIGINT)
    site_id = db.Column(db.Integer, db.ForeignKey('site.id'))
    site = relationship('Site', foreign_keys=[site_id])

    @staticmethod
    def create_or_noop(handle: str, external_uid: int, site_id: int):
        account = Account.query.filter(Account.handle == handle).first()
        if not account:
            account = Account(
                handle=handle,
                external_uid=external_uid,
                site_id=site_id
            ).save()
        return account


class Document(Base):
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    account = relationship('Account', foreign_keys=[account_id])
    contents = db.Column(db.String)
    account_mentions = relationship('AccountMention', uselist=True)
    ticker_mentions = relationship('TickerMention', uselist=True)
    posted_at = db.Column(db.DateTime)
    sentiments = relationship('DocumentSentiment', uselist=True)
    site_id = db.Column(db.Integer, db.ForeignKey('site.id'), index=True)
    external_uid = db.Column(db.BIGINT, index=True)
    context = db.Column(JSONB, default={})

    @staticmethod
    def exists(external_uid: int):
        doc = Document.query.filter(Document.external_uid == external_uid).first()
        return doc is not None

    @staticmethod
    def generate_document_context_from_twitter(tweet: dict):
        twitter_site = Site.query.filter(Site.name == 'Twitter').first()
        handle = tweet['user']['username']
        external_uid = tweet['id']
        external_user_id = tweet['user']['id']

        if Document.exists(external_uid):
            return

        owner_account = Account.create_or_noop(handle, external_user_id, twitter_site.id)

        quoted_tweet = tweet['quotedTweet']
        if quoted_tweet:
            Document.generate_document_context_from_twitter(quoted_tweet)

        mentioned_users = tweet['mentionedUsers']
        account_mentions = []
        if mentioned_users:
            for user in mentioned_users:
                account = Account.create_or_noop(user['username'], user['id'], twitter_site.id)
                account_mentions.append(account)

        db.session.flush()

        context = {
            'url': tweet['url'],
        }

        tweet_content = tweet['content']

        doc = Document(
            account_id=owner_account.id,
            posted_at=tweet['date'],
            contents=tweet_content,
            site_id=twitter_site.id,
            external_uid=external_uid,
            context=context
        ).save()

        db.session.flush()

        for acc_mention in account_mentions:
            AccountMention(
                document_id=doc.id,
                account_id=acc_mention.id,
            ).save()

        ticker_match_config = TickerMatchConfig(
            prefixed_uppercase=True,
            prefixed_lowercase=True,
            prefixed_titlecase=False,
            unprefixed_uppercase=False
        )
        extractor = TickerExtractor(deduplicate=True, match_config=ticker_match_config)
        tickers = extractor.extract(tweet_content)

        ticker_mentions = []
        for ticker in tickers:
            _ticker, *extra = re.split('\.|=', ticker)
            if len(_ticker) > 4:
                return
            mention = Ticker.create_or_noop(_ticker)

            if mention:
                ticker_mentions.append({
                    'mention': mention,
                    'extra': extra if extra else None
                })

        db.session.flush()

        for tm in ticker_mentions:
            TickerMention(
                document_id=doc.id,
                ticker_id=tm['mention'].id,
                extra=tm['extra']
            ).save()


class AccountMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False, index=True)
    account_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False)
    account = relationship('Account', foreign_keys=[account_id])


class TickerMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False, index=True)
    ticker_id = db.Column(db.Integer, db.ForeignKey('ticker.id'), nullable=False)
    extra = db.Column(db.String)
    ticker = relationship('Ticker', foreign_keys=[ticker_id])


class Ticker(Base):
    symbol = db.Column(db.String, unique=True)
    short_name = db.Column(db.String)
    long_name = db.Column(db.String)
    classification = db.Column(JSONB, default={})
    logo_url = db.Column(db.String)
    security_type = db.Column(db.String)

    sector = index_property('classification', 'sector')
    industry = index_property('classification', 'industry')

    @staticmethod
    def create_or_noop(symbol: str):
        ticker = Ticker.query.filter(Ticker.symbol == symbol).first()

        if not ticker:
            click.secho(f'Looking up Ticker: {symbol}', fg="yellow")
            ticker_info = yf.Ticker(symbol).info

            if 'symbol' not in ticker_info:
                click.secho(f'Ticker {symbol}, not found. Creating placeholder.', fg="red")
                return Ticker(symbol=symbol).save()

            ticker = Ticker(
                symbol=ticker_info['symbol'],
                short_name=ticker_info['shortName'] if 'shortName' in ticker_info else None,
                long_name=ticker_info['longName'] if 'longName' in ticker_info else None,
                security_type=ticker_info['quoteType'] if 'quoteType' in ticker_info else None,
                sector=ticker_info['sector'] if 'sector' in ticker_info else None,
                industry=ticker_info['industry'] if 'industry' in ticker_info else None
            ).save()

        return ticker


class Site(Base):
    name = db.Column(db.String, nullable=False, unique=True)
    url_domain = db.Column(db.String, nullable=False)


class DocumentSentiment(Base):
    sentiment = db.Column(JSONB, default={})
    model_version = db.Column(db.String, nullable=True)
    document_id = db.Column(db.Integer, db.ForeignKey('document.id'), nullable=False)
