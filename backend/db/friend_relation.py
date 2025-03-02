"""
Abstraction for friend relation data in database
"""
from datetime import datetime
from bson.objectid import ObjectId

from .database import DatabaseObject


class FriendRelation(DatabaseObject):
    schema = {
        '_id': {'type': ObjectId, 'required': True, 'unique': True},
        'user1_id': {'type': ObjectId, 'required': True},
        'user2_id': {'type': ObjectId, 'required': True},
        'status': {'type': str, 'required': True},
        'created_at': {'type': datetime, 'required': True},
    }