"""
Abstraction for friend relation data in database
"""
from datetime import datetime
from typing import List, Dict, Self
from bson.objectid import ObjectId

from utils.error_utils import *
from .database import Database
from .user import User


class FriendRelation:
    def __init__(
        self,
        _id: ObjectId,
        user1: User,
        user2: User,
        status: str,
    ):
        self.user1 = user1
        self.user2 = user2
        self.status = status
    
    @staticmethod
    def add(user1: User, user2: User):
        # getting current status
        db = Database()
        current_relation = db.friend_relations.find_one(
            { 'user1_id': user1._id, 'user2_id': user2._id },
            sort=[('created_at', -1)],
        )

        if current_relation:
            if current_relation['status'] == 'request_received':
                # updating database result
                db.friend_relations.update_one(
                    { '_id': current_relation['_id'] },
                    { '$set': {'status': 'friend_added'} },
                )
                db.friend_relations.update_one(
                    { 'user1_id': user2._id, 'user2_id': user1._id },
                    { '$set': {'status': 'friend_added'} },
                )

        else:
            # creating relation docs to insert into database
            relation_doc1 = {
                'user1_id': user1._id,
                'user2_id': user2._id,
                'status': 'request_sent',
                'created_at': datetime.now(),
            }
            relation_doc2 = {
                'user1_id': user2._id,
                'user2_id': user1._id,
                'status': 'request_received',
                'created_at': datetime.now(),
            }

            db.friend_relations.insert_many([relation_doc1, relation_doc2])

    @staticmethod
    def get_relation(user1: User, user2: User) -> str:
        # searching database
        db = Database()
        relation = db.friend_relations.find_one(
            { 'user1_id': user1._id, 'user2_id': user2._id },
            { 'sort': { 'created_at': -1 } },
        )

        if not relation:
            return None

        return FriendRelation(
            _id=relation['_id'],
            user1_id=relation['user1_id'],
            user2_id=relation['user2_id'],
            status=relation['status'],
        )

    @staticmethod
    def get_friends(user: User) -> List[User]:
        # searching database for friend records
        db = Database()
        friend_relations = db.friend_relations.find({'user1_id': user._id})
        friends = []
        for relation in friend_relations:
            if relation['status'] == 'friend_added':
                friend = User.find_one(_id=relation['user2_id'])
                friends.append(friend)
        return friends
    
    @staticmethod
    def delete_relations(user1: User, user2: User):
        # deleting all relations between users
        db = Database()
        db.friend_relations.delete_many({'user1_id': user1._id, 'user2_id': user2._id})
        db.friend_relations.delete_many({'user1_id': user2._id, 'user2_id': user1._id})