import hashlib
import uuid
import pymongo
import secrets
from flask import Flask, request, make_response, jsonify, redirect
from flask_cors import CORS
import pymongo

TOKEN_SIZE_BYTES = 32

app = Flask(__name__)
CORS(app, supports_credentials=True)
client = pymongo.MongoClient('mongo', 27017)
db = client.appdb


def login_required(func):
    def func_wrapper(*args, **kwargs):
        auth_token = request.cookies.get('auth_token')
        current_user = db.users.find_one({'auth_tokens': auth_token})
        if not current_user:
            return make_response({'message': 'Invalid credentials'}, 400)

        return func(current_user, *args, **kwargs)

    func_wrapper.__name__ = func.__name__
    return func_wrapper


@app.route('/register', methods=['POST'])
def register():
    # getting user data
    data = request.json
    if 'username' not in data or 'password' not in data:
        return make_response({'message': 'Invalid input'}, 400)

    username = data['username']
    password = data['password']

    # checking if existing user
    existing_user = db.users.find_one({'username': username})
    if existing_user:
        return make_response({'message': 'Existing username'}, 400)

    # hashing password
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)

    # inserting into database
    new_user = db.users.insert_one({'username': username, \
        'hashed_password': hashed_password, 'auth_tokens': [auth_token]})

    # returning result to user
    res = make_response({'message': 'User registered'}, 200)
    res.set_cookie('auth_token', auth_token)
    return res


@app.route('/login', methods=['POST'])
def login():
    # getting user data
    data = request.json
    if 'username' not in data or 'password' not in data:
        return make_response({'message': 'Invalid input'}, 400)

    username = data['username']
    password = data['password']

    # hashing password
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()

    # checking against database
    user = db.users.find_one({'username': username, 'hashed_password': hashed_password})
    if not user:
        return make_response({'message': 'Invalid username/password'}, 400)

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)
    db.users.update_one({'_id': user['_id']}, {'$push': {'auth_tokens': auth_token}})

    # returning result to user
    res = make_response({'message': 'User authenticated'})
    res.set_cookie('auth_token', auth_token)
    return res
