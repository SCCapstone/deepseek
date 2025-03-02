import sys
import logging
import traceback
from flask import make_response
from pymongo.errors import PyMongoError, ConnectionFailure, OperationFailure

logger = logging.getLogger(__name__)


class AppError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def handle(self):
        return make_response({'message': self.message}, self.status_code)


class InternalError(AppError):
    status_code = 500
    
    def handle(self):
        logger.error('Internal error: ' + self.message)
        return make_response({'message': 'Internal server error'}, self.status_code)


class InvalidInputError(AppError):
    status_code = 400


class UnauthorizedError(AppError):
    status_code = 401


class ForbiddenError(AppError):
    status_code = 403


class NotFoundError(AppError):
    status_code = 404


def handle_error(error):
    if isinstance(error, AppError):
        return error.handle()
    
    else:
        # logging error to console
        logger.error('Unkown internal error: %s' % error)
        logger.error(traceback.format_exc())

        # returning generic error message to user
        return make_response({'message': 'Internal server error'}, 500)
    

def handle_database_error(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ConnectionFailure as e:
            raise InternalError('Database connection failure: ' + e.__repr__())
        except OperationFailure as e:
            raise InternalError('Database operation failure: ' + e.__repr__())
        except PyMongoError as e:
            raise InternalError('Unknown database error: ' + e.__repr__())
        except Exception as e:
            raise InternalError('Unknown error: ' + e.__repr__())

    return wrapper
