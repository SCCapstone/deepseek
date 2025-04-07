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
        },
        'body': {
            'type': str,
            'required': True,
        },
        'created_at': {
            'type': datetime,
        },
        #User ID of original comment, if comment is a reply
        'reply_to_who': {
            'type': ObjectId,
            'required': True,
        },
        #Timestamp of original comment, if comment is a reply
        'reply_to_when': {
            'type' : datetime,
            'required' : True,
        },
    }

    def to_dict(self) -> Dict:
        return {
            'body': self.body,
            'created_at': self.created_at,
            'user_id': self.user_id,
            'reply_to_who' : self.reply_to_who,
            'reply_to_when' : self.reply_to_when,
        }