from datetime import datetime
from typing import Optional
from enum import Enum

import click
import re

from reticker import TickerExtractor, TickerMatchConfig
import pyEX as px
from sqlalchemy import text
from sqlalchemy.ext.indexable import index_property
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB

from cff import config, db
from cff.constants import CryptoList

CRYPTO_LIST = CryptoList().map
iex = px.Client(api_token=config.IEX_TOKEN, version=config.IEX_ENV)


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
    site_id = db.Column(db.Integer, db.ForeignKey("site.id"))
    extra = db.Column(JSONB, default={})
    site = relationship("Site", foreign_keys=[site_id])

    @staticmethod
    def create_or_upsert(user: dict, site_id: int):
        handle = user["username"]

        extra = {
            "is_verified": user["verified"],
            "location": user["location"],
            "follower_count": user["followersCount"],
            "friend_count": user["friendsCount"],
            "status_count": user["statusesCount"],
        }

        account: Optional[Account] = Account.query.filter(Account.handle == handle).first()
        if not account:
            extra["created_at"] = user["created"]
            account = Account(handle=handle, external_uid=user["id"], site_id=site_id, extra=extra).save()
        else:
            account.extra = extra
            account.save()
        return account


class Document(Base):
    account_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    account = relationship("Account", foreign_keys=[account_id])
    contents = db.Column(db.String)
    account_mentions = relationship("AccountMention", uselist=True)
    ticker_mentions = relationship("TickerMention", uselist=True)
    posted_at = db.Column(db.DateTime)
    sentiments = relationship("DocumentSentiment", uselist=True)
    site_id = db.Column(db.Integer, db.ForeignKey("site.id"), index=True)
    external_uid = db.Column(db.BIGINT, index=True)
    context = db.Column(JSONB, default={})

    lookup_symbol = index_property("context", "lookup_symbol")

    @staticmethod
    def upsert(tweet: dict):
        document: Optional[Document] = Document.query.filter(Document.external_uid == tweet["id"]).first()
        tweet_date = tweet["date"].split("+")[0]
        tweet_posted_at = datetime.strptime(tweet_date, "%Y-%m-%dT%H:%M:%S")

        if document and tweet_posted_at > document.posted_at:
            context = document.context

            context["reply_count"] = tweet["replyCount"]
            context["retweet_count"] = tweet["retweetCount"]
            context["like_count"] = tweet["likeCount"]
            context["quote_count"] = tweet["quoteCount"]

            document.context = context
            document.save()
        return document

    @staticmethod
    def generate_document_context_from_twitter(tweet: dict, lookup_symbol: str):
        twitter_site: Optional[Site] = Site.query.filter(Site.name == "Twitter").first()
        user = tweet["user"]

        existing_doc = Document.upsert(tweet)
        if existing_doc:
            return [(existing_doc.id, False)]

        owner_account = Account.create_or_upsert(user, twitter_site.id)

        quoted_tweet = tweet["quotedTweet"]
        quoted_tweet_id = None
        quoted_tweet_is_new = False
        if quoted_tweet:
            quoted_tweet_id, quoted_tweet_is_new = Document.generate_document_context_from_twitter(
                quoted_tweet, lookup_symbol
            )[0]

        mentioned_users = tweet["mentionedUsers"]
        account_mentions = []
        if mentioned_users:
            for user in mentioned_users:
                account = Account.create_or_upsert(user, twitter_site.id)
                account_mentions.append(account)

        db.session.flush()

        context = {
            "url": tweet["url"],
            "conversation_id": tweet["conversationId"],
            "reply_count": tweet["replyCount"],
            "retweet_count": tweet["retweetCount"],
            "like_count": tweet["likeCount"],
            "quote_count": tweet["quoteCount"],
            "quoted_doc_id": quoted_tweet_id,
            "lookup_symbol": lookup_symbol,
        }

        tweet_content = tweet["content"]

        doc = Document(
            account_id=owner_account.id,
            posted_at=tweet["date"],
            contents=tweet_content,
            site_id=twitter_site.id,
            external_uid=tweet["id"],
            context=context,
        ).save()

        db.session.flush()

        for acc_mention in account_mentions:
            AccountMention(
                document_id=doc.id,
                account_id=acc_mention.id,
            ).save()

        ticker_match_config = TickerMatchConfig(
            prefixed_uppercase=True, prefixed_lowercase=True, prefixed_titlecase=False, unprefixed_uppercase=False
        )
        extractor = TickerExtractor(deduplicate=True, match_config=ticker_match_config)
        tickers = extractor.extract(tweet_content)

        ticker_mentions = []
        for ticker in tickers:
            _ticker, *extra = re.split("([\.|=])", ticker)
            is_probably_crypto = CRYPTO_LIST[_ticker]

            if len(_ticker) > 4 and not is_probably_crypto:
                continue

            mention = Ticker.create_or_noop(_ticker, is_probably_crypto)

            if mention:
                ticker_mentions.append({"mention": mention, "extra": "".join(extra) if extra else None})

        db.session.flush()

        for tm in ticker_mentions:
            TickerMention(document_id=doc.id, ticker_id=tm["mention"].id, extra=tm["extra"]).save()

        documents_created = [(doc.id, True)]
        if quoted_tweet_id:
            documents_created.append((quoted_tweet_id, quoted_tweet_is_new))

        return documents_created


class AccountMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"), nullable=False, index=True)
    account_id = db.Column(db.Integer, db.ForeignKey("account.id"), nullable=False)
    account = relationship("Account", foreign_keys=[account_id])


class TickerMention(Base):
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"), nullable=False, index=True)
    ticker_id = db.Column(db.Integer, db.ForeignKey("ticker.id"), nullable=False)
    extra = db.Column(db.String)
    ticker = relationship("Ticker", foreign_keys=[ticker_id])


class Ticker(Base):
    symbol = db.Column(db.String, unique=True, index=True)
    short_name = db.Column(db.String)
    long_name = db.Column(db.String)
    classification = db.Column(JSONB, default={})
    logo_url = db.Column(db.String)
    security_type = db.Column(db.String)
    extra = db.Column(JSONB, default={})

    sector = index_property("classification", "sector")
    industry = index_property("classification", "industry")
    status = index_property("extra", "status")

    @staticmethod
    def create_or_noop(symbol: str, probably_crypto: bool = False):
        ticker: Optional[Ticker] = Ticker.query.filter(Ticker.symbol == symbol).first()

        if not ticker:
            click.secho(f"Looking up Ticker: {symbol}", fg="yellow")

            if probably_crypto:
                click.secho(f"Ticker {symbol}, probably crypto. Creating placeholder.", fg="magenta")
                return Ticker(symbol=symbol, status=TickerStatus.placeholder.value).save()

            try:
                ticker_info = iex.company(symbol)
            except px.PyEXception:
                click.secho(f"Ticker {symbol}, not found. Creating placeholder.", fg="red")
                return Ticker(symbol=symbol, status=TickerStatus.placeholder.value).save()

            classification = {
                "sector": ticker_info["sector"] if "sector" in ticker_info else None,
                "industry": ticker_info["industry"] if "industry" in ticker_info else None,
                "tags": ticker_info["tags"] if "tags" in ticker_info else None,
            }

            ticker = Ticker(
                symbol=ticker_info["symbol"],
                long_name=ticker_info["companyName"] if "companyName" in ticker_info else None,
                security_type=ticker_info["issueType"] if "issueType" in ticker_info else None,
                classification=classification,
                status=TickerStatus.hydrated.value,
            ).save()

        return ticker


class TickerStatus(Enum):
    placeholder = "placeholder"
    hydrated = "hydrated"


class Site(Base):
    name = db.Column(db.String, nullable=False, unique=True)
    url_domain = db.Column(db.String, nullable=False)


class DocumentSentiment(Base):
    sentiment = db.Column(JSONB, default={})
    model_version = db.Column(db.String, nullable=True, index=True)
    document_id = db.Column(db.Integer, db.ForeignKey("document.id"), nullable=False, index=True)

    @staticmethod
    def create_or_noop(document_id: int, model_version: str, sentiment_dict: dict):
        sentiment: Optional[DocumentSentiment] = DocumentSentiment.query.filter(
            DocumentSentiment.document_id == document_id, DocumentSentiment.model_version == model_version
        ).first()

        if not sentiment:
            sentiment = DocumentSentiment(
                document_id=document_id, model_version=model_version, sentiment=sentiment_dict
            ).save()

        return sentiment
