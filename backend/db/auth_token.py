from datetime import datetime
from bson.objectid import ObjectId

from .database import DatabaseObject


class AuthToken(DatabaseObject):
    schema = {
        '_id': {'type': ObjectId, 'required': True, 'unique': True},
        'user_id': {'type': ObjectId, 'required': True},
        'token': {'type': str, 'required': True, 'unique': True},
        'created_at': {'type': datetime},
    }