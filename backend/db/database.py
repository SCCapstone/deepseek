"""
Singleton class that holds global app database connection

Call `get_db` within another module to use the database
"""
import os
import sys
import pymongo
import logging
from abc import ABC

logger = logging.getLogger(__name__)


class Database:
    def __new__(self):
        # checking to see if database has been initialized yet
        if not hasattr(self, 'instance'):
            # creating new database manager instance
            self.instance = super(Database, self).__new__(self)

        return self.instance

    def connect(self):
        try:
            # getting connections params from environment
            env = os.environ
            host = env.get('MONGO_HOST', 'mongo')
            port = env.get('MONGO_PORT', 27017)
            database = env.get('MONGO_DATABASE', 'appdb')

            # attempting to connect to database
            client = pymongo.MongoClient(host, port)
            self._db = client[database]

        except Exception as e:
            logger.error('Database connectino error: %s' % e)

    @property
    def users(self):
        return self._db.users

    @property
    def auth_tokens(self):
        return self._db.auth_tokens
     
    @property
    def friend_relations(self):
        return self._db.friend_relations

    @property
    def events(self):
        return self._db.events
