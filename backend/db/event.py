"""
Abstraction for event data in database
"""
from typing import Dict
from datetime import datetime
from bson.objectid import ObjectId

from utils.error_utils import *
from .database import DatabaseObject


class Event(DatabaseObject):
    schema = {
        '_id': {'type': ObjectId, 'required': True, 'unique': True},
        'user_id': {'type': ObjectId, 'required': True},
        'title': {'type': str, 'required': True},
        'description': {'type': str},
        'start_time': {'type': str},
        'end_time': {'type': str},
        'created_at': {'type': datetime},
        'public': {'type': bool, 'required': True, 'default': False},
        'reminder': {'type': bool, 'required': True, 'default': False},
        'reminder_sent': {'type': bool, 'required': True, 'default': False},
    }
    
    @property
    def data(self) -> Dict:
        return {
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'created_at': self.created_at,
            'public': self.public,
            'reminder': self.reminder,
        }