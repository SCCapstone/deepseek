"""
Miscellaneous and middleware related to authentication

Contains authentication wrapper for login-protected pages
"""
from flask import request

import hashlib
from secrets import token_hex
from datetime import datetime, timedelta, timezone
from db import User, AuthToken, RefreshToken
from .error_utils import UnauthorizedError
import re
import os
import jwt
import logging
from bson.objectid import ObjectId

# Configuration (Consider moving to config file/env vars)
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days for access token
REFRESH_TOKEN_EXPIRE_DAYS = 7    # Longer life for refresh token
SECRET_KEY = os.getenv("SECRET_KEY", token_hex(32)) # MUST be set securely in env
ALGORITHM = "HS256"

AUTH_TOKEN_BYTES = 32 # Keep for refresh token generation maybe?
REFRESH_TOKEN_BYTES = 32 # Bytes for refresh token

logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    _hash = hashlib.sha256()
    _hash.update(password.encode())
    hashed_password = _hash.hexdigest()
    return hashed_password


def new_token(user: User) -> str:
    # generating a new authentication token and storing in database
    token = token_hex(AUTH_TOKEN_BYTES)
    AuthToken.create(
        user_id=user._id,
        token=token,
        created_at=datetime.now()
    )
    return token


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    # Use user._id directly, ensure it's serializable (string)
    if '_id' in to_encode and isinstance(to_encode['_id'], ObjectId):
         to_encode['_id'] = str(to_encode['_id'])
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # Optionally: Add more checks here (e.g., token type, audience)
        user_id_str = payload.get("_id")
        if user_id_str is None:
             logger.error("Token payload missing user ID")
             return None
        # Convert user ID back to ObjectId
        payload['_id'] = ObjectId(user_id_str)
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Access token expired")
        return None # Indicate expired
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid access token: {e}")
        return None


def create_refresh_token(user_id: ObjectId) -> str:
    # Generate a secure random token
    refresh_token = token_hex(REFRESH_TOKEN_BYTES)
    expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    # Store the token hash or the token itself? Storing token for simplicity now.
    # In production, consider storing a hash.
    try:
        RefreshToken.create(user_id=user_id, token=refresh_token, expires_at=expires_at)
        return refresh_token
    except Exception as e:
        logger.error(f"Failed to store refresh token for user {user_id}: {e}")
        # Decide how to handle DB error - raise?, return None?
        raise # Re-raise for now


def verify_refresh_token(token: str) -> RefreshToken | None:
    # Find non-expired token in DB
    refresh_token_obj = RefreshToken.find_one(token=token)
    return refresh_token_obj


def login_required(func):
    def func_wrapper(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        logger.debug(f"Auth Header received: {auth_header}") 
        
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("Missing or invalid Authorization header")
            raise UnauthorizedError('Missing or invalid Authorization header')
            
        access_token = auth_header.split(' ')[1]
        payload = verify_access_token(access_token)
        
        if payload is None:
             logger.warning("Access token verification failed (expired or invalid)")
             raise UnauthorizedError('Invalid or expired access token')
             
        user_id = payload.get('_id') # Already converted to ObjectId in verify
        if not user_id:
             logger.error("Valid token payload missing user ID after verification")
             raise UnauthorizedError('Token payload error')

        current_user = User.find_one(_id=user_id)
        if not current_user:
            logger.error(f"User ID {user_id} from valid token not found in DB!")
            raise UnauthorizedError('Authenticated user not found')

        logger.debug(f"Proceeding to route for user: {current_user.username}")
        return func(current_user, *args, **kwargs)

    func_wrapper.__name__ = func.__name__
    return func_wrapper


def email_check(email: str) -> bool:
    return re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) is not None

