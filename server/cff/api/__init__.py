from flask import Blueprint
from flask_caching import Cache

main = Blueprint("main", __name__, url_prefix="/api")
cache = Cache(config={"CACHE_TYPE": "filesystem", "CACHE_DIR": "temp/api_cache/", "CACHE_DEFAULT_TIMEOUT": 30})

from . import views
