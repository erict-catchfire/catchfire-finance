import os

import redis
from rq import Worker, Queue, Connection

listen = ["sentiment"]

redis_url = os.getenv("RQ_REDIS_URL", "redis://localhost:6379")

conn = redis.from_url(redis_url)

if __name__ == "__main__":
    from cff.modeling import loaded_model

    with Connection(conn):
        worker = Worker(list(map(Queue, listen)))
        worker.work()
