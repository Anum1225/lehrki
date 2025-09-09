from datetime import datetime
from app.core.database import Base
from sqlalchemy import Column, String, Integer, DateTime, Text, Boolean, Float, JSON, ForeignKey, UniqueConstraint, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
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

# (IMPORTANT) This table is mandatory for OAuth authentication, don't drop it.
class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    password_hash = Column(String(256), nullable=True)  # For JWT authentication
    role = Column(Enum(UserRole), default=UserRole.STUDENT, nullable=False)
    language_preference = Column(String(2), default='en', nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscription = relationship('Subscription', back_populates='user', uselist=False)
    token_transactions = relationship('TokenTransaction', back_populates='user')
    parent_letters = relationship('ParentLetter', back_populates='user')
    quiz_attempts = relationship('QuizAttempt', back_populates='user')
    quizzes = relationship('Quiz', back_populates='user')

    async def get_token_balance(self, session: AsyncSession):
        """Calculate current token balance"""
        result = await session.execute(
            select(func.sum(TokenTransaction.amount)).where(TokenTransaction.user_id == self.id)
        )
        balance = result.scalar()
        return balance or 0
    
    def has_premium_access(self):
        """Check if user has active premium subscription"""
        return (self.subscription and 
                self.subscription.status == SubscriptionStatus.ACTIVE and
                self.subscription.expires_at > datetime.utcnow())

# (IMPORTANT) This table is mandatory for OAuth authentication, don't drop it.
class OAuth(Base):
    __tablename__ = 'oauth'
    id = Column(Integer, primary_key=True)
    provider = Column(String(50), nullable=False)
    provider_user_id = Column(String, nullable=False)
    token = Column(JSON, nullable=False)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    browser_session_key = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship('User')

    __table_args__ = (UniqueConstraint(
        'user_id',
        'browser_session_key',
        'provider',
        name='uq_user_browser_session_key_provider',
    ),)

class Subscription(Base):
    __tablename__ = 'subscriptions'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    stripe_subscription_id = Column(String, unique=True, nullable=True)
    stripe_customer_id = Column(String, nullable=True)
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.INACTIVE)
    plan_name = Column(String(50), nullable=False, default='free')
    monthly_token_limit = Column(Integer, default=0)
    price_cents = Column(Integer, default=0)
    expires_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='subscription')

class TokenTransaction(Base):
    __tablename__ = 'token_transactions'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    amount = Column(Integer, nullable=False)  # Positive for credits, negative for debits
    description = Column(String(255), nullable=False)
    reference_type = Column(String(50), nullable=True)  # 'parent_letter', 'quiz', etc.
    reference_id = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='token_transactions')

class ParentLetter(Base):
    __tablename__ = 'parent_letters'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    language = Column(String(2), nullable=False)
    tone = Column(String(50), nullable=False)
    student_context = Column(Text, nullable=False)
    tokens_used = Column(Integer, default=1)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='parent_letters')

class Quiz(Base):
    __tablename__ = 'quizzes'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    topic = Column(String(255), nullable=False)
    level = Column(String(50), nullable=False)
    language = Column(String(2), nullable=False)
    tokens_used = Column(Integer, default=1)
    is_public = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='quizzes')
    questions = relationship('QuizQuestion', back_populates='quiz')
    attempts = relationship('QuizAttempt', back_populates='quiz')

class QuizQuestion(Base):
    __tablename__ = 'quiz_questions'
    id = Column(Integer, primary_key=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.id'), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(20), default='multiple_choice')  # multiple_choice, true_false, short_answer
    correct_answer = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)  # For multiple choice questions
    order_index = Column(Integer, default=0)
    
    # Relationships
    quiz = relationship('Quiz', back_populates='questions')

class QuizAttempt(Base):
    __tablename__ = 'quiz_attempts'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    quiz_id = Column(Integer, ForeignKey('quizzes.id'), nullable=False)
    answers = Column(JSON, nullable=False)
    score = Column(Float, nullable=True)
    completed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='quiz_attempts')
    quiz = relationship('Quiz', back_populates='attempts')

class ChatMessage(Base):
    __tablename__ = 'chat_messages'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=True)
    session_id = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    response = Column(Text, nullable=True)
    language = Column(String(2), nullable=False, default='en')
    
    created_at = Column(DateTime, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = 'feedback'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=True)
    type = Column(String(50), nullable=False)
    rating = Column(Integer, nullable=False)
    message = Column(Text, nullable=False)
    email = Column(String(255), nullable=True)
    status = Column(String(20), default='open')
    
    created_at = Column(DateTime, default=datetime.utcnow)

class Organization(Base):
    __tablename__ = 'organizations'
    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=True)
    settings = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CommunityPost(Base):
    __tablename__ = 'community_posts'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    likes = Column(Integer, default=0)
    replies = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class NotificationLog(Base):
    __tablename__ = 'notification_logs'
    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
