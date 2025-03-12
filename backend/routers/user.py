"""
Flask routes for user-related API endpoints
"""
import os
import logging
from uuid import uuid4
from typing import Union
from flask import Blueprint, request, make_response, send_from_directory
from bson import ObjectId

from db import User
from utils.auth_utils import *
from utils.data_utils import *


logger = logging.getLogger(__name__)
user_router = Blueprint('user_router', __name__)


@user_router.route('/get-profile')
@login_required
def get_profile(current_user: User):
    profile = current_user.profile
    return make_response({'data': profile})


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
    current_user.update(**data)
    return make_response({'message': 'Success'})


@user_router.route('/delete-account', methods=['POST'])
@login_required
def delete_account(current_user):
    current_user.delete()
    return make_response({'message': 'Account deleted'})


@user_router.route('/get-user/<user_id>')
def get_user(user_id):
    user = User.find_one(_id=ObjectId(user_id))
    return make_response({'data': user.profile})


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
    upload_folder = os.environ.get('UPLOADS_FOLDER', './uploads')
    if not os.path.isdir(upload_folder):
        os.mkdir(upload_folder)
    save_path = os.path.join(upload_folder, filename)
    file.save(save_path)
    
    # returning saved file url to user
    hostname = os.environ.get('SERVER_HOSTNAME', 'http://localhost:5000')
    return make_response({
        'message': 'Successfuly uploaded picture',
        'data': {'url': hostname + '/pictures/' + filename}
    })


@user_router.route('/pictures/<filename>')
def get_picture(filename: str):
    upload_folder = os.environ.get('UPLOADS_FOLDER', './uploads')
    return send_from_directory(upload_folder, filename)


@user_router.route('/search-user')
def search_user():
    query = request.args.get('q')
    if not query or query == '' or query == ' ':
        raise InvalidInputError('Invalid query `%s` for user' % query)
    
    users = User.search(query)
    user_data = [x.profile for x in users]
    return make_response({'data': user_data})