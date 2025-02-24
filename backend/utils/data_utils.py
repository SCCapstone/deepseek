"""
Miscellaneous functions and middleware related
to data validation and manipulation
"""
from typing import List
from flask import request, make_response


def require_data(*fields: List):
    def inner(func):
        def func_wrapper(*args, **kwargs):
            data = request.json
            for field in fields:
                if field not in data:
                    return make_response({'message': 'Invalid input data'}, 400)

            return func(*args, **kwargs)
        
        func_wrapper.__name__ = func.__name__
        return func_wrapper
        
    return inner