import pymongo
from pymongo.errors import PyMongoError
from user_manager import UserManager
from event_manager import EventManager
from friend_manager import FriendManager

# base class for the database
class Database:
    def __init__(self, host: str = 'mongo', port: int = 27017, db_name: str = 'appdb'):
        try:
            self.client = pymongo.MongoClient(host, port)
            self.db = self.client[db_name]
            self.friend_manager = FriendManager(self.db)
            self.user_manager = UserManager(self.db)
            self.event_manager = EventManager(self.db)
            print(f"Connected to MongoDB at {host}:{port}")
        except PyMongoError as e:
            print(f"Failed to connect to MongoDB: {e}")
            raise