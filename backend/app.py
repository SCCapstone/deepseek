import sys
import hashlib
import uuid
import pymongo
import secrets
from flask import Flask, request, make_response, jsonify, redirect, session
from flask_session import Session
from bson.json_util import dumps, loads
from bson.errors import InvalidId
from bson.objectid import ObjectId
from flask_cors import CORS

from gacc import *
from friend_manager import *

from db import *
from routers import *
from utils.error_utils import AppError

TOKEN_SIZE_BYTES = 32
FRONTEND_URL = "http://localhost:4000"


# database setup
db = Database()
db.connect()

# flask app setup
app = Flask(__name__)
app.register_blueprint(user_router)
app.register_blueprint(auth_router)
app.register_blueprint(event_router)
app.register_blueprint(friend_router)
CORS(app, supports_credentials=True)


# catching custom error events
@app.errorhandler(AppError)
def custom_error_handler(error):
    return error.handle()


# catching all other error events
@app.errorhandler(Exception)
def default_error_handler(error):
    app.logger.error('Unkown internal error: %s' % error)
    return make_response({'message': 'Internal server error'}, 500)


# google calendar setup and handling
googlecalendar = GoogleCalendar(
    client_secrets_file="googlesecret.json",
    scopes=["https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri="http://localhost:5000/googlecallback",
)

@app.route('/googlelogin')
def google_login():
    session['return_to'] = request.args.get('return_to', '/myprofile')
    auth_url = googlecalendar.get_authorization_url(session)
    return redirect(auth_url)

@app.route('/googlecallback')
def google_callback():
    auth_token = request.cookies.get('auth_token')
    events_added, error = googlecalendar.handle_callback(
        session=session,
        request_url=request.url,
        auth_token=auth_token,
        user_manager=db.user_manager,
        event_manager=db.event_manager
    )

    # sorry if this messes up production, I'm not sure how to do this properly so sorry in advance
    frontend_url = f"{FRONTEND_URL}/calendar"
    if error:
        return redirect(f"{frontend_url}?error={error}")
    
    response = redirect(f"{frontend_url}?success=true&count={events_added}")
    response.set_cookie('auth_token', auth_token)
    return response
