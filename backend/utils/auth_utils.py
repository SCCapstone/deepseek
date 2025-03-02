"""
Miscellaneous and middleware related to authentication

Contains authentication wrapper for login-protected pages
"""
from flask import request

import hashlib
from secrets import token_hex
from datetime import datetime
from db import User, AuthToken
from .error_utils import UnauthorizedError

AUTH_TOKEN_BYTES = 32


def hash_password(password: str) -> str:
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()
    return hashed_password


def new_token(user: User) -> str:
    # generating a new authentication token and storing in database
    token = token_hex(AUTH_TOKEN_BYTES)
    AuthToken.create(
        user_id=user._id,
        token=token,
        created_at=datetime.now()
    )
    return token


def login_required(func):
    def func_wrapper(*args, **kwargs):
        # getting auth token from HTTP request
        token = request.cookies.get('auth_token')
        if not token:
            raise UnauthorizedError('Missing login token')
        
        # search for auth token in database
        auth_token = AuthToken.find_one(token=token)
        if not auth_token:
            raise UnauthorizedError('Invalid authentication token')
        
        # make sure user exists
        current_user = User.find_one(_id=auth_token.user_id)
        if not current_user:
            raise UnauthorizedError('Could not validate authentication token')
        
        if not current_user:
            raise UnauthorizedError('Invalid auth credentials')

        # continuing to protected route
        return func(current_user, *args, **kwargs)

    func_wrapper.__name__ = func.__name__
    return func_wrapper