from flask import Blueprint, request, make_response

from utils.auth_utils import *
from utils.data_utils import *


user_router = Blueprint('user_router', __name__, url_prefix='/user')


@user_router.route('/get-profile', methods=['GET'])
@login_required
def get_user(current_user):
    profile = current_user.profile
    return jsonify({'user': profile})


@user_router.route('/delete-account', methods=['POST'])
@login_required
def delete_account(current_user):
    current_user.delete()
    return make_response({'message': 'Account deleted'})