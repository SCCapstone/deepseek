"""
Abstraction for event data in database
"""
from typing import Dict, List
from datetime import datetime
from bson import ObjectId

from utils.error_utils import *
from .database import DatabaseObject
from .event_comment import EventComment


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
        'location': {'type': str},
    }

    def to_dict(self) -> Dict:
        return {
            'user_id': str(self.user_id),
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'created_at': self.created_at,
            'public': self.public,
            'reminder': self.reminder,
            'location': self.location,
        }
    
    @property
    def comments(self) -> List[EventComment]:
        return EventComment.find(event_id=self._id)
    
    def add_comment(self, user_id: ObjectId, body: str) -> EventComment:
        comment = EventComment.create(
            event_id=self._id,
            user_id=user_id,
            body=body,
            created_at=datetime.now(),
        )
        return comment
    