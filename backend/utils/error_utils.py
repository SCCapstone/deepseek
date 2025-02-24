from flask import make_response


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