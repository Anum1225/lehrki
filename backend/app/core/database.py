import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import MetaData
from contextlib import asynccontextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

from app.core.config import settings

# Database configuration
DATABASE_URL = settings.DATABASE_URL

# Create async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    pool_pre_ping=True,
    pool_recycle=300,
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def init_db():
    """Initialize database tables"""
    try:
        async with engine.begin() as conn:
            # Import models to ensure tables are created
            from app.models.models import User, OAuth, Subscription, TokenTransaction, ParentLetter, Quiz, QuizQuestion, QuizAttempt, ChatMessage, Feedback
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
        
        # Create demo users
        await create_demo_users()
        
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

async def create_demo_users():
    """Create demo users for testing"""
    from app.models.models import User, UserRole
    from app.core.auth import get_password_hash
    from sqlalchemy import select
    
    demo_users = [
        {
            "id": "admin@devchef.com",
            "email": "admin@devchef.com",
            "first_name": "Admin",
            "last_name": "User",
            "password": "admin123",
            "role": UserRole.ADMIN,
            "language_preference": "en"
        },
        {
            "id": "teacher@devchef.com", 
            "email": "teacher@devchef.com",
            "first_name": "Teacher",
            "last_name": "Demo",
            "password": "teacher123",
            "role": UserRole.TEACHER,
            "language_preference": "en"
        },
        {
            "id": "student@devchef.com",
            "email": "student@devchef.com", 
            "first_name": "Student",
            "last_name": "Demo",
            "password": "student123",
            "role": UserRole.STUDENT,
            "language_preference": "en"
        }
    ]
    
    async with AsyncSessionLocal() as session:
        try:
            for user_data in demo_users:
                # Check if user already exists
                result = await session.execute(
                    select(User).where(User.email == user_data["email"])
                )
                existing_user = result.scalar_one_or_none()
                
                if existing_user:
                    logger.info(f"Demo user {user_data['email']} already exists")
                    continue
                
                # Create new user
                user = User(
                    id=user_data["id"],
                    email=user_data["email"],
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    role=user_data["role"],
                    password_hash=get_password_hash(user_data["password"]),
                    language_preference=user_data["language_preference"]
                )
                
                session.add(user)
                logger.info(f"Created demo user: {user_data['email']} ({user_data['role'].value})")
            
            await session.commit()
            logger.info("Demo users initialized successfully")
            
        except Exception as e:
            await session.rollback()
            logger.error(f"Error creating demo users: {e}")
            # Don't raise here to avoid breaking the app startup

@asynccontextmanager
async def get_db():
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def get_db_session():
    """Get database session for dependency injection"""
    session = AsyncSessionLocal()
    try:
        yield session
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()
