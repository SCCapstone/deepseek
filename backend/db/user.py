"""
Abstraction for user data in database
"""
import hashlib
from datetime import datetime
from secrets import token_hex
from typing import List, Dict, Self
from bson.objectid import ObjectId

from utils.error_utils import *
from .db_manager import get_db
from .event import Event

AUTH_TOKEN_BYTES = 32


def hash_password(password: str) -> str:
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()
    return hashed_password


class User:
    def __init__(
        self,
        _id: ObjectId,
        username: str,
        email: str,
        hashed_password: str,
        profile_picture: str,
        created_at: datetime,
    ):
        self._id = _id
        self.username = username
        self.email = email
        self.hashed_password = hashed_password
        self.profile_picture = profile_picture

    @staticmethod
    def find(**kwargs) -> Self:
        db = get_db()
        results = db.users.find(kwargs)
        users = []
        for res in results:
            new_user = User(
                _id=res['_id'],
                username=res['username'],
                email=res['email'],
                created_at=res['created_at'],
                hashed_password=res['hashed_password'],
                profile_picture=res['profile_picture'],
            )
            users.append(new_user)
        return users

    @staticmethod
    def find_one(**kwargs) -> List[Self]:
        users = User.find(**kwargs)
        if len(users) > 0:
            return users[0]
        return None

    @staticmethod
    def create(
        username: str,
        email: str,
        password: str,
        profile_picture: str = None,
    ) -> Self:
        # checking for existing user
        if User.find_one(username=username):
            raise InvalidInputError('Existing account with that username')
        if User.find_one(email=email):
            raise InvalidInputError('Existing account with that email')

        # hashing password
        hashed_password = hash_password(password)

        # inserting into database
        new_user_doc = {
            'username': username,
            'email': email,
            'hashed_password': hashed_password,
            'profile_picture': profile_picture,
            'created_at': datetime.now(),
        }
        db = get_db()
        db.users.insert_one(new_user_doc)
        
        # creating user object to return
        new_user = User(**new_user_doc)
        return new_user

    @staticmethod
    def login(password: str, username: str = None, email: str = None) -> str:
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
        # searching database for token
        db = get_db()
        token_result = db.auth_tokens.find_one({'token': token})
        if not token_result:
            raise UnauthorizedError('Could not validate authentication token')
        
        # finding user associated with token
        user_result = db.users.find_one({'_id': token_result['user_id']})
        if not user_result:
            raise UnauthorizedError('Could not validate authentication token')
        
        # creating user object to return
        user = User(
            _id=user_result['_id'],
            username=user_result['username'],
            email=user_result['email'],
            hashed_password=user_result['hashed_password'],
            profile_picture=user_result['profile_picture'],
            created_at=user_result['created_at'],
        )
        return user
    
    @property
    def events(self):
        return Event.find(user_id=self._id)
    
    @property
    def public_events(self):
        return Event.find(user_id=self._id, visibility=True)
    
    @property
    def profile(self):
        return {
            'username': self.username,
            'profile_picture': self.profile_picture,
        }

    def new_token(self) -> str:
        # generating a new authentication token and storing in database
        auth_token = token_hex(AUTH_TOKEN_BYTES)
        db = get_db()
        token_doc = {
            'token': auth_token,
            'user_id': self._id,
            'created_at': datetime.now(),
        }
        db.auth_tokens.insert_one(token_doc)
        return auth_token

    def delete(self) -> None:
        db.users.delete_one({'_id': user._id})