"""
Flask routes for friend-related API endpoints
"""
from flask import Blueprint, request, make_response, jsonify

from utils.auth_utils import *
from utils.data_utils import *
from utils.error_utils import NotFoundError
from db import User, FriendRelation


friend_router = Blueprint('friend_router', __name__, url_prefix='/friends')


@friend_router.route('/get-friends')
@login_required
def get_friends(current_user: User):
    friends = FriendRelation.get_friends(current_user)
    friend_data = [x.profile for x in friends]
    return make_response({'friends': friend_data})


@friend_router.route('/add/<friend_username>', methods=['POST'])
@login_required
def add_friend(current_user: User, friend_username):
    # finding other user in database
    other_user = User.find_one(username=friend_username)
    if not other_user:
        raise NotFoundError('No user with username `%s`' % friend_username)
    
    # accepting or sending request
    FriendRelation.add(current_user, other_user)
    return make_response({'message': 'Success'}, 201)