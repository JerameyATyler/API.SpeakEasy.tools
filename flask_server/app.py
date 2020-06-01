from functools import wraps
import firebase_admin
from firebase_admin import auth, credentials
from flask import Flask, request, redirect

app = Flask(__name__)
firebase_admin.initialize_app(credentials.Certificate('gcloud.json'))


def firebase_auth(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('authorization', None)
        if auth_header is None:
            print('no auth token')
            return redirect('/')
        id_token = auth_header.split(' ', 1)[1]
        try:
            auth.verify_id_token(id_token)
        except BaseException as e:
            print('invalid token')
            print(e)
            return redirect('/')
        return f(*args, **kwargs)
    return decorated_function


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/test')
@firebase_auth
def test():
    return 'firebase auth'
