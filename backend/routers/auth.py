"""
Flask routes for authentication-related API endpoints
"""
from flask import Blueprint, request, make_response

from db import User
from utils.data_utils import *
from utils.auth_utils import hash_password, new_token
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

    # checking for existing user
    if User.find_one(username=username):
        raise InvalidInputError('Existing account with that username')
    if User.find_one(email=email):
        raise InvalidInputError('Existing account with that email')

    # hashing password
    hashed_password = hash_password(password)
    new_user = User.create(
        username=username,
        email=email,
        hashed_password=hashed_password,
    )

    # generating auth token and storing in database
    auth_token = new_token(new_user)

    # returning result to user
    profile = new_user.profile
    res = make_response({'message': 'User registered', 'data': {'user': profile}}, 201)
    res.set_cookie('auth_token', auth_token)
    return res


@auth_router.route('/login', methods=['POST'])
@data_filter({
    'username': {'type': str},
    'email': {'type': str},
    'password': {'type': str, 'required': True}
})
def login():
    # getting user data
    data = request.json
    password = data['password']
    username = data.get('username', None)
    email = data.get('email', None)

    # finding user in database
    if username:
        user = User.find_one(username=username)
        if not user:
            raise NotFoundError('No account with that username')
    elif email:
        user = User.find_one(email=email)
        if not user:
            raise NotFoundError('No account with that email')
    else:
        raise InvalidInputError('Please provide either username or email to login')
    
    # checking password
    hashed_password = hash_password(password)
    if user.hashed_password != hashed_password:
        raise InvalidInputError('Invalid password')

    # returning response to user with token as cookie
    auth_token = new_token(user)
    profile = user.profile
    res = make_response({'message': 'User authenticated', 'data': {'user': profile}})
    res.set_cookie('auth_token', auth_token)
    return res