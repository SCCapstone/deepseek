from bson import ObjectId
from datetime import datetime
from typing import List, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FriendManager:
    # makes a FriendManager object with a connection to the db
    def __init__(self, db):
        self.db = db

    def add_friend(self, user_id: str, friend_id: str) -> bool:
        try:
            # Validate user_id and friend_id
            if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(friend_id):
                raise ValueError("Invalid user ID or friend ID")

            # Convert IDs to ObjectId
            user_id_obj = ObjectId(user_id)
            friend_id_obj = ObjectId(friend_id)

            # Add the friend relationship to the `friends` collection
            friendship = {
                "user_id": user_id_obj,
                "friend_id": friend_id_obj,
                "created_at": datetime.now()
            }
            friendship_result = self.db.friends.insert_one(friendship)

            if not friendship_result.inserted_id:
                raise Exception("Failed to create friendship record")

            # Update the `friends` list for both users
            self.db.users.update_one(
                {"_id": user_id_obj},
                {"$addToSet": {"friends": friendship_result.inserted_id}}  # Use $addToSet to avoid duplicates
            )
            self.db.users.update_one(
                {"_id": friend_id_obj},
                {"$addToSet": {"friends": friendship_result.inserted_id}}  # Use $addToSet to avoid duplicates
            )

            logger.info(f"Friend relationship added and users updated: {user_id} -> {friend_id}")
            return True

        except Exception as e:
            logger.error(f"Error adding friend: {e}")
            return False

    def remove_friend(self, user_id: str, friend_id: str) -> bool:
        try:
            # Validate user_id and friend_id
            if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(friend_id):
                raise ValueError("Invalid user ID or friend ID")

            # Remove the friend relationship
            result = self.db.friends.delete_one({
                "user_id": ObjectId(user_id),
                "friend_id": ObjectId(friend_id)
            })
            if result.deleted_count > 0:
                logger.info(f"Friend relationship removed: {user_id} -> {friend_id}")
                return True
            else:
                logger.warning(f"No friend relationship found: {user_id} -> {friend_id}")
                return False

        except Exception as e:
            logger.error(f"Error removing friend: {e}")
            return False

    def get_friends(self, user_id: str) -> List[Dict]:
        try:
            # Validate user_id
            if not ObjectId.is_valid(user_id):
                raise ValueError("Invalid user ID")

            # Fetch all friends for the user
            friends = self.db.friends.find({"user_id": ObjectId(user_id)})
            return [{"friend_id": str(friend["friend_id"]), "created_at": friend["created_at"]} for friend in friends]

        except Exception as e:
            logger.error(f"Error fetching friends: {e}")
            return []

    def get_friends_events(self, user_id: str) -> List[Dict]:
        try:
            # Validate user_id
            if not ObjectId.is_valid(user_id):
                raise ValueError("Invalid user ID")

            # Get the user's friends
            friends = self.get_friends(user_id)
            if not friends:
                logger.info(f"No friends found for user: {user_id}")
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
            logger.error(f"Error fetching friends' events: {e}")
            return []

    def are_friends(self, user_id: str, friend_id: str) -> bool:
        try:
            if not ObjectId.is_valid(user_id) or not ObjectId.is_valid(friend_id):
                return False

            # check both directions 
            friendship = self.db.friends.find_one({
                "$or": [
                    {"user_id": ObjectId(user_id), "friend_id": ObjectId(friend_id)},
                    {"user_id": ObjectId(friend_id), "friend_id": ObjectId(user_id)}
                ]
            })
            
            return friendship is not None

        except Exception as e:
            logger.error(f"Error checking friendship status: {e}")
            return False