"""
Singleton Database class that holds global app database connection,
and DatabaseObject abstract class that defines behavior of objects
"""
import os
from abc import ABC
from typing import Dict, Self, Union
import pymongo
from bson.objectid import ObjectId

from utils.error_utils import DatabaseError, InvalidInputError

DEFAULT_MONGO_HOST = 'mongo'
DEFAULT_MONGO_PORT = 27017
DEFAULT_MONGO_DB = 'appdb'


class Database:
    def __new__(self):
        # checking to see if database has been initialized yet
        if not hasattr(self, 'instance'):
            # creating new database manager instance
            self.instance = super(Database, self).__new__(self)
            self.connected = True

        return self.instance

    def connect(self):
        # getting connections params from environment
        env = os.environ
        host = env.get('MONGO_HOST', DEFAULT_MONGO_HOST)
        port = env.get('MONGO_PORT', DEFAULT_MONGO_PORT)
        database = env.get('MONGO_DATABASE', DEFAULT_MONGO_DB)

        # attempting to connect to database
        client = pymongo.MongoClient(host, port)
        self._db = client[database]

    def find(self, table_name: str, query: Dict, sort: Dict = None):
        pass

    def find_one(self, table_name: str, query: Dict):
        pass

    def create_one(self, table_name: str, args: Dict):
        pass

    def update_one(self, table_name: str, _id: ObjectId, args: Dict):
        pass

    def delete_one(self, table_name: str, _id: ObjectId):
        pass


class DatabaseObject(ABC):
    def __init__(self, **kwargs: Dict):
        self._validate_input(kwargs)
        self._check_required(kwargs)

        for arg in kwargs:
            value = kwargs[arg]
            setattr(self, arg, value)

    @classmethod
    def get_table_name(cls):
        return class_to_table_name(cls.__name__)

    @classmethod
    def _check_schema_exists(cls) -> None:
        # making sure schema exists
        if not hasattr(cls, 'schema'):
            raise NotImplementedError('Schema is required for database object')

    @classmethod
    def _validate_input(cls, kwargs: Dict) -> None:
        cls._check_schema_exists()

        # validating input fields
        for field in kwargs:
            # making sure field exists in schema
            if field not in cls.schema:
                raise DatabaseError('Invalid field `%s` for object `%s`' % \
                    (field, cls.__name__))

            # making sure field has correct type
            value = kwargs[field]
            _type = cls.schema[field]['type']
            if value and not isinstance(value, _type):
                raise DatabaseError('Field `%s` must have type `%s' % (field, str(_type)))

    @classmethod
    def _set_defaults(cls, kwargs: Dict) -> None:
        cls._check_schema_exists()

        # looping over each data field and setting
        # to default if not already set by kwargs
        for field in cls.schema:
            _schema = cls.schema[field]
            if field not in kwargs:
                if 'default' in _schema:
                    kwargs[field] = _schema['default']
                elif field != '_id':
                    kwargs[field] = None

    @classmethod
    def _check_required(cls, kwargs: Dict, creating: bool = False) -> None:
        cls._check_schema_exists()

        # making sure no required fields are blank
        for field in cls.schema:
            _schema = cls.schema[field]
            if 'required' in _schema and _schema['required'] and field not in kwargs:
                # disregarding `_id` field if creating a database
                # document since _id has not been created yet
                if field == '_id' and creating:
                    continue

                # raising error if field is required but not set by kwargs or default
                raise DatabaseError('Missing required field `%s`' % field)
            
    @classmethod
    def _check_unique(cls, kwargs: Dict) -> None:
        cls._check_schema_exists()

        for field in kwargs:
            # finding fields that have unique constraint
            _schema = cls.schema[field]
            if 'unique' in _schema and _schema['unique']:
                # making sure field value is unique
                value = kwargs[field]
                existing = cls.find_one(**{field: value})
                if existing:
                    raise InvalidInputError('Existing %s with %s `%s`' % \
                        (cls.__name__, field, value))

    @classmethod
    def find(cls, **kwargs: Dict) -> Self:
        # validating input against schema
        cls._validate_input(kwargs)

        # finding objects in database
        try:
            db = Database()
            results = db._db[cls.get_table_name()].find(kwargs)
        except Exception as e:
            raise DatabaseError(e.__repr__())
        
        # converting database docs to database objects
        objects = []
        for res in results:
            new_obj = cls.__new__(cls)
            new_obj.__init__(**res)
            objects.append(new_obj)
        
        return objects
    
    @classmethod
    def find_one(cls, **kwargs: Dict) -> Union[Self, None]:
        results = cls.find(**kwargs)
        if len(results) > 0:
            return results[0]
        return None
    
    @classmethod
    def create(cls, **kwargs: Dict) -> Self:
        # validating input against schema
        cls._validate_input(kwargs)
        cls._set_defaults(kwargs)
        cls._check_required(kwargs, creating=True)
        cls._check_unique(kwargs)

        # inserting doc into database
        try:
            db = Database()
            db._db[cls.get_table_name()].insert_many([kwargs])
        except Exception as e:
            raise DatabaseError(e.__repr__())

        # creating database object class to return
        new_obj = cls.__new__(cls)
        new_obj.__init__(**kwargs)
        return new_obj

    def update(self, **kwargs: Dict) -> None:
        # validating input against schema
        self._validate_input(kwargs)

        # finding fields that are not updated
        fields_to_remove = []
        for field in kwargs:
            if hasattr(self, field) and (getattr(self, field) == kwargs[field]):
                # removing field from data if already correct value in database
                fields_to_remove.append(field)

        # removing non-updated fields
        for field in fields_to_remove:
            del kwargs[field]

        # making sure updated fields are unique if required to be
        self._check_unique(kwargs)

        # updating doc in database
        try:
            db = Database()
            db._db[self.get_table_name()].update_one({'_id': self._id}, {'$set': kwargs})
        
        except Exception as e:
            raise DatabaseError(e.__repr__())

    def delete(self) -> None:
        # removing doc from database
        try:
            db = Database()
            db._db[self.get_table_name()].delete_one({'_id': self._id})
        
        except Exception as e:
            raise DatabaseError(e.message)
    
    def __eq__(self, other: Self) -> bool:
        return self._id == other._id
    

def class_to_table_name(class_name: str) -> str:
    # making sure first letter is a capital
    if not class_name[0].isupper():
        raise DatabaseError('Invalid database object class name `%s`' % class_name)
    
    # constructing output string
    string = ''
    i = 0
    while i < len(class_name):
        # grabbing current (capital) letter
        string += class_name[i].lower()
        i += 1
        while i < len(class_name) and not class_name[i].isupper():
            # looping until end of string or another capital letter
            string += class_name[i].lower()
            i += 1
        
        # adding either plural suffix or underscore separator
        if i < len(class_name):
            string += '_'
        else:
            string += 's'
    
    print(string)
    return string
