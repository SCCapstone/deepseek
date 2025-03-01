"""
Miscellaneous functions and middleware related
to data validation and manipulation
"""
from typing import Dict
from flask import request

from .error_utils import InvalidInputError


def data_filter(schema: Dict):
    def inner(func):
        def wrapper(*args, **kwargs):
            data = request.json

            # making sure all data fields are in schema and are correct type
            for field in data:
                if field not in schema:
                    raise InvalidInputError('Invalid input data field `%s`' % field)
                
                value = data[field]
                _type = schema[field]['type']
                if not isinstance(value, _type):
                    raise InvalidInputError('Invalid type `%s` for data field `%s`, should be `%s`' % \
                        (str(type(value)), field, str(_type)))

            # checking to make sure required fields are set
            for field in schema:
                _schema = schema[field]
                if 'required' in _schema and _schema['required']:
                    if field not in data:
                        raise InvalidInputError('Field `%s` is required' % field)

            return func(*args, **kwargs)
        
        wrapper.__name__ = func.__name__
        return wrapper
        
    return inner
