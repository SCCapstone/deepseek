import sys
import hashlib
import uuid
import pymongo
import secrets
from flask import Flask, request, make_response, jsonify, redirect, session
from flask_session import Session
from bson.json_util import dumps, loads
from bson.errors import InvalidId
from bson.objectid import ObjectId
from flask_cors import CORS

from database import *
from gacc import *

TOKEN_SIZE_BYTES = 32

db = Database()

app = Flask(__name__)
app.config["SESSION_TYPE"] = "mongodb"
app.config["SESSION_MONGODB"] = db.client
app.config["SESSION_MONGODB_DB"] = "appdb"
app.config["SESSION_MONGODB_COLLECTION"] = "sessions"
Session(app)

app.secret_key = secrets.token_bytes(TOKEN_SIZE_BYTES)
CORS(app, supports_credentials=True)

googlecalendar = GoogleCalendar(
    client_secrets_file="googlesecret.json",
    scopes=["https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri="http://localhost:5000/googlecallback",
)


def login_required(func):
    def func_wrapper(*args, **kwargs):
        auth_token = request.cookies.get('auth_token')
        current_user = db.get_token_user(auth_token)
        if not current_user:
            return make_response({'message': 'Invalid credentials'}, 401)

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
    existing_user = db.get_user(username=username)
    if existing_user:
        return make_response({'message': 'Existing username'}, 400)

    # hashing password
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)

    # inserting into database
    new_user = db.add_user(username=username, password=hashed_password, auth_tokens=[auth_token])
    if not new_user:
        return make_response({'message': 'Error registering user'}, 400)
    # returning result to user
    res = make_response({'message': 'User registered', 'user': {
        'username': new_user['username'],
    }}, 200)
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
    user = db.get_user(username=username, password=hashed_password)
    if not user:
        return make_response({'message': 'Invalid username/password'}, 400)

    # creating an authentication token
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)
    db.add_auth_token(user['_id'], auth_token)

    # returning result to user
    res = make_response({'message': 'User authenticated', 'user': {
        'username': user['username'],
    }})
    res.set_cookie('auth_token', auth_token)
    return res

@app.route('/myprofile', methods=['GET'])
@login_required
def get_user(current_user):
    user = db.get_user(username=current_user['username'])
    user_json = dumps({'user': user})
    return make_response(user_json)

# TODO: add these frontend routes, really just needs to be a login with google button somewhere
# need to add frontent routes and save to database but this is working from hitting the backend routes
@app.route('/googlelogin')
def google_login():
    auth_url = googlecalendar.get_authorization_url(session)
    return redirect(auth_url)

@app.route('/googlecallback')
def google_callback():
    credentials = googlecalendar.exchange_code_for_credentials(session, request.url)
    return jsonify(credentials)

# TODO store these in the database intsead of just returning the credientials
@app.route('/googleevents')
def get_google_events():
    events = googlecalendar.fetch_calendar_events(session)
    for event in events:
        event_data = {
            # parse here
            # db.add_event(user_id, title, description, start_time, end_time, visibility, comments)
        }
    return jsonify(events)

@app.route('/addevent', methods=['POST'])
@login_required
def add_event(current_user):
    try:
        event_data = request.json
        # neccessary fields, if not in the payload, return an error
        event_fields = ["title", "description", "start_time", "end_time"]
        for field in event_fields:
            if field not in event_data:
                return make_response(jsonify({"error": f"Missing field: {field}"}), 400)

        # add event to database
        event = db.add_event(
            user_id=str(current_user['_id']),
            title=event_data["title"],
            description=event_data["description"],
            start_time=event_data["start_time"],
            end_time=event_data["end_time"],
            visibility=event_data.get("visibility", True),
            comments=event_data.get("comments", [])
        )
        
        return make_response(jsonify({"message": "Event added successfully", 
                                      "event": event}), 201)

    except Exception as e:
        app.logger.error('Error: {e}')
        return make_response(jsonify({"error": str(e)}), 500)
    
@app.route('/getevents', methods=['GET'])
@login_required
def get_events(current_user):
    try:
        user_id = str(current_user['_id'])
        events = db.get_events(user_id=user_id)

        # Convert ObjectId to string for each event
        events_json = []
        for event in events:
            event['_id'] = str(event['_id'])
            events_json.append(event)

        return make_response(
            jsonify({
                "message": "Events retrieved successfully",
                "data": events_json
            }), 200
        )

    except Exception as e:
        return make_response(
            jsonify({
                "error": "An error occurred while retrieving events",
                "details": str(e)
            }), 500
        )
    
@app.route('/events/<event_id>', methods=['GET'])
def get_event(event_id):
    try:
        # Validate event_id
        if not ObjectId.is_valid(event_id):
            return jsonify({"error": "Invalid event ID"}), 400

        event = db.get_event(event_id=ObjectId(event_id))
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Convert ObjectId to string
        event['_id'] = str(event['_id'])

        return jsonify({
            "message": "Event retrieved successfully",
            "data": event
        }), 200

    except InvalidId:
        return jsonify({"error": "Invalid event ID"}), 400
    except Exception as e:
        return jsonify({
            "error": "An error occurred while retrieving the event",
            "details": str(e)
        }), 500
    
@app.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        success = db.delete_event(event_id=ObjectId(event_id))
        if not success:
            return jsonify({"error": "Event not found"}), 404

        return jsonify({"message": "Event deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/events/<event_id>', methods=['PATCH'])
def edit_event(event_id):
    try:
        # Validate event_id
        event_id = ObjectId(event_id)
        # Get the JSON data from the request body
        update_data = request.get_json()
        if not update_data:
            return jsonify({"error": "No data provided for update"}), 400
        # Update the event in the database
        success = db.edit_event(event_id=event_id, **update_data)
        if not success:
            return jsonify({"error": "Event not found"}), 404
        return jsonify({"message": "Event updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500