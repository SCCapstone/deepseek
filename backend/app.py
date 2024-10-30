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
    existing_user = get_user(username=username)
    if existing_user:
        return make_response({'message': 'Existing username'}, 400)

    # hashing password
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)

    # inserting into database
    new_user = add_user(username=username, password=hashed_password, auth_tokens=[auth_token])
    if not new_user:
        return make_response({'message': 'Error registering user'}, 400)
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
    user = get_user(username=username, password=hashed_password)
    if not user:
        return make_response({'message': 'Invalid username/password'}, 400)

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)
    db.users.update_one({'_id': user['_id']}, {'$push': {'auth_tokens': auth_token}})

    # returning result to user
    res = make_response({'message': 'User authenticated'})
    res.set_cookie('auth_token', auth_token)
    return res

def add_user(username: str, password: str, name: str = None, bio: str = None, 
             events: list = [], default_event_visibility: bool = False, followers: list = [], 
             following: list = [], auth_tokens: list = None):
    """
    inserts a user into the user collection with the following attributes
     - name : name of the user
     - username : username of the user
     - hashed_password : hashed password of the user
     - bio : bio of the user
     - events : list of events created by the user
     - default_event_visibility : boolean indicating whether the user's events are public by default
     - followers : list of users who follow the user
     - following : list of users that the user is following
     - auth_tokens : list of authentication tokens for the user
    """

    user_doc = {'name' : name, 'username' : username, 'hashed_password' : password, 'bio' : bio,
                 'events' : events, 'default_event_visibility' : default_event_visibility, 'followers' : followers, 
                 'following' : following, 'auth_tokens' : auth_tokens}
    return db.users.insert_one(user_doc)

def get_user(username : str, password : str = None):
    """
    returns the user with the given username and password
    if no password given, just searches and returns based on the username
    """
    if not password == None:
        return db.users.find_one({'username': username},
                                {'hashed_password' : password})
    
    # idk why this says it's unreachable, pylance tripping because it is reachable..
    return db.users.find_one({'username': username})

def add_event(user_id : uuid, title : str, description : str,
              start_time : str, end_time : str, visibility : bool = False,
              comments : list = None):
    """
    adds an event to the user's events list with attributes
     - user_id : the id of the user who created the event
     - title : the title of the event
     - description : the description of the event
     - start_time : the start time of the event
     - end_time : the end time of the event
     - visibility : whether the event is visible to others or not
     - comments : a list of comments on the event
    """
    event_doc = {'user_id' : user_id,'title' : title, 'description' : description,
                 'start_time' : start_time, 'end_time' : end_time,
                 'visibility' : visibility, 'comments' : comments}
    return db.events.insert_one(event_doc)


    
