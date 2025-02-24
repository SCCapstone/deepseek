from flask import Flask, request, make_response, jsonify, redirect, session
from bson.errors import InvalidId
from bson.objectid import ObjectId
from flask_cors import CORS

from gacc import *
from db import init_db
from routers import *
from utils.auth_utils import *
from utils.error_utils import AppError


# setting up database connection
init_db()

# setting up flask app
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


googlecalendar = GoogleCalendar(
    client_secrets_file="googlesecret.json",
    scopes=["https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri="http://localhost:5000/googlecallback",
)


# TODO: add these frontend routes, really just needs to be a login with google button somewhere
# need to add frontent routes and save to database but this is working from hitting the backend routes
@app.route('/googlelogin')
def google_login():
    auth_url = googlecalendar.get_authorization_url(session)
    return redirect(auth_url)

@app.route('/googlecallback')
def google_callback():
    credentials = googlecalendar.exchange_code_for_credentials(session, request.url)
    return jsonify(credentials)

# TODO store these in the database intsead of just returning the credientials
@app.route('/googleevents')
def get_google_events():
    events = googlecalendar.fetch_calendar_events(session)
    for event in events:
        event_data = {
            # parse here
            # db.add_event(user_id, title, description, start_time, end_time, visibility, comments)
        }
    return jsonify(events)