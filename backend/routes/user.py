from flask import Blueprint, request, make_response

from db import User
from utils.data_utils import require_data


user_router = Blueprint('user_router', __name__)