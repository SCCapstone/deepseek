"""
Abstraction for event data in database
"""
from typing import Dict, List
from datetime import datetime
from bson import ObjectId

from utils.error_utils import *
from .database import DatabaseObject, Database
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
        'likes': {'type': list, 'required': True, 'default': []},  # List of user ObjectIds
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
            'like_count': len(self.likes),
        }
    
    @property
    def comments(self) -> List[EventComment]:
        return EventComment.find(event_id=self._id)
    
    def add_comment(self, user_id: ObjectId, body: str, reply_to_who: ObjectId=None, reply_to_when: datetime=None) -> EventComment:
        comment = EventComment.create(
            event_id=self._id,
            user_id=user_id,
            body=body,
            created_at=datetime.now(),
            reply_to_who=reply_to_who,
            reply_to_when=reply_to_when,
        )
        return comment
    
    def add_like(self, user_id: ObjectId):
        if user_id not in self.likes:
            db = Database()
            db.push_to_array(self.get_table_name(), self._id, 'likes', user_id)
            # Update the local object state as well
            self.likes.append(user_id)

    def remove_like(self, user_id: ObjectId):
        if user_id in self.likes:
            db = Database()
            db.pull_from_array(self.get_table_name(), self._id, 'likes', user_id)
            # Update the local object state as well
            self.likes.remove(user_id)
    