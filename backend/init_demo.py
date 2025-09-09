#!/usr/bin/env python3
"""
Simple script to create demo users via direct database connection
"""

import asyncio
import sqlite3
import hashlib
import bcrypt
from datetime import datetime

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_demo_users():
    """Create demo users directly in SQLite database"""
    
    # Connect to database
    db_path = "app/lehrki_dev.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Demo users data
        demo_users = [
            ("admin@lehrki.com", "admin@lehrki.com", "Admin", "User", "admin", hash_password("admin123"), 5000),
            ("teacher@lehrki.com", "teacher@lehrki.com", "Teacher", "Demo", "teacher", hash_password("teacher123"), 2000),
            ("student@lehrki.com", "student@lehrki.com", "Student", "Demo", "student", hash_password("student123"), 500)
        ]
        
        for user_id, email, first_name, last_name, role, password_hash, tokens in demo_users:
            # Check if user exists
            cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
            if cursor.fetchone():
                print(f"Updating existing user: {email}")
                cursor.execute("""
                    UPDATE users 
                    SET password_hash = ?, role = ?
                    WHERE email = ?
                """, (password_hash, role, email))
            else:
                print(f"Creating new user: {email}")
                cursor.execute("""
                    INSERT INTO users (id, email, first_name, last_name, role, password_hash, language_preference, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, 'en', ?, ?)
                """, (user_id, email, first_name, last_name, role, password_hash, datetime.now(), datetime.now()))
            
            # Add tokens
            cursor.execute("""
                INSERT INTO token_transactions (user_id, amount, description, reference_type, created_at)
                VALUES (?, ?, 'Initial demo allocation', 'demo_allocation', ?)
            """, (user_id, tokens, datetime.now()))
        
        conn.commit()
        print("Demo users created successfully!")
        print("\nDemo Credentials:")
        print("Admin: admin@lehrki.com / admin123")
        print("Teacher: teacher@lehrki.com / teacher123")
        print("Student: student@lehrki.com / student123")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    create_demo_users()