"""
Miscellaneous functions and middleware related
to data validation and manipulation
"""
from typing import List
from flask import request

from .error_utils import InvalidInputError


def require_data(*fields: List):
    def inner(func):
        def func_wrapper(*args, **kwargs):
            data = request.json
            for field in fields:
                if field not in data:
                    error_message = 'Data must contain fields ' + str(fields)
                    raise InvalidInputError(error_message)

            return func(*args, **kwargs)
        
        func_wrapper.__name__ = func.__name__
        return func_wrapper
        
    return inner