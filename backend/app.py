import sys
import hashlib
import uuid
import pymongo
import secrets
from json import loads, dumps
from flask import Flask, request, make_response, jsonify, redirect, session
from flask_session import Session
from bson.errors import InvalidId
from bson.objectid import ObjectId
from flask_cors import CORS

from database import *
from gacc import *
from friend_manager import *
from db import User, Event
from utils.auth_utils import login_required
from utils.data_utils import require_data
from routes import user_router, auth_router


TOKEN_SIZE_BYTES = 32

db = Database()

app = Flask(__name__)
app.register_blueprint(user_router)
app.register_blueprint(auth_router)
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


@app.route('/myprofile', methods=['GET'])
@login_required
def get_user(current_user):
    profile = current_user.profile
    return jsonify({'user': profile})


@app.route('/delete-account', methods=['POST'])
@login_required
def delete_account(current_user):
    current_user.delete()
    return make_response({'message': 'Account deleted'})


@app.route('/addevent', methods=['POST'])
@login_required
@require_data('title', 'description', 'start_time', 'end_time')
def add_event(current_user):
    event_data = request.json
    event_data['user_id'] = current_user._id
    Event.create(**event_data)
    return make_response({'message': 'Event created'}, 201)


@app.route('/get-events', methods=['GET'])
@login_required
def get_events(current_user):
    events = current_user.events
    event_data = [x.dict() for x in events]
    return make_response({'message': 'Events retrieved', 'data': event_data})


@app.route('/get-event/<event_id>', methods=['GET'])
@login_required
def get_event(current_user, event_id):
    event = Event.find(_id=ObjectId(event_id), user_id=current_user._id)
    return jsonify({'message': 'Event retrieved', 'data': loads(dumps(event))})
    

@app.route('/update-event/<event_id>', methods=['POST'])
@login_required
def update_event(current_user, event_id):
    data = request.json
    event = Event.find(_id=ObjectId(event_id), user_id=current_user._id)
    event.update(data)
    return make_response({'message': 'Event updated'})


@app.route('/friends/add', methods=['POST'])
def add_friend():
    try:
        # Validate JSON payload
        if not request.json or 'friend_id' not in request.json:
            return jsonify({"error": "Missing 'friend_id' in request body"}), 400

        # Get user_id and friend_id
        user_id = request.json.get('user_id')
        friend_id = request.json.get('friend_id')

        # Validate ObjectIDs
        if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(friend_id):
            return jsonify({"error": "Invalid user ID or friend ID"}), 400

        # Add friend
        success = db.friend_manager.add_friend(user_id=user_id, friend_id=friend_id)
        if not success:
            return jsonify({"error": "Friend relationship already exists or invalid IDs"}), 400

        return jsonify({"message": "Friend added successfully"}), 200

    except InvalidId as e:
        return jsonify({"error": "Invalid user ID or friend ID"}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
    
@app.route('/friends/remove', methods=['POST'])
@login_required
def remove_friend(current_user):
    try:
        user_id = current_user.id
        friend_id = request.json.get('friend_id')

        # Remove friend
        success = db.friend_manager.remove_friend(user_id, friend_id)
        if not success:
            return jsonify({"error": "Friend relationship not found or invalid IDs"}), 404

        return jsonify({"message": "Friend removed successfully"}), 200

    except InvalidId:
        return jsonify({"error": "Invalid user ID or friend ID"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/friends', methods=['GET'])
@login_required
def get_friends(current_user):
    try:
        user_id = current_user.id

        friends = db.friend_manager.get_friends(user_id)
        return jsonify({"message": "Friends retrieved successfully", "friends": friends}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/friends/events', methods=['GET'])
@login_required
def get_friends_events(current_user):
    try:
        user_id = current_user.id

        events = db.friend_manager.get_friends_events(user_id)
        return jsonify({"message": "Friends' events retrieved successfully", "events": events}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


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