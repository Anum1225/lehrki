from datetime import datetime
from app import db
from flask_dance.consumer.storage.sqla import OAuthConsumerMixin
from flask_login import UserMixin
from sqlalchemy import UniqueConstraint, Enum
import enum

# User roles enumeration
class UserRole(enum.Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMIN = "admin"

# Subscription status enumeration
class SubscriptionStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    CANCELLED = "cancelled"
    PAST_DUE = "past_due"

# (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=True)
    first_name = db.Column(db.String, nullable=True)
    last_name = db.Column(db.String, nullable=True)
    profile_image_url = db.Column(db.String, nullable=True)
    password_hash = db.Column(db.String(256), nullable=True)  # For JWT authentication
    role = db.Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    language_preference = db.Column(db.String(2), default='en', nullable=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscription = db.relationship('Subscription', back_populates='user', uselist=False)
    token_transactions = db.relationship('TokenTransaction', back_populates='user')
    parent_letters = db.relationship('ParentLetter', back_populates='user')
    quiz_attempts = db.relationship('QuizAttempt', back_populates='user')

    def get_token_balance(self):
        """Calculate current token balance"""
        transactions = TokenTransaction.query.filter_by(user_id=self.id).all()
        return sum(t.amount for t in transactions)
    
    def has_premium_access(self):
        """Check if user has active premium subscription"""
        return (self.subscription and 
                self.subscription.status == SubscriptionStatus.ACTIVE and
                self.subscription.expires_at > datetime.utcnow())

# (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
class OAuth(OAuthConsumerMixin, db.Model):
    user_id = db.Column(db.String, db.ForeignKey(User.id))
    browser_session_key = db.Column(db.String, nullable=False)
    user = db.relationship(User)

    __table_args__ = (UniqueConstraint(
        'user_id',
        'browser_session_key',
        'provider',
        name='uq_user_browser_session_key_provider',
    ),)

class Subscription(db.Model):
    __tablename__ = 'subscriptions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    stripe_subscription_id = db.Column(db.String, unique=True, nullable=True)
    stripe_customer_id = db.Column(db.String, nullable=True)
    status = db.Column(Enum(SubscriptionStatus), default=SubscriptionStatus.INACTIVE)
    plan_name = db.Column(db.String(50), nullable=False, default='free')
    monthly_token_limit = db.Column(db.Integer, default=0)
    price_cents = db.Column(db.Integer, default=0)
    expires_at = db.Column(db.DateTime, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='subscription')

class TokenTransaction(db.Model):
    __tablename__ = 'token_transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    amount = db.Column(db.Integer, nullable=False)  # Positive for credits, negative for debits
    description = db.Column(db.String(255), nullable=False)
    reference_type = db.Column(db.String(50), nullable=True)  # 'parent_letter', 'quiz', etc.
    reference_id = db.Column(db.Integer, nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='token_transactions')

class ParentLetter(db.Model):
    __tablename__ = 'parent_letters'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(2), nullable=False)
    tone = db.Column(db.String(50), nullable=False)
    student_context = db.Column(db.Text, nullable=False)
    tokens_used = db.Column(db.Integer, default=1)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='parent_letters')

class Quiz(db.Model):
    __tablename__ = 'quizzes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    topic = db.Column(db.String(255), nullable=False)
    level = db.Column(db.String(50), nullable=False)
    language = db.Column(db.String(2), nullable=False)
    tokens_used = db.Column(db.Integer, default=1)
    is_public = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    questions = db.relationship('QuizQuestion', back_populates='quiz')
    attempts = db.relationship('QuizAttempt', back_populates='quiz')

class QuizQuestion(db.Model):
    __tablename__ = 'quiz_questions'
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(20), default='multiple_choice')  # multiple_choice, true_false, short_answer
    correct_answer = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=True)  # For multiple choice questions
    order_index = db.Column(db.Integer, default=0)
    
    # Relationships
    quiz = db.relationship('Quiz', back_populates='questions')

class QuizAttempt(db.Model):
    __tablename__ = 'quiz_attempts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    answers = db.Column(db.JSON, nullable=False)
    score = db.Column(db.Float, nullable=True)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='quiz_attempts')
    quiz = db.relationship('Quiz', back_populates='attempts')

class ChatMessage(db.Model):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('users.id'), nullable=True)
    session_id = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=True)
    language = db.Column(db.String(2), nullable=False, default='en')
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
