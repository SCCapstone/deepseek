"""
Flask routes for authentication-related API endpoints
"""
from flask import Blueprint, request, redirect, session
import os
from db import User

from utils.gacc_utils import *
from utils.auth_utils import *

gacc_router = Blueprint('gacc_router', __name__)
FRONTEND_URL = os.getenv('FRONTEND_URL')
REACT_APP_API_URL = os.getenv('REACT_APP_API_URL')


# google calendar setup and handling
googlecalendar = GoogleCalendar(
    client_secrets_file="googlesecret.json",
    scopes=["https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri=f"{REACT_APP_API_URL}/googlecallback",
)

@gacc_router.route('/googlelogin')
def google_login():
    session['return_to'] = request.args.get('return_to', '/myprofile')
    auth_url = googlecalendar.get_authorization_url(session)
    return redirect(auth_url)

@gacc_router.route('/googlecallback')
@login_required
def google_callback(current_user):
    if not current_user._id:
        return redirect(f"{FRONTEND_URL}/login?error=Unauthorized")

    events_added, error = googlecalendar.handle_callback(
        session=session,
        request_url=request.url,
        user_id=current_user._id
    )

    if error:
        return redirect(f"{FRONTEND_URL}/calendar?error={error}")

    # Fetch the user
    user = User.find_one(_id=ObjectId(current_user._id))
    if not user:
        return redirect(f"{FRONTEND_URL}/calendar?error=Unauthorized")

    # Redirect to the frontend with success message and count of events added
    response = redirect(f"{FRONTEND_URL}/calendar?success=true&count={events_added}")
    #response.set_cookie('auth_token', user.auth_token)
    return response
