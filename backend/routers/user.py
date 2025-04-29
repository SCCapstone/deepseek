"""
Flask routes for user-related API endpoints
"""
import os
import logging
from uuid import uuid4
from typing import Union
from flask import Blueprint, request, make_response, send_from_directory
from bson import ObjectId
import re

from db import User, Event
from utils.auth_utils import *
from utils.data_utils import *


logger = logging.getLogger(__name__)
user_router = Blueprint('user_router', __name__)


@user_router.route('/get-profile')
@login_required
def get_profile(current_user: User):
    profile = current_user.profile
    return make_response({'data': profile})


@user_router.route('/get-profile/<username>')
def get_user(username: str):
    user = User.find_one(username=username)
    profile_data = user.profile
    return make_response({'data': profile_data})


@user_router.route('/get-settings')
@login_required
def get_settings(current_user: User):
    settings = current_user.settings
    return make_response({'data': settings})


@user_router.route('/update-profile', methods=['POST'])
@login_required
@data_filter({
    'username': {'type': Union[str, None]},
    'email': {'type': Union[str, None]},
    'bio': {'type': Union[str, None]},
    'name': {'type': Union[str, None]},
    'default_event_visibility': {'type': Union[bool, None]},
    'profile_picture': {'type': Union[str, None]},
})
def update_profile(current_user: User):
    data = request.json
    
    if 'email' in data and data['email'] is not None:
        email = data['email']
        if not email_check(email):
            raise InvalidInputError('Invalid email')
            
    current_user.update(**data)
    return make_response({'message': 'Success'})

@user_router.route('/update-settings', methods=['POST'])
@login_required
@data_filter({
    'email': {'type': Union[str, None]},
    'default_event_visibility': {'type': Union[bool, None]},
    'default_reminder': {'type': Union[bool, None]},
})
def update_settings(current_user: User):
    data = request.json

    if 'email' in data and data['email'] is not None:
        email = data['email']
        if not email_check(email):
            raise InvalidInputError('Invalid email')
        
    current_user.update(**data)
    return make_response({'message': 'Settings updated successfully'})



@user_router.route('/delete-account', methods=['POST'])
@login_required
def delete_account(current_user):
    current_user.delete()
    return make_response({'message': 'Account deleted'})


@user_router.route('/upload-picture', methods=['POST'])
@login_required
def upload_picture(current_user: User):
    # getting file from request
    if 'file' not in request.files:
        raise InvalidInputError('Request must contain file data')
    file = request.files['file']

    # making sure file is an image
    if file.mimetype not in ['image/jpeg', 'image/png']:
        raise InvalidInputError('Invalid file type \'%s\'' % file.mimetype)

    # saving file in uploads folder
    _, suffix = file.mimetype.split('/')
    filename = str(uuid4()) + '.' + suffix
    
    # get upload folder path
    APP_ROOT = os.path.dirname(os.path.abspath(__file__))

    # Go up one level from routers directory if needed
    base_dir = os.path.dirname(APP_ROOT) 
    upload_folder = os.environ.get('UPLOADS_FOLDER', os.path.join(base_dir, 'uploads'))
    
    # Create the uploads directory if it doesn't exist
    os.makedirs(upload_folder, exist_ok=True)
    
    save_path = os.path.join(upload_folder, filename)
    file.save(save_path)
    
    # returning saved file url to user
    hostname = os.environ.get('BACKEND_URL', 'http://localhost:5000')
    
    # Use the static endpoint defined in app.py
    file_url = hostname + '/static/images/' + filename
    logger.info(f"Saved image at: {save_path}")
    logger.info(f"Image URL will be: {file_url}")
    
    # Update user profile with the new image URL
    current_user.update(profile_picture=file_url)
    
    return make_response({
        'message': 'Successfully uploaded picture',
        'data': {'url': file_url}
    })


@user_router.route('/search-user')
def search_user():
    query = request.args.get('q')
    if not query or query == '' or query == ' ':
        raise InvalidInputError('Invalid query `%s` for user' % query)
    
    users = User.search(query)
    user_data = [x.profile for x in users]
    return make_response({'data': user_data})


@user_router.route('/get-liked-events')
@login_required
def get_liked_events(current_user: User):
    liked_event_ids = current_user.liked_events
    liked_events = []
    for event_id in liked_event_ids:
        event = Event.find_one(_id=event_id)
        if event:
            event_data = event.to_dict()
            # Optionally fetch and add user profile data to each event
            event_user = User.find_one(_id=event.user_id)
            if event_user:
                event_data['user'] = event_user.profile
            liked_events.append(event_data)
        else:
            return make_response({'message': 'Event not found', 'data': []})
            # Handle case where event ID exists in user's liked list but event is deleted
            # Optionally remove the stale ID from the user's list
            # current_user.unlike_event(event_id) # This might be too aggressive without confirmation
            
    return make_response({'message': 'Liked events retrieved', 'data': liked_events})