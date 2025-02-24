"""
Miscellaneous and middleware related to authentication

Contains authentication wrapper for login-protected pages
"""
from flask import request, make_response

from db import User


def login_required(func):
    def func_wrapper(*args, **kwargs):
        auth_token = request.cookies.get('auth_token')
        if not auth_token:
            return make_response({'message': 'Login token required'}, 401)
        
        current_user = User.auth(auth_token)
        if not current_user:
            return make_response({'message': 'Invalid credentials'}, 401)

        return func(current_user, *args, **kwargs)

    func_wrapper.__name__ = func.__name__
    return func_wrapper