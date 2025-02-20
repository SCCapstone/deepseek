import logging
from typing import Optional, Dict, Any, List
from bson.objectid import ObjectId
from pymongo.errors import PyMongoError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class EventManager:
    def __init__(self, db):
        self.db = db

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