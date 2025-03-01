import secrets
from flask import Flask
from flask_cors import CORS

from utils.gacc_utils import *
from friend_manager import *

from db import *
from routers import *
from utils.error_utils import handle_error

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

# setting error handler to catch all app errors
@app.errorhandler(Exception)
def _handle_error(error):
    return handle_error(error)