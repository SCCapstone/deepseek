from typing import Dict
from datetime import datetime
from bson.objectid import ObjectId

from .database import DatabaseObject


class EventComment(DatabaseObject):
    schema = {
        '_id': {
            'type': ObjectId,
            'required': True,
            'unique': True,
        },
        'event_id': {
            'type': ObjectId,
            'required': True,
        },
        'user_id': {
            'type': ObjectId,
            'required': True,
            'unique': True,
        },
        'body': {
            'type': str,
            'required': True,
        },
        'created_at': {
            'type': datetime,
        },
    }

    def to_dict(self) -> Dict:
        return {
            'body': self.body,
            'created_at': self.created_at,
            'user_id': self.user_id,
        }