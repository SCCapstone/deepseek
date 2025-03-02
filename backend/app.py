import secrets
from flask import Flask, make_response
from flask_cors import CORS

from utils.gacc_utils import *
from friend_manager import *

from db import *
from routers import *
from utils.error_utils import *

TOKEN_SIZE_BYTES = 32


# database setup
db = Database()
db.connect()

# flask app setup
app = Flask(__name__)
app.secret_key = secrets.token_bytes(TOKEN_SIZE_BYTES)
CORS(app, supports_credentials=True)


# registering app routes
app.register_blueprint(user_router)
app.register_blueprint(auth_router)
app.register_blueprint(event_router)
app.register_blueprint(friend_router)
app.register_blueprint(gacc_router)


# setting up error handlers
@app.errorhandler(404)
def handle_not_found(error):
    return make_response({'message': 'Invalid URL'}, 404)

@app.errorhandler(Exception)
def handle_app_error(error):
    return handle_error(error)