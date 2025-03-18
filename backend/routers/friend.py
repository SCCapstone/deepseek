"""
Flask routes for friend-related API endpoints
"""
from flask import Blueprint, make_response

from utils.auth_utils import *
from utils.data_utils import *
from utils.error_utils import NotFoundError
from db import User


friend_router = Blueprint('friend_router', __name__, url_prefix='/friends')


@friend_router.route('/get-friends')
@login_required
def get_friends(current_user: User):
    # friends = FriendRelation.get_friends(current_user)
    friends = current_user.friends
    friends_data = [x.profile for x in friends]
    return make_response({'data': friends_data})


@friend_router.route('/get-user-friends/<username>')
def get_user_friends(username: str):
    user = User.find_one(username=username)
    if not user:
        raise NotFoundError('No user with username \'%s\'' % username)
    
    friends = user.friends
    friend_data = [x.profile for x in friends]
    return make_response({'data': friend_data})


@friend_router.route('/add/<friend_username>', methods=['POST'])
@login_required
def add_friend(current_user: User, friend_username: str):
    # finding other user in database
    other_user = User.find_one(username=friend_username)
    if not other_user:
        raise NotFoundError('No user with username `%s`' % friend_username)
    
    if other_user == current_user:
        raise InvalidInputError('You cannot friend yourself')
    
    # accepting or sending request
    current_user.add_friend(other_user)
    return make_response({'message': 'Success'}, 201)


@friend_router.route('/remove/<friend_username>', methods=['POST'])
@login_required
def remove_friend(current_user: User, friend_username: str):
    # finding other user in database
    other_user = User.find_one(username=friend_username)
    if not other_user:
        raise NotFoundError('No user with username `%s`' % friend_username)
    
    # deleting friend relation records
    current_user.remove_friend(other_user)
    return make_response({'message': 'Successfuly removed friend'})