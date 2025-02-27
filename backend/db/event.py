"""
Abstraction for event data in database
"""
from datetime import datetime
from typing import List, Dict, Self
from bson.objectid import ObjectId

from utils.error_utils import *
from .database import Database


class Event:
    def __init__(
        self,
        _id: ObjectId,
        user_id: ObjectId,
        title: str,
        description: str,
        start_time: str,
        end_time: str,
        created_at: datetime,
        public: bool = False,
    ):
        self._id = _id
        self.user_id = user_id
        self.title = title
        self.description = description
        self.start_time = start_time
        self.end_time = end_time
        self.created_at = created_at
        self.public = public

    def dict(self):
        return {
            '_id': str(self._id),
            'user_id': str(self.user_id),
            'title': self.title,
            'description': self.description,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'public': self.public,
        }

    @staticmethod
    def find(**kwargs) -> List[Self]:
        db = Database()
        results = db.events.find(kwargs)
        events = []
        for res in results:
            new_event = Event(
                _id=res['_id'],
                user_id=res['user_id'],
                title=res['title'],
                description=res['description'],
                start_time=res['start_time'],
                end_time=res['end_time'],
                created_at=res['created_at'],
                public=res['public'],
            )
            events.append(new_event)
        return events
    
    @staticmethod
    def find_one(**kwargs) -> Self:
        results = Event.find(**kwargs)
        if len(results) > 0:
            return results[0]
        return None
    
    @staticmethod
    def create(
        user_id: ObjectId,
        title: str,
        description: str,
        start_time: str,
        end_time: str,
        public: bool = False,
        reminder: bool = False,
    ) -> Self:
        db = Database()
        event_doc = {
            'user_id': user_id,
            'title': title,
            'description': description,
            'start_time': start_time,
            'end_time': end_time,
            'public': public,
            'created_at': datetime.now(),
        }
        db.events.insert_one(event_doc)
        event = Event(**event_doc)
        return event
    
    def update(self, **kwargs):
        db = Database()
        db.events.update_one({'_id': self._id}, {'$set': kwargs})