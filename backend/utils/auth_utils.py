from flask import request, make_response

from db import User


def login_required(func):
    def func_wrapper(*args, **kwargs):
        auth_token = request.cookies.get('auth_token')
        current_user = User.auth(auth_token)
        if not current_user:
            return make_response({'message': 'Invalid credentials'}, 401)

        return func(current_user, *args, **kwargs)

    func_wrapper.__name__ = func.__name__
    return func_wrapper