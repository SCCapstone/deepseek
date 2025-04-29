from datetime import datetime, timedelta, timezone
from bson import ObjectId
from .database import Database, DatabaseObject

class RefreshToken(DatabaseObject):
    schema = {
        'user_id': {'type': ObjectId, 'required': True},
        'token': {'type': str, 'required': True, 'unique': True}, # Ensure token is unique
        'expires_at': {'type': datetime, 'required': True},
        'created_at': {'type': datetime, 'default': lambda: datetime.now(timezone.utc)} # Use lambda for default
    }

    @staticmethod
    def create(user_id: ObjectId, token: str, expires_at: datetime):
        return DatabaseObject.create(
            user_id=user_id,
            token=token,
            expires_at=expires_at
        )

    @staticmethod
    def find_one(token: str):
        # Find non-expired token
        now = datetime.now(timezone.utc)
        # Update super call if DatabaseObject handles find_one differently
        return DatabaseObject.find_one(token=token, expires_at={'$gt': now})

    @staticmethod
    def delete_one(token: str):
         collection = Database.db()[RefreshToken.get_table_name()]
         result = collection.delete_one({'token': token})
         return result.deleted_count > 0

    @staticmethod
    def delete_all_for_user(user_id: ObjectId):
        collection = Database.db()[RefreshToken.get_table_name()]
        result = collection.delete_many({'user_id': user_id})
        return result.deleted_count 