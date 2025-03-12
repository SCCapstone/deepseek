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
        'date': {'type': str, 'required': True},
        'start_time': {'type': str, 'required': True},
        'end_time': {'type': str, 'required': True},
        'created_at': {'type': datetime},
        'public': {'type': bool, 'required': True, 'default': False},
        'set_reminder': {'type': bool, 'required': True, 'default': False},
        'reminder_sent': {'type': bool, 'required': True, 'default': False},
        'location': {'type': str},
    }

    def to_dict(self) -> Dict:
        return {
            'id': str(self._id),
            'title': self.title,
            'description': self.description,
            'date': self.date,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'created_at': self.created_at,
            'public': self.public,
            'set_reminder': self.set_reminder,
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
    