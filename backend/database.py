import pymongo
import uuid
from typing import List
from bson.objectid import ObjectId


# most definitely need to implement some error handling and some point
class Database:
    def __init__(self):
        self.client = pymongo.MongoClient('mongo', 27017)
        self.db = self.client.appdb

    def add_user(
        self,
        username: str,
        password: str,
        name: str = None,
        bio: str = None, 
        events: List = [],
        default_event_visibility: bool = False,
        followers: List = [], 
        following: List = [],
        auth_tokens: List = None
    ):
        user_doc = {
            'name' : name,
            'username' : username, 
            'hashed_password' : password,
            'bio' : bio,
            'events' : events,
            'default_event_visibility' : default_event_visibility,
            'followers' : followers, 
            'following' : following,
            'auth_tokens' : auth_tokens
        }
        self.db.users.insert_one(user_doc)
        return self.db.users.find_one({'username': username})

    def get_user(self, username : str, password : str = None):
        if password:
            return self.db.users.find_one({'username': username, 'hashed_password' : password})
        
        return self.db.users.find_one({'username': username})

    def get_token_user(self, auth_token: str):
        current_user = self.db.users.find_one({'auth_tokens': auth_token})
        return current_user

    def add_auth_token(self, user_id: int, auth_token: str):
        self.db.users.update_one({'_id': user_id}, {'$push': {'auth_tokens': auth_token}})

    def add_event(
        self, 
        user_id : int, 
        title : str,
        description : str,
        start_time : str,
        end_time : str,
        visibility : bool = False,
        comments : List = []
    ):
        if start_time >= end_time:
            raise ValueError("start_time must be earlier than end_time.")
        
        event_doc = {'user_id' : user_id,'title' : title, 'description' : description,
                     'start_time' : start_time, 'end_time' : end_time,
                     'visibility' : visibility, 'comments' : comments}
        result = self.db.events.insert_one(event_doc)
        event_id = str(result.inserted_id)
        return event_id
    
    def get_events(self, user_id: str) -> List:
        return list(self.db.events.find({'user_id' : user_id}))
    
    def get_event(self, event_id: str) -> dict:
        return self.db.events.find_one({'_id' : ObjectId(event_id)})
    
    def delete_event(self, event_id: str):
        return self.db.events.delete_one({'_id' : ObjectId(event_id)})
    
    def edit_event(self, event_id: str, **kwargs):
        return self.db.events.update_one({'_id' : ObjectId(event_id)}, {'$set' : kwargs})
