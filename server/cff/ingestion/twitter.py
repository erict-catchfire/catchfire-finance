from sqlalchemy import desc

from cff import db
from cff.models import Document, Site


def _get_latest_tweet_external_uid():
    results = (
        db.session.query(Document.external_uid)
        .join(Site, Site.id == Document.site_id)
        .filter(Site.name == "Twitter")
        .order_by(desc(Document.posted_at))
        .first()
    )

    return results.external_uid
