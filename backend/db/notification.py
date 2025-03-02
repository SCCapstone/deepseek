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
        'created_at': {'type': datetime},
    }

    def to_dict(self) -> Dict:
        return {
            'message': self.message,
            'created_at': self.created_at,
        }