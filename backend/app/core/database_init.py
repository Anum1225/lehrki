import asyncio
from database import init_db, get_db_session
from models import User, UserRole, TokenTransaction, Subscription, SubscriptionStatus
from auth import get_password_hash
from datetime import datetime

async def create_demo_data():
    """Create demo users and data for testing"""
    async with get_db_session() as session:
        try:
            # Create demo admin user
            admin_user = User(
                id="admin-demo",
                email="admin@devchef.com",
                first_name="Admin",
                last_name="User",
                role=UserRole.ADMIN,
                password_hash=get_password_hash("admin123"),
                language_preference="en"
            )
            session.add(admin_user)
            
            # Create demo teacher user
            teacher_user = User(
                id="teacher-demo",
                email="teacher@devchef.com",
                first_name="Teacher",
                last_name="Demo",
                role=UserRole.TEACHER,
                password_hash=get_password_hash("teacher123"),
                language_preference="en"
            )
            session.add(teacher_user)
            
            # Create demo student user
            student_user = User(
                id="student-demo",
                email="student@devchef.com",
                first_name="Student",
                last_name="Demo",
                role=UserRole.STUDENT,
                password_hash=get_password_hash("student123"),
                language_preference="en"
            )
            session.add(student_user)
            
            await session.commit()
            
            # Add token balances
            for user_id, amount in [("admin-demo", 5000), ("teacher-demo", 2000), ("student-demo", 100)]:
                token_transaction = TokenTransaction(
                    user_id=user_id,
                    amount=amount,
                    description="Initial token allocation",
                    reference_type="initial_allocation"
                )
                session.add(token_transaction)
            
            await session.commit()
            print("Demo data created successfully!")
            
        except Exception as e:
            print(f"Error creating demo data: {e}")
            await session.rollback()

async def main():
    """Initialize database and create demo data"""
    print("Initializing database...")
    await init_db()
    print("Database initialized!")
    
    print("Creating demo data...")
    await create_demo_data()
    print("Setup complete!")

if __name__ == "__main__":
    asyncio.run(main())