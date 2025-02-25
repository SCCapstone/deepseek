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
import logging

from database import *
from gacc import *
from friend_manager import *

TOKEN_SIZE_BYTES = 32
FRONTEND_URL = "http://localhost:4000"

db = Database()
logger = logging.getLogger(__name__)

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
        if not auth_token:
            logger.warning("No auth token provided")
            return jsonify({'error': 'Unauthorized'}), 401
            
        current_user = db.user_manager.get_token_user(auth_token)
        if not current_user:
            logger.warning(f"Invalid auth token: {auth_token}")
            return jsonify({'error': 'Unauthorized'}), 401
            
        return func(current_user, *args, **kwargs)
    func_wrapper.__name__ = func.__name__
    return func_wrapper


@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if 'username' not in data or 'password' not in data or 'email' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    username = data['username']
    password = data['password']
    email = data['email']

    existing_user = db.user_manager.get_user(username=username) or db.user_manager.get_user(email=email)
    if existing_user:
        return jsonify({'error': 'Username or email already exists'}), 409

    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()
    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)

    new_user = db.user_manager.add_user(username=username, password=hashed_password, email=email, auth_tokens=[auth_token])
    if not new_user:
        return jsonify({'error': 'Failed to register user'}), 500

    response = jsonify({
        'message': 'User registered successfully',
        'data': {
            'id': str(new_user['_id']),
            'username': new_user['username']
        }
    })
    response.set_cookie('auth_token', auth_token)
    return response, 201


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    username = data['username']
    password = data['password']

    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()

    user = db.user_manager.get_user(username=username, password=hashed_password)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    auth_token = secrets.token_hex(TOKEN_SIZE_BYTES)
    db.user_manager.add_auth_token(user['_id'], auth_token)

    response = jsonify({
        'message': 'Login successful',
        'data': {
            'username': user['username']
        }
    })
    response.set_cookie('auth_token', auth_token)
    return response, 200


@app.route('/myprofile', methods=['GET'])
@login_required
def get_user(current_user):
    user = db.user_manager.get_user(username=current_user['username'])
    return jsonify({
        'message': 'Profile retrieved successfully',
        'data': db.serialize_mongo_doc(user)
    }), 200

@app.route('/users/delete/<user_id>', methods=['DELETE'])
@login_required
def delete_user(current_user, user_id):
    try:
        if not ObjectId.is_valid(user_id):
            return jsonify({'error': 'Invalid user ID format'}), 400

        success = db.user_manager.delete_user(user_id=user_id)
        if not success:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete user'}), 500

@app.route('/googlelogin')
def google_login():
    session['return_to'] = request.args.get('return_to', '/myprofile')
    auth_url = googlecalendar.get_authorization_url(session)
    return redirect(auth_url)

@app.route('/googlecallback')
def google_callback():
    auth_token = request.cookies.get('auth_token')
    events_added, error = googlecalendar.handle_callback(
        session=session,
        request_url=request.url,
        auth_token=auth_token,
        user_manager=db.user_manager,
        event_manager=db.event_manager
    )

    # sorry if this messes up production, I'm not sure how to do this properly so sorry in advance
    frontend_url = f"{FRONTEND_URL}/calendar"
    if error:
        return redirect(f"{frontend_url}?error={error}")
    
    response = redirect(f"{frontend_url}?success=true&count={events_added}")
    response.set_cookie('auth_token', auth_token)
    return response

@app.route('/addevent', methods=['POST'])
@login_required
def add_event(current_user):
    try:
        event_data = request.json
        event_fields = ["title", "description", "start_time", "end_time"]
        for field in event_fields:
            if field not in event_data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        event = db.event_manager.add_event(
            user_id=str(current_user['_id']),
            title=event_data["title"],
            description=event_data["description"],
            start_time=event_data["start_time"],
            end_time=event_data["end_time"],
            visibility=event_data.get("visibility", True),
            comments=event_data.get("comments", [])
        )
        
        return jsonify({
            'message': 'Event created successfully',
            'data': db.serialize_mongo_doc(event)
        }), 201

    except Exception as e:
        return jsonify({'error': 'Failed to create event'}), 500

@app.route('/getevents', methods=['GET'])
@login_required
def get_events(current_user):
    try:
        events = db.event_manager.get_events(user_id=str(current_user['_id']))
        return jsonify({
            'message': 'Events retrieved successfully',
            'data': [db.serialize_mongo_doc(event) for event in events]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve events'}), 500

@app.route('/events/<event_id>', methods=['GET'])
@login_required
def get_event(current_user, event_id):
    try:
        if not ObjectId.is_valid(event_id):
            return jsonify({'error': 'Invalid event ID format'}), 400

        event = db.event_manager.get_event(event_id=ObjectId(event_id))
        if not event:
            return jsonify({'error': 'Event not found'}), 404

        # Allow if user is event creator
        if event['user_id'] == str(current_user['_id']):
            return jsonify({
                'message': 'Event retrieved successfully',
                'data': db.serialize_mongo_doc(event)
            }), 200

        # Check privacy - if public, allow access
        if event.get('visibility', True):
            return jsonify({
                'message': 'Event retrieved successfully',
                'data': db.serialize_mongo_doc(event)
            }), 200

        # For private events, check friendship status
        is_friend = db.friend_manager.are_friends(str(current_user['_id']), event['user_id'])
        if not is_friend:
            return jsonify({'error': 'Event not found'}), 404

        return jsonify({
            'message': 'Event retrieved successfully',
            'data': db.serialize_mongo_doc(event)
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to retrieve event'}), 500

@app.route('/events/<event_id>', methods=['DELETE'])
@login_required
def delete_event(current_user, event_id):
    try:
        if not ObjectId.is_valid(event_id):
            return jsonify({'error': 'Invalid event ID format'}), 400

        # Get event to check ownership
        event = db.event_manager.get_event(event_id=ObjectId(event_id))
        if not event:
            return jsonify({'error': 'Event not found'}), 404
            
        if event['user_id'] != str(current_user['_id']):
            return jsonify({'error': 'Unauthorized to delete this event'}), 403

        success = db.event_manager.delete_event(event_id=ObjectId(event_id))
        return jsonify({'message': 'Event deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to delete event'}), 500

@app.route('/events/<event_id>', methods=['PATCH'])
@login_required
def edit_event(_current_user, event_id):
    try:
        if not ObjectId.is_valid(event_id):
            return jsonify({'error': 'Invalid event ID format'}), 400

        update_data = request.get_json()
        if not update_data:
            return jsonify({'error': 'No update data provided'}), 400

        success = db.event_manager.edit_event(event_id=ObjectId(event_id), **update_data)
        if not success:
            return jsonify({'error': 'Event not found'}), 404

        return jsonify({'message': 'Event updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update event'}), 500

@app.route('/updateprofile', methods=['PATCH'])
@login_required
def update_profile(current_user):
    try:
        update_data = request.json
        success = db.user_manager.update_user_profile(
            user_id=str(current_user['_id']),
            **update_data
        )
        if not success:
            return jsonify({'error': 'Failed to update profile'}), 400

        # Get updated user data
        updated_user = db.user_manager.get_user(username=current_user['username'])
        return jsonify({
            'message': 'Profile updated successfully',
            'data': db.serialize_mongo_doc(updated_user)
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to update profile'}), 500

@app.route('/friends/add', methods=['POST'])
@login_required
def add_friend(current_user):
    try:
        if not request.json or 'friend_id' not in request.json:
            return jsonify({'error': 'Missing friend_id in request'}), 400

        friend_id = request.json['friend_id']
        if not ObjectId.is_valid(friend_id):
            return jsonify({'error': 'Invalid friend ID format'}), 400

        success = db.friend_manager.add_friend(
            user_id=str(current_user['_id']), 
            friend_id=friend_id
        )
        if not success:
            return jsonify({'error': 'Failed to add friend'}), 400

        return jsonify({'message': 'Friend added successfully'}), 201

    except Exception as e:
        return jsonify({'error': 'Failed to add friend'}), 500

@app.route('/friends/remove', methods=['POST'])
@login_required
def remove_friend(current_user):
    try:
        if not request.json or 'friend_id' not in request.json:
            return jsonify({'error': 'Missing friend_id in request'}), 400

        friend_id = request.json['friend_id']
        if not ObjectId.is_valid(friend_id):
            return jsonify({'error': 'Invalid friend ID format'}), 400

        success = db.friend_manager.remove_friend(str(current_user['_id']), friend_id)
        if not success:
            return jsonify({'error': 'Friend relationship not found'}), 404

        return jsonify({'message': 'Friend removed successfully'}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to remove friend'}), 500

@app.route('/friends', methods=['GET'])
@login_required
def get_friends(current_user):
    try:
        friends = db.friend_manager.get_friends(str(current_user['_id']))
        return jsonify({
            'message': 'Friends retrieved successfully',
            'data': [db.serialize_mongo_doc(friend) for friend in friends]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve friends'}), 500

@app.route('/friends/events', methods=['GET'])
@login_required
def get_friends_events(current_user):
    try:
        events = db.friend_manager.get_friends_events(str(current_user['_id']))
        return jsonify({
            'message': 'Friends\' events retrieved successfully',
            'data': [db.serialize_mongo_doc(event) for event in events]
        }), 200
    except Exception as e:
        return jsonify({'error': 'Failed to retrieve friends\' events'}), 500
