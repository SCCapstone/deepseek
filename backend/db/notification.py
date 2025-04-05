"""
Abstraction for notification data in database
"""
from typing import Dict
from datetime import datetime
from bson.objectid import ObjectId

from utils.error_utils import *
from .database import DatabaseObject


class Notification(DatabaseObject):
    schema = {
        '_id': {'type': ObjectId, 'required': True, 'unique': True},
        'user_id': {'type': ObjectId, 'required': True},
        'message': {'type': str},
        'is_read': {'type': bool, 'required': True, 'default': False},
        'created_at': {'type': datetime},
        'type': {'type': str, 'required': True},
        'event_id': {'type': ObjectId, 'required': False},
        'friend_id': {'type': ObjectId, 'required': False},
    }

    def to_dict(self) -> Dict:
        data = {
            'id': str(self._id),
            'message': self.message,
            'created_at': self.created_at,
            'is_read': self.is_read,
            'type': self.type,
            'event_id': str(self.event_id) if self.event_id else None,
            'friend_id': str(self.friend_id) if self.friend_id else None,
        }
        return data