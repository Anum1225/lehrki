#!/usr/bin/env python3
"""
Script to create demo users for LehrKI application
Run this script to add demo users to the database
"""

import asyncio
import sys
import os

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db_session, init_db
from app.models.models import User, UserRole, TokenTransaction
from app.core.auth import get_password_hash

async def create_demo_users():
    """Create demo users with correct credentials"""
    
    # Initialize database first
    await init_db()
    
    async with get_db_session() as session:
        try:
            # Demo users data
            demo_users = [
                {
                    "id": "admin@lehrki.com",
                    "email": "admin@lehrki.com", 
                    "first_name": "Admin",
                    "last_name": "User",
                    "role": UserRole.ADMIN,
                    "password": "admin123",
                    "tokens": 5000
                },
                {
                    "id": "teacher@lehrki.com",
                    "email": "teacher@lehrki.com",
                    "first_name": "Teacher", 
                    "last_name": "Demo",
                    "role": UserRole.TEACHER,
                    "password": "teacher123",
                    "tokens": 2000
                },
                {
                    "id": "student@lehrki.com", 
                    "email": "student@lehrki.com",
                    "first_name": "Student",
                    "last_name": "Demo", 
                    "role": UserRole.STUDENT,
                    "password": "student123",
                    "tokens": 500
                }
            ]
            
            for user_data in demo_users:
                # Check if user already exists
                existing_user = await session.execute(
                    select(User).where(User.email == user_data["email"])
                )
                if existing_user.scalar_one_or_none():
                    print(f"User {user_data['email']} already exists, updating password...")
                    user = existing_user.scalar_one_or_none()
                    user.password_hash = get_password_hash(user_data["password"])
                else:
                    print(f"Creating user {user_data['email']}...")
                    user = User(
                        id=user_data["id"],
                        email=user_data["email"],
                        first_name=user_data["first_name"],
                        last_name=user_data["last_name"],
                        role=user_data["role"],
                        password_hash=get_password_hash(user_data["password"]),
                        language_preference="en"
                    )
                    session.add(user)
                
                await session.flush()
                
                # Add initial tokens
                token_transaction = TokenTransaction(
                    user_id=user_data["id"],
                    amount=user_data["tokens"],
                    description="Initial demo token allocation",
                    reference_type="demo_allocation"
                )
                session.add(token_transaction)
            
            await session.commit()
            print("✅ Demo users created successfully!")
            print("\nDemo Credentials:")
            print("Admin: admin@lehrki.com / admin123")
            print("Teacher: teacher@lehrki.com / teacher123") 
            print("Student: student@lehrki.com / student123")
            
        except Exception as e:
            print(f"❌ Error creating demo users: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(create_demo_users())