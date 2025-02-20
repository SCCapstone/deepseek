import logging
from typing import Optional, Dict, Any, List
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class UserManager:
    def __init__(self, db):
        self.db = db

    def add_user(
        self,
        username: str,
        password: str,
        name: Optional[str] = None,
        bio: Optional[str] = None,
        events: Optional[List] = None,
        default_event_visibility: bool = False,
        friends: Optional[List] = None,
        auth_tokens: Optional[List] = None
    ) -> Optional[Dict[str, Any]]:
        
        user_doc = {
            'name': name,
            'username': username,
            'hashed_password': password,
            'bio': bio,
            'events': events or [],
            'default_event_visibility': default_event_visibility,
            'followers': friends or [],
            'auth_tokens': auth_tokens or []
        }
        try:
            result = self.db.users.insert_one(user_doc)
            if result.inserted_id:
                return self.get_user(username)
        except PyMongoError as e:
            logger.error(f"Failed to add user: {e}")
        return None

    def get_user(self, username: str, password: Optional[str] = None) -> Optional[Dict[str, Any]]:
        query = {'username': username}
        if password:
            query['hashed_password'] = password
        try:
            return self.db.users.find_one(query)
        except PyMongoError as e:
            logger.error(f"Failed to retrieve user: {e}")
        return None

    def delete_user(self, user_id: str) -> bool:
        try:
            result = self.db.users.delete_one({'_id': ObjectId(user_id)})
            return result.deleted_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to delete user: {e}")
        return False

    # this one gets a user based on their token
    def get_token_user(self, auth_token: str) -> Optional[Dict[str, Any]]:
        try:
            return self.db.users.find_one({'auth_tokens': auth_token})
        except PyMongoError as e:
            logger.error(f"Failed to retrieve user by token: {e}")
        return None

    def add_auth_token(self, user_id: str, auth_token: str) -> bool:
        try:
            result = self.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$push': {'auth_tokens': auth_token}}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to add auth token: {e}")
        return False