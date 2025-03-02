"""
Flask routes for user-related API endpoints
"""
import logging
from typing import Union

from flask import Blueprint, request, make_response, jsonify
from bson import ObjectId


from utils.auth_utils import *
from utils.data_utils import *


logger = logging.getLogger(__name__)
user_router = Blueprint('user_router', __name__)


@user_router.route('/get-profile', methods=['GET'])
@login_required
def get_profile(current_user):
    profile = current_user.profile
    return make_response({'data': profile})


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
def update_profile(current_user):
    data = request.json
    current_user.update(**data)
    return make_response({'message': 'Success'})


@user_router.route('/delete-account', methods=['POST'])
@login_required
def delete_account(current_user):
    current_user.delete()
    return make_response({'message': 'Account deleted'})

@user_router.route('/get-user/<user_id>', methods=['GET'])
def get_user(user_id):
    user = User.find_one(_id=ObjectId(user_id))
    return make_response({'data': user.profile})

