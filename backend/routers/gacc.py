"""
Flask routes for authentication-related API endpoints
"""
from flask import Blueprint, request, redirect, session
import os
from db import User
import logging
from bson import ObjectId

from utils.gacc_utils import *
from utils.auth_utils import verify_access_token, create_access_token

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  

gacc_router = Blueprint('gacc_router', __name__)
FRONTEND_URL = os.getenv('FRONTEND_URL') or 'http://localhost:4000'
REACT_APP_API_URL = os.getenv('REACT_APP_API_URL') or 'http://localhost:5000'

# Determine if we're in production
IS_PRODUCTION = os.getenv('ENVIRONMENT') == 'production'

# google calendar setup and handling
googlecalendar = GoogleCalendar(
    client_secrets_file="./utils/googlesecret.json",
    scopes=["https://www.googleapis.com/auth/calendar.readonly"],
    redirect_uri=f"{REACT_APP_API_URL}/googlecallback",
)

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

@gacc_router.route('/googlelogin')
def google_login():
    # Get the auth token from query params
    auth_token = request.args.get('auth_token')
    if not auth_token:
        logger.error("Auth token missing in /googlelogin request")
        return redirect(f"{FRONTEND_URL}/login?error=Missing authentication token")

    # Store the auth token in session for the callback
    session['auth_token'] = auth_token
    session['return_to'] = request.args.get('return_to', '/calendar')
    
    auth_url = googlecalendar.get_authorization_url(session)
    return redirect(auth_url)

@gacc_router.route('/googlecallback')
def google_callback():
    logger.info(f"Received request at /googlecallback")
    
    # Get the stored auth token from session
    auth_token = session.get('auth_token')
    if not auth_token:
        logger.error("Auth token missing in session during /googlecallback")
        return redirect(f"{FRONTEND_URL}/login?error=Authentication failed - Session token missing")

    # Verify JWT token and get user_id
    payload = verify_access_token(auth_token)
    if not payload:
        logger.error("Invalid JWT token found in session")
        return redirect(f"{FRONTEND_URL}/login?error=Invalid authentication token")

    user_id = payload.get('_id')
    if not user_id:
        logger.error("User ID not found in JWT payload")
        return redirect(f"{FRONTEND_URL}/login?error=Invalid token payload")

    current_user = User.find_one(_id=user_id)
    if not current_user:
        logger.error("User not found for the token in session")
        return redirect(f"{FRONTEND_URL}/login?error=User not found")

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

    # Create a new JWT token
    new_access_token = create_access_token({"_id": current_user._id})

    # Redirect to the frontend with success message and count of events added
    response = redirect(f"{FRONTEND_URL}/calendar?success=true&count={events_added}")
    response.set_cookie('auth_token', new_access_token, 
                       secure=IS_PRODUCTION,
                       samesite='Lax' if IS_PRODUCTION else None)
    return response
