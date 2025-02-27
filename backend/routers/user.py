"""
Flask routes for user-related API endpoints
"""
from flask import Blueprint, request, make_response, jsonify

from utils.auth_utils import *
from utils.data_utils import *


user_router = Blueprint('user_router', __name__)


@user_router.route('/get-profile', methods=['GET'])
@login_required
def get_profile(current_user):
    profile = current_user.profile
    return make_response({'user': profile})


@user_router.route('/update-profile', methods=['POST'])
@login_required
def update_profile(current_user):
    pass


@user_router.route('/delete-account', methods=['POST'])
@login_required
def delete_account(current_user):
    current_user.delete()
    return make_response({'message': 'Account deleted'})