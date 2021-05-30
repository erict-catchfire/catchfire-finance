import os

SQLALCHEMY_TRACK_MODIFICATIONS = False
DEVELOPMENT = True
DEBUG = True

SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
_IEX_SANDBOX = os.environ.get("IEX_SANDBOX")
_IEX_PROD = os.environ.get("IEX_PROD")

if DEVELOPMENT:
    IEX_TOKEN = _IEX_SANDBOX
    IEX_ENV = "sandbox"
else:
    IEX_TOKEN = _IEX_PROD
    IEX_ENV = "v1"
