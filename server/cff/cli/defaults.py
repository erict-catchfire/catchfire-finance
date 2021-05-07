import os

import click
from flask.cli import AppGroup

import yfinance as yf

from cff import db
from cff.models import Site, Ticker
from cff.cli import constants as cli_c

defaults_cli = AppGroup("defaults")


@defaults_cli.command("all")
def default_all():
    os.system("flask defaults sites")
    os.system("flask defaults tickers")


@defaults_cli.command("sites")
def default_sites():
    site_imports = cli_c.DEFAULT_SITE_MAP
    for site in reversed(site_imports):
        site_name = site["name"]
        exists = Site.query.filter(Site.name == site_name).first()
        if exists:
            click.secho(f'Site "{site_name}" already exists.', fg="yellow")
            site_imports.remove(site)
            continue

        new_site = Site(name=site_name, url_domain=site["url_domain"])
        new_site.save()

    if site_imports:
        db.session.commit()
        click.secho(f"Generated the default sites: {site_imports}.", fg="green")
    else:
        click.secho(f"All sites exist.", fg="yellow")


@defaults_cli.command("tickers")
def default_tickers():
    ticker_imports = cli_c.DEFAULT_SUPPORTED_TICKERS
    for ticker in reversed(ticker_imports):
        exists = Ticker.query.filter(Ticker.symbol == ticker).first()
        if exists:
            click.secho(f'Ticker "{ticker}" already exists.', fg="yellow")
            ticker_imports.remove(ticker)
            continue

        ticker_info = yf.Ticker(ticker).info

        new_ticker = Ticker(
            symbol=ticker_info["symbol"],
            short_name=ticker_info["shortName"],
            long_name=ticker_info["longName"],
            sector=ticker_info["sector"],
            industry=ticker_info["industry"],
            logo_url=ticker_info["logo_url"],
        )
        new_ticker.save()

    if ticker_imports:
        db.session.commit()
        click.secho(f"Generated the default tickers: {ticker_imports}.", fg="green")
    else:
        click.secho(f"All tickers exist.", fg="yellow")
