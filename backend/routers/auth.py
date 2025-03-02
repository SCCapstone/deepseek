"""
Flask routes for authentication-related API endpoints
"""
from flask import Blueprint, request, make_response

from db import User
from utils.data_utils import *
from utils.error_utils import NotFoundError


auth_router = Blueprint('auth_router', __name__)


@auth_router.route('/register', methods=['POST'])
@data_filter({
    'username': {'type': str, 'required': True},
    'email': {'type': str, 'required': True},
    'password': {'type': str, 'required': True}
})
def register():
    # getting user data
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']

    # creating new user
    new_user = User.register(username=username, email=email, password=password)
    auth_token = new_user.new_token()

    # returning result to user
    profile = email
    res = make_response({'message': 'User registered', 'data': {'user': profile}}, 201)
    res.set_cookie('auth_token', auth_token)
    return res


@auth_router.route('/login', methods=['POST'])
@data_filter({
    'username': {'type': str, 'required': True},
    'password': {'type': str, 'required': True}
})
def login():
    # getting user data
    data = request.json
    username = data['username']
    password = data['password']

    # validating user
    user = User.login(username=username, password=password)
    if not user:
        raise NotFoundError('Invalid user credentials')

    # returning response to user with token as cookie
    auth_token = user.new_token()
    profile = user.profile
    res = make_response({'message': 'User authenticated', 'data': {'user': profile}})
    res.set_cookie('auth_token', auth_token)
    return res