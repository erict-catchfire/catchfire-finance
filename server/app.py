import gevent.pywsgi
import werkzeug.serving


@werkzeug.serving.run_with_reloader
def run_server():
    from cff.modeling import loaded_model
    from cff import app

    ws = gevent.pywsgi.WSGIServer(("0.0.0.0", 5000), app)
    ws.serve_forever()
