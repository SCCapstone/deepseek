"""
Abstraction for user data in database
"""
import logging
from datetime import datetime, timezone
from typing import List, Dict, Self, Union
from bson.objectid import ObjectId

from utils.error_utils import *
from .database import DatabaseObject
from .event import Event
from .friend_relation import FriendRelation
from .notification import Notification

logger = logging.getLogger(__name__)


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
        'created_at': {'type': datetime},
    }
    
    @property
    def profile(self) -> Dict:
        return {
            'username': self.username,
            'profile_picture': self.profile_picture,
            'bio': self.bio,
            'default_event_visibility': self.default_event_visibility,
            'email': self.email,
            'name': self.name,
        }
    
    @property
    def events(self) -> List[Event]:
        return Event.find(user_id=self._id)
    
    @property
    def today_events(self) -> List[Event]:
        # getting todays date
        today_utc = datetime.now(timezone.utc).date()

        # finding events that have the same date
        events = self.events
        today_events = []
        for event in events:
            event_start_date = datetime \
                .fromisoformat(event.start_time.replace('Z', '')) \
                .replace(tzinfo=timezone.utc) \
                .date()
            
            if event_start_date == today_utc:
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
            if event.reminder and not event.reminder_sent:
                # event is set to remind and reminder has not been sent yet
                event_msg = 'Reminder: your event \'%s\' starts today!' % event.title

                # sending reminder and updating event to show that reminder has been sent
                self.add_notification(event_msg)
                event.update(reminder_sent=True)

        # returning all notifications
        return Notification.find(user_id=self._id)
    
    def add_notification(self, message: str) -> Notification:
        notif = Notification.create(
            user_id=self._id,
            message=message,
            created_at=datetime.now(),
        )
        return notif
    
    def mark_notifications_read(self) -> None:
        notifs = self.notifications
        for notif in notifs:
            notif.update(is_read=True)
    
    def add_friend(self, other_user: Self) -> None:
        current_status = self.get_friend_status(other_user)
        if current_status == 'request_received':
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
            other_user.add_notification('Friend request from @' + self.username)
    
    def remove_friend(self, other_user: Self) -> None:
        rels = FriendRelation.find(user1_id=self._id, user2_id=other_user._id)
        rels.extend(FriendRelation.find(user1_id=other_user._id, user2_id=self._id))
        for rel in rels:
            rel.delete()
    
    def get_friend_status(self, other_user: Self) -> str:
        friend_rel = FriendRelation.find_one(user2_id=other_user._id)
        if not friend_rel:
            return 'none'
        return friend_rel.status


def hash_password(password: str) -> str:
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()
    return hashed_password