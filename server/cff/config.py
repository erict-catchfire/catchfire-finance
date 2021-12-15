import os

SQLALCHEMY_TRACK_MODIFICATIONS = False
DEVELOPMENT = True
USE_PROD_DB = False
DEBUG = True

MODEL_FILE = os.environ.get("MODEL_FILE")
SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
_IEX_SANDBOX = os.environ.get("IEX_SANDBOX")
_IEX_PROD = os.environ.get("IEX_PROD")

if DEVELOPMENT:
    IEX_TOKEN = _IEX_SANDBOX
    IEX_ENV = "sandbox"
    SSH_USER = os.environ.get("SSH_USER", None)
    SSH_PASSWORD = os.environ.get("SSH_PASSWORD", None)
    DB_READER = os.environ.get("DB_READER", None)
    DB_READER_PASSWORD = os.environ.get("DB_READER_PASSWORD", None)
else:
    IEX_TOKEN = _IEX_PROD
    IEX_ENV = "v1"
