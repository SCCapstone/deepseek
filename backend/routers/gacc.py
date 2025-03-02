"""
Flask routes for authentication-related API endpoints
"""
from flask import Blueprint, request, redirect, session

from utils.gacc_utils import *


gacc_router = Blueprint('gacc_router', __name__)
FRONTEND_URL = "http://localhost:4000"


# google calendar setup and handling
googlecalendar = GoogleCalendar(
    client_secrets_file="googlesecret.json",
    scopes=["https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri="http://localhost:5000/googlecallback",
)

@gacc_router.route('/googlelogin')
def google_login():
    session['return_to'] = request.args.get('return_to', '/myprofile')
    auth_url = googlecalendar.get_authorization_url(session)
    return redirect(auth_url)

@gacc_router.route('/googlecallback')
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
