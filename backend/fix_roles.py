#!/usr/bin/env python3
"""
Fix user roles in database to match enum values
"""

import sqlite3

def fix_user_roles():
    """Update user roles to match SQLAlchemy enum values"""
    
    # Connect to database
    db_path = "app/lehrki_dev.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    try:
        # Update roles to uppercase to match enum
        role_mapping = {
            'admin': 'ADMIN',
            'teacher': 'TEACHER', 
            'student': 'STUDENT'
        }
        
        for old_role, new_role in role_mapping.items():
            cursor.execute("UPDATE users SET role = ? WHERE role = ?", (new_role, old_role))
            print(f"Updated {old_role} -> {new_role}")
        
        conn.commit()
        print("User roles fixed successfully!")
        
        # Verify the changes
        cursor.execute("SELECT email, role FROM users")
        users = cursor.fetchall()
        print("\nCurrent users:")
        for email, role in users:
            print(f"  {email}: {role}")
        
    except Exception as e:
        print(f"Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    fix_user_roles()