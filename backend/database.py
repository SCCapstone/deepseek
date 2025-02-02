import pymongo
import uuid
from typing import List
from bson.objectid import ObjectId


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
        """
        inserts a user into the user collection with the following attributes
         - name : name of the user
         - username : username of the user
         - hashed_password : hashed password of the user
         - bio : bio of the user
         - events : list of events created by the user
         - default_event_visibility : boolean indicating whether the user's events are public by default
         - followers : list of users who follow the user
         - following : list of users that the user is following
         - auth_tokens : list of authentication tokens for the user
        """

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

    def get_user(
        self,
        username : str,
        password : str = None
    ):
        """
        returns the user with the given username and password
        if no password given, just searches and returns based on the username
        """
        if password:
            return self.db.users.find_one({'username': username, 'hashed_password' : password})
        
        return self.db.users.find_one({'username': username})

    def get_token_user(
        self,
        auth_token: str
    ):
        current_user = self.db.users.find_one({'auth_tokens': auth_token})
        return current_user

    def add_auth_token(
        self,
        user_id: int,
        auth_token: str,
    ):
        self.db.users.update_one({'_id': user_id}, {'$push': {'auth_tokens': auth_token}})

    def add_event(
        self, 
        user_id : int, 
        title : str,
        description : str,
        start_time : str,
        end_time : str,
        visibility : bool = False,
        comments : List = None
    ):
        """
        adds an event to the user's events list with attributes
         - user_id : the id of the user who created the event
         - title : the title of the event
         - description : the description of the event
         - start_time : the start time of the event
         - end_time : the end time of the event
         - visibility : whether the event is visible to others or not
         - comments : a list of comments on the event
        """
        if comments is None:
            comments = []
        
        if start_time >= end_time:
            raise ValueError("start_time must be earlier than end_time.")
        
        event_doc = {'user_id' : user_id,'title' : title, 'description' : description,
                     'start_time' : start_time, 'end_time' : end_time,
                     'visibility' : visibility, 'comments' : comments}
        result = self.db.events.insert_one(event_doc)

        event_id = str(result.inserted_id)

        return event_id
    
    def get_events(self, user_id : str) -> List:
        """
        returns a list of events for a given user
         - user_id : the id of the user who created the event
        """
        return list(self.db.events.find({'user_id' : user_id}))
    
    def get_event(self, event_id : str) -> dict:
        """
        returns a single event for a given event id
         - event_id : the id of the event to retrieve
        """
        return self.db.events.find_one({'_id' : ObjectId(event_id)})
