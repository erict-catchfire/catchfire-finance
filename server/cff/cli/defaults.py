import click
from flask.cli import AppGroup

import yfinance as yf

from cff import db
from cff.models import Site, Ticker
from .constants import (
    DEFAULT_SITE_MAP,
    DEFAULT_SUPPORTED_TICKERS
)

defaults_cli = AppGroup('defaults')


@defaults_cli.command('sites')
def default_sites():
    for site in DEFAULT_SITE_MAP:
        new_site = Site(
            name=site['name'],
            url_domain=site['url_domain']
        )
        new_site.save()

    if click.confirm(f'Generate default sites?'):
        db.session.commit()


@defaults_cli.command('tickers')
def default_tickers():
    for ticker in DEFAULT_SUPPORTED_TICKERS:
        ticker_info = yf.Ticker(ticker).info

        new_ticker = Ticker(
            symbol=ticker_info['symbol'],
            short_name=ticker_info['shortName'],
            long_name=ticker_info['longName'],
            sector=ticker_info['sector'],
            industry=ticker_info['industry']
        )
        new_ticker.save()

    if click.confirm(f'Generate default supported tickers?'):
        db.session.commit()
