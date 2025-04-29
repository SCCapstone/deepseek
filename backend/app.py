import secrets
import logging
import os
from flask import Flask, make_response, send_from_directory
from flask_cors import CORS

from db import *
from routers import *
from utils.error_utils import handle_error
from utils.database_utils import ensure_text_index

TOKEN_SIZE_BYTES = 32

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# database setup
db = Database()
db.connect()
ensure_text_index(db)

# flask app setup
app = Flask(__name__)
app.secret_key = secrets.token_bytes(TOKEN_SIZE_BYTES)

IS_PRODUCTION = os.getenv('ENVIRONMENT') == 'production'

# Configure session cookie settings for cross-domain compatibility in production
app.config.update(
    SESSION_COOKIE_SECURE=IS_PRODUCTION,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax' if IS_PRODUCTION else None,
)

# Define origins based on environment variable
allowed_origins = ["http://localhost:4000"]
frontend_url_from_env = os.getenv('FRONTEND_URL')
if frontend_url_from_env:
    allowed_origins.append(frontend_url_from_env)

logger.info(f"Configuring CORS with allowed origins: {allowed_origins}")

# Configure CORS to allow image loading
cors = CORS(app, supports_credentials=True, origins=allowed_origins)

# Define a dedicated upload folder path relative to the app file
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.environ.get('UPLOADS_FOLDER', os.path.join(APP_ROOT, 'uploads'))
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
logger.info(f"Upload folder set to: {UPLOAD_FOLDER}")

# Add a direct route for static images
@app.route('/static/images/<path:filename>')
def serve_static_image(filename):
    logger.info(f"Attempting to serve static image: {filename} from {UPLOAD_FOLDER}")
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except Exception as e:
        logger.error(f"Error serving static image {filename}: {e}")
        return make_response({"error": "Image not found or server error"}, 404)

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