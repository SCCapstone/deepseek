from flask import Blueprint, request, make_response

from db import User
from utils.data_utils import require_data


auth_router = Blueprint('auth_router', __name__)


@auth_router.route('/register', methods=['POST'])
@require_data('username', 'email', 'password')
def register():
    # getting user data
    data = request.json
    username = data['username']
    email = data['email']
    password = data['password']

    # creating new user
    new_user = User.create(username=username, email=email, password=password)
    auth_token = new_user.new_token()

    # returning result to user
    res = make_response({'message': 'User registered'}, 201)
    res.set_cookie('auth_token', auth_token)
    return res


@auth_router.route('/login', methods=['POST'])
@require_data('username', 'password')
def login():
    # getting user data
    data = request.json
    username = data['username']
    password = data['password']

    # validating user
    user = User.login(username=username, password=password)
    if not user:
        return make_response({'message': 'Could not authenticate'})

    # returning response to user
    auth_token = user.new_token()
    res = make_response({'message': 'User authenticated'})
    res.set_cookie('auth_token', auth_token)
    return res