import click
from flask.cli import AppGroup

from cff import db
from cff.models import Site

site_cli = AppGroup('site')


@site_cli.command('create')
@click.option('--name', type=str)
@click.option('--url_domain', type=str)
def create_site(name: str, url_domain: str):
    if not name or not url_domain:
        click.secho(f'Please provide both a name, and url_domain for the newly added site.', fg='red')
        return

    site = Site(
        name=name,
        url_domain=url_domain
    )
    site.save()

    if click.confirm(f'Are you sure you want to create {name}, site?'):
        db.session.commit()
