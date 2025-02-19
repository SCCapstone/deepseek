from bson import ObjectId
import pymongo
from datetime import datetime
from typing import List, Dict

class FriendManager:
    def __init__(self, db):
        """
        Initializes the FriendManager with a database connection.

        Args:
            db: A database connection object (e.g., MongoDB client).
        """
        self.client = pymongo.MongoClient('mongo', 27017)
        self.db = self.client.appdb

    def add_friend(self, user_id: str, friend_id: str) -> bool:
        """
        Adds a friend relationship between two users.

        Args:
            user_id (str): The ID of the user adding a friend.
            friend_id (str): The ID of the user being added as a friend.

        Returns:
            bool: True if the friend was added successfully, False otherwise.
        """
        try:
            # Validate user_id and friend_id
            if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(friend_id):
                raise ValueError("Invalid user ID or friend ID")

            # Add the friend relationship
            self.db.friends.insert_one({
                "user_id": ObjectId(user_id),
                "friend_id": ObjectId(friend_id),
                "created_at": datetime.now()
            })
            return True

        except Exception as e:
            print(f"Error adding friend: {e}")
            return False

    def remove_friend(self, user_id: str, friend_id: str) -> bool:
        """
        Removes a friend relationship between two users.

        Args:
            user_id (str): The ID of the user removing a friend.
            friend_id (str): The ID of the user being removed as a friend.

        Returns:
            bool: True if the friend was removed successfully, False otherwise.
        """
        try:
            # Validate user_id and friend_id
            if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(friend_id):
                raise ValueError("Invalid user ID or friend ID")

            # Remove the friend relationship
            result = self.db.friends.delete_one({
                "user_id": ObjectId(user_id),
                "friend_id": ObjectId(friend_id)
            })
            return result.deleted_count > 0

        except Exception as e:
            print(f"Error removing friend: {e}")
            return False

    def get_friends(self, user_id: str) -> List[Dict]:
        """
        Retrieves a list of friends for a given user.

        Args:
            user_id (str): The ID of the user whose friends are being retrieved.

        Returns:
            List[Dict]: A list of friend objects, each containing friend details.
        """
        try:
            # Validate user_id
            if not ObjectId.is_valid(user_id):
                raise ValueError("Invalid user ID")

            # Fetch all friends for the user
            friends = self.db.friends.find({"user_id": ObjectId(user_id)})
            return [{"friend_id": str(friend["friend_id"]), "created_at": friend["created_at"]} for friend in friends]

        except Exception as e:
            print(f"Error fetching friends: {e}")
            return []

    def get_friends_events(self, user_id: str) -> List[Dict]:
        """
        Retrieves events for all friends of a given user.

        Args:
            user_id (str): The ID of the user whose friends' events are being retrieved.

        Returns:
            List[Dict]: A list of events from all friends.
        """
        try:
            # Validate user_id
            if not ObjectId.is_valid(user_id):
                raise ValueError("Invalid user ID")

            # Get the user's friends
            friends = self.get_friends(user_id)
            if not friends:
                return []

            # Fetch events for each friend
            friend_ids = [ObjectId(friend["friend_id"]) for friend in friends]
            events = self.db.events.find({"user_id": {"$in": friend_ids}})

            # Convert events to a list of dictionaries
            return [{
                "event_id": str(event["_id"]),
                "title": event["title"],
                "description": event["description"],
                "start_time": event["start_time"],
                "end_time": event["end_time"],
                "user_id": str(event["user_id"])
            } for event in events]

        except Exception as e:
            print(f"Error fetching friends' events: {e}")
            return []