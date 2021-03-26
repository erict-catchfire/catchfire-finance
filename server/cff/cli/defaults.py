import click
from flask.cli import AppGroup

from cff import db
from cff.models import Site

defaults_cli = AppGroup('defaults')


@defaults_cli.command('sites')
def default_sites():
    for site in default_site_map:
        new_site = Site(
            name=site['name'],
            url_domain=site['url_domain']
        )
        new_site.save()

    if click.confirm(f'Generate default sites?'):
        db.session.commit()


default_site_map = [
    {
        'name': 'Twitter',
        'url_domain': 'twitter.com'
    },
    {
        'name': 'Instagram',
        'url_domain': 'instagram.com'
    }
]
