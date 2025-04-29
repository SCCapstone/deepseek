"""
Flask routes for authentication-related API endpoints
"""
import os # Import os
from datetime import datetime
from flask import Blueprint, request, make_response
import pytz
from db import User
from utils.data_utils import *
from utils.auth_utils import hash_password, create_access_token, email_check
from utils.error_utils import NotFoundError

# Determine if we're in production for cookie settings
IS_PRODUCTION = os.getenv('ENVIRONMENT') == 'production'

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

    # check if the data is valid
    if not username or not email or not password:
        raise InvalidInputError('Please provide all required fields')

    # checking for existing user
    if User.find_one(username=username):
        raise InvalidInputError('Existing account with that username')
    if User.find_one(email=email):
        raise InvalidInputError('Existing account with that email')
    
    # checking if the email is valid
    if not email_check(email):
        raise InvalidInputError('Invalid email')

    # hashing password
    hashed_password = hash_password(password)
    created_at = datetime.now(pytz.timezone('US/Eastern'))
    new_user = User.create(
        username=username,
        email=email,
        hashed_password=hashed_password,
        created_at=created_at,
    )

    # Create JWT access token
    profile = new_user.profile
    profile['profile_picture'] = 'default-profile-picture-url'
    access_token = create_access_token({"_id": new_user._id})

    # returning result to user
    response_data = {
        'message': 'User registered',
        'data': {
            'user': profile,
            'auth_token': access_token
        }
    }
    res = make_response(response_data, 201)
    res.set_cookie(
        'auth_token',
        access_token,
        path='/', # Make cookie available site-wide
        secure=IS_PRODUCTION, # Send only over HTTPS in production
        httponly=False, # Allow JS access (needed for frontend)
        samesite='Lax' if IS_PRODUCTION else None # Set SameSite for cross-domain
    )
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

    # Create JWT access token
    profile = user.profile
    access_token = create_access_token({"_id": user._id})
    response_data = {
        'message': 'User authenticated',
        'data': {
            'user': profile,
            'auth_token': access_token
        }
    }
    res = make_response(response_data)
    res.set_cookie(
        'auth_token',
        access_token,
        path='/', # Make cookie available site-wide
        secure=IS_PRODUCTION, # Send only over HTTPS in production
        httponly=False, # Allow JS access (needed for frontend)
        samesite='Lax' if IS_PRODUCTION else None # Set SameSite for cross-domain
    )
    return res

@auth_router.route('/logout', methods=['POST'])
def logout():
    res = make_response({'message': 'User logged out'})
    res.set_cookie(
        'auth_token', 
        '', 
        expires=0, 
        path='/', # Clear cookie site-wide
        secure=IS_PRODUCTION,
        httponly=False,
        samesite='Lax' if IS_PRODUCTION else None
        )
    return res
