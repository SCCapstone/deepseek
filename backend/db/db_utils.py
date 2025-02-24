import os
import pymongo


class DatabaseManager:
    def __new__(self):
        # checking to see if database has been initialized yet
        if not hasattr(self, 'instance'):
            # creating new database manager instance
            self.instance = super(DatabaseManager, self).__new__(self)

            # getting connection
            self.init_db(self)

        return self.instance

    def init_db(self):
        # getting connections params from environment
        env = os.environ
        host = env.get('MONGO_HOST', 'mongo')
        port = env.get('MONGO_PORT', 27017)
        database = env.get('MONGO_DATABASE', 'appdb')

        # attempting to connect to database
        client = pymongo.MongoClient(host, port)
        self.db = client[database]


def get_db():
    db_manager = DatabaseManager()
    return db_manager.db