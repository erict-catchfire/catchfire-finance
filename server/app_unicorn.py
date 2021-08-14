import gevent.monkey

gevent.monkey.patch_all(subprocess=True)

import psycogreen.gevent

psycogreen.gevent.patch_psycopg()

import multiprocessing

workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gevent"
bind = "0.0.0.0:5000"
access_log_format = '%(HTTP_X_REAL_IP)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(T)s.%(D)s'
proc_name = "cff"
pythonpath = "."


def on_starting(server):
    from cff.modeling import loaded_model
