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
        email: str,
        name: Optional[str] = None,
        bio: Optional[str] = None,
        profile_picture: Optional[str] = None,  # URL to profile picture
        events: Optional[List] = None,
        default_event_visibility: bool = False,
        friends: Optional[List] = None,
        auth_tokens: Optional[List] = None
    ) -> Optional[Dict[str, Any]]:
        
        user_doc = {
            'name': name,
            'username': username,
            'email': email,
            'hashed_password': password,
            'bio': bio,
            'profile_picture': profile_picture or 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
            'events': events or [],
            'default_event_visibility': default_event_visibility,
            'followers': friends or [],
            'auth_tokens': auth_tokens or [],
            'notifications': []
        }
        try:
            result = self.db.users.insert_one(user_doc)
            if result.inserted_id:
                return self.get_user(username)
        except PyMongoError as e:
            logger.error(f"Failed to add user: {e}")
        return None

    def get_user(self, username: Optional[str] = None, password: Optional[str] = None, email: Optional[str] = None) -> Optional[Dict[str, Any]]:
        try:
            # Build query based on provided parameters
            query = {}
            if username:
                query['username'] = username
            if email:
                query['email'] = email
            if password:
                query['hashed_password'] = password
            
            if not query:  # If no parameters provided
                return None
            
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

    def update_profile_picture(self, user_id: str, profile_picture_url: str) -> bool:
        """Update user's profile picture URL."""
        try:
            result = self.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'profile_picture': profile_picture_url}}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to update profile picture: {e}")
            return False

    def update_user_profile(self, user_id: str, **update_fields) -> bool:
        """Update user profile fields."""
        try:
            allowed_fields = {'name', 'bio', 'profile_picture', 'email', 'default_event_visibility'}
            update_data = {k: v for k, v in update_fields.items() if k in allowed_fields}
            
            if not update_data:
                return False
            
            result = self.db.users.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_data}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to update user profile: {e}")
            return False
    
    def add_notification(self, user_id: str, message: str) -> bool:
        """Add a new notification to a user."""
        try:
            notification = {
                "message": message,
                "is_read": False  # Default to unread
            }
            result = self.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"notifications": notification}}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to add notification: {e}")
            
    def get_notifications(self, user_id: str) -> List[Dict[str, Any]]:
        """Retrieve all notifications for a user."""
        try:
            user = self.db.users.find_one({"_id": ObjectId(user_id)}, {"notifications": 1})
            return user.get("notifications", []) if user else []
        except PyMongoError as e:
            logger.error(f"Failed to retrieve notifications: {e}")
        return []

    def mark_notifications_as_read(self, user_id: str) -> bool:
        """Mark all notifications as read for a user."""
        try:
            result = self.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"notifications.$[].is_read": True}}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to mark notifications as read: {e}")
        return False

    def clear_notifications(self, user_id: str):
        """Clear all notifications for a user."""
        try:
            result = self.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"notifications": []}}  # Clears all notifications
            )
            return result
        except PyMongoError as e:
            logger.error(f"Failed to clear notifications: {e}")
            raise
