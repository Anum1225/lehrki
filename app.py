import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_babel import Babel
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Babel configuration for i18n
app.config['LANGUAGES'] = {
    'en': 'English',
    'de': 'Deutsch',
    'fr': 'Français',
    'it': 'Italiano'
}
app.config['BABEL_DEFAULT_LOCALE'] = 'en'
app.config['BABEL_DEFAULT_TIMEZONE'] = 'UTC'

# Initialize extensions
db.init_app(app)
babel = Babel(app)

def get_locale():
    from flask import request, session
    # Check if user has set a language preference
    if 'language' in session:
        return session['language']
    # Otherwise try to guess the language from the user accept header
    return request.accept_languages.best_match(app.config['LANGUAGES'].keys()) or 'en'

babel.init_app(app, locale_selector=get_locale)

# Add CORS support for React frontend
from flask_cors import CORS
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"], supports_credentials=True)

# JWT Configuration
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire for demo

from flask_jwt_extended import JWTManager
jwt = JWTManager(app)

with app.app_context():
    # Import models to ensure tables are created
    import models  # noqa: F401
    db.create_all()
    logging.info("Database tables created")
