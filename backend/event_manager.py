import logging
from typing import Optional, Dict, Any, List
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError
from datetime import datetime, timezone
from user_manager import UserManager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EventManager:
    def __init__(self, db):
        self.db = db
        self.user_manager = UserManager(self.db) 
    def add_event(
        self,
        user_id: str,
        title: str,
        description: str,
        start_time: str,
        end_time: str,
        visibility: bool = False,
        comments: Optional[List] = None
    ) -> Optional[str]:
        if start_time >= end_time:
            raise ValueError("start_time must be earlier than end_time.")

        event_doc = {
            'user_id': user_id,
            'title': title,
            'description': description,
            'start_time': start_time,
            'end_time': end_time,
            'visibility': visibility,
            'comments': comments or []
        }
        try:
            result = self.db.events.insert_one(event_doc)
            return str(result.inserted_id)
        except PyMongoError as e:
            logger.error(f"Failed to add event: {e}")
        return None

    # gets all events for a specific user
    def get_events(self, user_id: str) -> List[Dict[str, Any]]:
        try:
            return list(self.db.events.find({'user_id': user_id}))
        except PyMongoError as e:
            logger.error(f"Failed to retrieve events: {e}")
        return []

    def get_event(self, event_id: str) -> Optional[Dict[str, Any]]:
        try:
            return self.db.events.find_one({'_id': ObjectId(event_id)})
        except PyMongoError as e:
            logger.error(f"Failed to retrieve event: {e}")
        return None

    # delete event BY ID
    def delete_event(self, event_id: str) -> bool:
        try:
            result = self.db.events.delete_one({'_id': ObjectId(event_id)})
            return result.deleted_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to delete event: {e}")
        return False

    def edit_event(self, event_id: str, **kwargs) -> bool:
        """Edit an event by its ID with the provided fields."""
        try:
            result = self.db.events.update_one(
                {'_id': ObjectId(event_id)},
                {'$set': kwargs}
            )
            return result.modified_count > 0
        except PyMongoError as e:
            logger.error(f"Failed to edit event: {e}")
        return False
    
    #Get today's events for notifications
    def get_today_events(self, user, user_id: str) -> List[Dict[str, Any]]:
        """Retrieve events that start today and add notifications to the user if not already present."""
        try:
            events = list(self.db.events.find({'user_id': user_id}))
            today_utc = datetime.now(timezone.utc).date()

            # Fetch the user's existing notifications
            user = self.user_manager.get_user(user)
            existing_notifications = {n['message'] for n in self.user_manager.get_notifications(user_id)}

            today_events = []
            for event in events:
                event_start_date = datetime.fromisoformat(event['start_time'].replace("Z", "")).replace(tzinfo=timezone.utc).date()

                if event_start_date == today_utc:
                    today_events.append(event)

                    # Create notification message
                    message = f"Reminder: Your event '{event['title']}' starts today!"

                    # Only add if it doesn't already exist
                    if message not in existing_notifications:
                        self.user_manager.add_notification(user_id, message)

            return today_events
        except PyMongoError as e:
            logger.error(f"Failed to retrieve today's events: {e}")
            return []
