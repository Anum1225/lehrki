#!/usr/bin/env python3
"""
Script to create a single admin user in the database.
"""
import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.database import Base
from app.models.models import User, UserRole
from app.core.auth import get_password_hash

# Load environment variables
load_dotenv()

async def create_admin_user():
    """Create admin user if it doesn't exist"""
    # Database configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./lehrki_dev.db")

    # Create async engine
    engine = create_async_engine(
        DATABASE_URL,
        echo=True,
        pool_pre_ping=True,
        pool_recycle=300,
    )

    # Create async session factory
    AsyncSessionLocal = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False
    )

    async with AsyncSessionLocal() as session:
        try:
            # Check if admin already exists
            from sqlalchemy import select
            result = await session.execute(
                select(User).where(User.role == UserRole.ADMIN)
            )
            existing_admin = result.scalar_one_or_none()

            if existing_admin:
                print(f"Admin user already exists: {existing_admin.email}")
                return

            # Create admin user
            admin_email = "admin@devchef.com"
            admin_password = "admin123"

            admin = User(
                id=admin_email,
                email=admin_email,
                first_name="System",
                last_name="Administrator",
                role=UserRole.ADMIN,
                password_hash=get_password_hash(admin_password),
                language_preference="en"
            )

            session.add(admin)
            await session.commit()
            await session.refresh(admin)

            print("Admin user created successfully!")
            print(f"Email: {admin_email}")
            print(f"Password: {admin_password}")
            print("Please change the password after first login!")

        except Exception as e:
            await session.rollback()
            print(f"Error creating admin user: {str(e)}")
        finally:
            await session.close()

if __name__ == "__main__":
    asyncio.run(create_admin_user())