"""
Miscellaneous and middleware related to authentication

Contains authentication wrapper for login-protected pages
"""
from flask import request

from db import User
from .error_utils import UnauthorizedError


def login_required(func):
    def func_wrapper(*args, **kwargs):
        auth_token = request.cookies.get('auth_token')
        if not auth_token:
            raise UnauthorizedError('Missing login token')
        
        current_user = User.auth(auth_token)
        if not current_user:
            raise UnauthorizedError('Invalid auth credentials')

        return func(current_user, *args, **kwargs)

    func_wrapper.__name__ = func.__name__
    return func_wrapper