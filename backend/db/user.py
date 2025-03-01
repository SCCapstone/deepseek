"""
Abstraction for user data in database
"""
import hashlib
import logging
from datetime import datetime
from secrets import token_hex
from typing import List, Dict, Self, Union
from bson.objectid import ObjectId

from utils.error_utils import *
from .database import DatabaseObject
from .event import Event
from .friend_relation import FriendRelation

AUTH_TOKEN_BYTES = 32
logger = logging.getLogger(__name__)


class AuthToken(DatabaseObject):
    schema = {
        '_id': {'type': ObjectId, 'required': True, 'unique': True},
        'user_id': {'type': ObjectId, 'required': True},
        'token': {'type': str, 'required': True, 'unique': True},
        'created_at': {'type': datetime},
    }


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

    @staticmethod
    def register(username: str, email: str, password: str) -> Self:
        # checking for existing user
        if User.find_one(username=username):
            raise InvalidInputError('Existing account with that username')
        if User.find_one(email=email):
            raise InvalidInputError('Existing account with that email')

        # hashing password
        hashed_password = hash_password(password)
        new_user = User.create(
            username=username,
            email=email,
            hashed_password=hashed_password,
        )
        return new_user

    @staticmethod
    def login(password: str, username: str = None, email: str = None) -> Self:
        # finding user in database
        if username:
            user = User.find_one(username=username)
            if not user:
                raise NotFoundError('No account with that username')
        elif email:
            user = User.find_one(email=email)
            if not user:
                raise NotFoundError('No account with that email')
        else:
            raise InvalidInputError('Please provide either username or email to login')
        
        # checking password
        hashed_password = hash_password(password)
        if user.hashed_password != hashed_password:
            raise InvalidInputError('Invalid password')
        return user

    @staticmethod
    def auth(token: str) -> Self:
        # search for auth token in database
        auth_token = AuthToken.find_one(token=token)
        if not auth_token:
            raise UnauthorizedError('Invalid authentication token')
        
        # make sure user exists
        user = User.find_one(_id=auth_token.user_id)
        if not user:
            raise UnauthorizedError('Could not validate authentication token')
        
        return user

    def new_token(self) -> str:
        # generating a new authentication token and storing in database
        token = token_hex(AUTH_TOKEN_BYTES)
        AuthToken.create(user_id=self._id, token=token, created_at=datetime.now())
        return token
    
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