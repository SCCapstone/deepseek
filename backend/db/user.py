"""
Abstraction for user data in database
"""
import logging
import pytz
from datetime import datetime, timezone
from typing import List, Dict, Self, Union
from bson.objectid import ObjectId

from utils.error_utils import *
from .database import DatabaseObject, Database
from .event import Event
from .friend_relation import FriendRelation
from .notification import Notification

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


class User(DatabaseObject):
    schema = {
        '_id': {'type': ObjectId, 'required': True, 'unique': True},
        'username': {'type': str, 'required': True, 'unique': True},
        'email': {'type': str, 'required': True, 'unique': True},
        'profile_picture': {'type': Union[str, None]},
        'hashed_password': {'type': str, 'required': True},
        'name': {'type': Union[str, None]},
        'bio': {'type': Union[str, None]},
        'default_event_visibility': {'type': bool, 'default': False},
        'default_reminder' : {'type': bool, 'default': False},
        'created_at': {'type': datetime},
        'liked_events': {'type': list, 'default': []},  # List of event ObjectIds
    }
    
    @property
    def profile(self) -> Dict:
        return {
            'username': self.username,
            'profile_picture': self.profile_picture,
            'bio': self.bio,
            'name': self.name,
            'joined': self.created_at.date(),
        }

    @property
    def settings(self) -> Dict:
        return {
            'email': self.email,
            'default_event_visibility': self.default_event_visibility,
            'default_reminder': self.default_reminder
        }
    
    @property
    def events(self) -> List[Event]:
        return Event.find(user_id=self._id)
    
    @property
    def today_events(self) -> List[Event]:
        # getting todays date
        timezone = pytz.timezone('America/New_York')
        today_date = str(datetime.now(timezone).date())

        # finding events that have the same date
        events = self.events
        today_events = []
        for event in events:
            if event.date == today_date:
                today_events.append(event)

        return today_events
    
    @property
    def public_events(self) -> List[Event]:
        return Event.find(user_id=self._id, visibility=True)
    
    @property
    def friends(self) -> List[Self]:
        friend_rels = FriendRelation.find(user1_id=self._id, status='friend')
        friends = []
        for rel in friend_rels:
            friend_id = rel.user2_id
            friend = User.find_one(_id=friend_id)

            if not friend:
                err_msg = 'Invalid friend relation doc with id `%s`' % str(rel._id)
                raise DatabaseError(err_msg)

            friends.append(friend)

        return friends
    
    @property
    def notifications(self) -> List[Notification]:
        # looping over todays events to see if any reminders need to be sent
        today_events = self.today_events
        for event in today_events:
            if event.set_reminder and not event.reminder_sent:
                # event is set to remind and reminder has not been sent yet
                event_msg = 'Reminder: your event \'%s\' starts today!' % event.title

                # sending reminder and updating event to show that reminder has been sent
                self.add_notification(event_msg, 'event_reminder', event._id)
                event.update(reminder_sent=True)

        # returning all notifications
        return Notification.find(user_id=self._id)
    
    def add_notification(self, message: str, type: str, event_id: ObjectId = None, friend_id: ObjectId = None) -> Notification:
        notif = Notification.create(
            user_id=self._id,
            message=message,
            created_at=datetime.now(),
            type=type,
            event_id=event_id,
            friend_id=friend_id,
        )
        return notif
    
    def mark_notifications_read(self) -> None:
        notifs = self.notifications
        for notif in notifs:
            notif.update(is_read=True)
    
    def remove_notification(self, friend_id: ObjectId) -> None:
        notifs = self.notifications
        for notif in notifs:
            if notif.friend_id == friend_id:
                notif.delete()

    
    def add_friend(self, other_user: Self) -> None:
        current_status = self.get_friend_status(other_user)
        logger.info(f"Current status: {current_status} for self: {self.username} and other: {other_user.username}")
        if current_status == 'friend':
            # Users are already friends, do nothing
            return
        elif current_status == 'request_received':
            # accepting request by creating new records for both users
            FriendRelation.create(
                user1_id=self._id,
                user2_id=other_user._id,
                status='friend',
                created_at=datetime.now(),
            )
            FriendRelation.create(
                user1_id=other_user._id,
                user2_id=self._id,
                status='friend',
                created_at=datetime.now(),
            )
            # friend relation has been made, can send notification to the sender
            other_user.add_notification('@' + self.username + ' is now your friend!', 'friend_accept')
        
        elif current_status == 'none':
            # sending a new friend request
            FriendRelation.create(
                user1_id=self._id,
                user2_id=other_user._id,
                status='request_sent',
                created_at=datetime.now(),
            )
            FriendRelation.create(
                user1_id=other_user._id,
                user2_id=self._id,
                status='request_received',
                created_at=datetime.now(),
            )
            # sending a notification to the other user
            other_user.add_notification('Friend request from @' + self.username, 'friend_request', friend_id=self._id)
    
    def remove_friend(self, other_user: Self) -> None:
        rels = FriendRelation.find(user1_id=self._id, user2_id=other_user._id)
        rels.extend(FriendRelation.find(user1_id=other_user._id, user2_id=self._id))
        for rel in rels:
            rel.delete()
    
    def get_friend_status(self, other_user: Self) -> str:
        # finding all relationships in database
        friend_rels = FriendRelation.find(user1_id=self._id, user2_id=other_user._id)
        if len(friend_rels) == 0:
            return 'none'

        # sorting to find the latest one
        friend_rels = sorted(friend_rels, key=lambda x: x.created_at)
        friend_rel = friend_rels[-1]
        return friend_rel.status

    def like_event(self, event_id: ObjectId) -> None:
        # find event in database
        event = Event.find_one(_id=event_id)
        if not event:
            raise NotFoundError('Event with id `%s` not found' % event_id)

        if event_id not in self.liked_events:
            db = Database()
            db.push_to_array(self.get_table_name(), self._id, 'liked_events', event_id)
            # Update the local object state as well
            self.liked_events.append(event_id)
            event.add_like(self._id)

    def unlike_event(self, event_id: ObjectId) -> None:
        event = Event.find_one(_id=event_id)
        if not event:
            raise NotFoundError('Event with id `%s` not found' % event_id)

        if event_id in self.liked_events:
            db = Database()
            db.pull_from_array(self.get_table_name(), self._id, 'liked_events', event_id)
             # Update the local object state as well
            self.liked_events.remove(event_id)
            event.remove_like(self._id)


def hash_password(password: str) -> str:
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()
    return hashed_password