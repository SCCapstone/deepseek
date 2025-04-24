from db import Database, User # Import Database and User specifically
from pymongo import TEXT
from pymongo.errors import OperationFailure # Import specific error
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

def ensure_text_index(dbinstance: Database):
    try:
        # Check if the database connection object exists
        if hasattr(dbinstance, '_db') and dbinstance._db is not None:
            # Get the actual collection OBJECT from the database connection
            collection_name = User.get_table_name()
            user_collection_object = dbinstance._db[collection_name]

            # Define the index keys
            index_keys = [
                ('username', TEXT),
                ('name', TEXT),
                ('bio', TEXT)
            ]
            index_name = 'user_text_search_index' # Give the index a specific name

            # Create the index (this is idempotent)
            user_collection_object.create_index(index_keys, name=index_name)

            logger.info(f"Ensured text index '{index_name}' exists on '{collection_name}' collection.")
        else:
            logger.warning("Database connection object (_db) not found in Database instance. Cannot ensure indexes.")
    except OperationFailure as e:
        # Handle potential errors if index options conflict, etc.
        logger.error(f"Database operation failed while ensuring text index: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred while ensuring text index: {e}")


