import sys
import logging
import traceback
from flask import make_response

logger = logging.getLogger(__name__)


class AppError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

    def handle(self):
        return make_response({'message': self.message}, self.status_code)


class InvalidInputError(AppError):
    status_code = 400


class UnauthorizedError(AppError):
    status_code = 401


class ForbiddenError(AppError):
    status_code = 403


class NotFoundError(AppError):
    status_code = 404


class DatabaseError(AppError):
    def handle(self):
        # logging error to console then quitting
        logger.error('Database error: ' + self.message)
        sys.exit(-1)


def handle_error(error):
    if error == 404:
        return NotFoundError('Invalid URL').handle()
    
    elif isinstance(error, AppError):
        return error.handle()
    
    else:
        # logging error to console
        logger.error('Unkown internal error: %s' % error)
        logger.error(traceback.format_exc())

        # returning generic error message to user
        return make_response({'message': 'Internal server error'}, 500)