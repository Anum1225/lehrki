#!/usr/bin/env python3
"""
Test script to verify all import paths are working correctly
"""

import sys
import os

# Add the app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

def test_imports():
    """Test all critical imports"""
    try:
        print("Testing core imports...")
        from core.database import Base, get_db_session, init_db
        from core.auth import get_current_user, create_access_token
        from core.config import settings
        print("[OK] Core imports successful")
        
        print("Testing model imports...")
        from models.models import User, Quiz, QuizAttempt, ParentLetter, UserRole
        from models.schemas import UserCreate, QuizCreate, ParentLetterCreate
        print("[OK] Model imports successful")
        
        print("Testing service imports...")
        from services.ai_services import generate_parent_letter, generate_quiz_questions
        from services.websocket_manager import manager, NotificationService
        from services.ml_analytics import MLAnalytics, PredictiveAnalytics
        from services.enterprise import TenantManager, EnterpriseAnalytics
        from services.advanced_ai import AdvancedAIService
        print("[OK] Service imports successful")
        
        print("Testing API routes...")
        from api.routes import router
        print("[OK] API routes import successful")
        
        print("Testing main app...")
        from main import app
        print("[OK] Main app import successful")
        
        print("\nSUCCESS: All imports are working correctly!")
        return True
        
    except ImportError as e:
        print(f"[ERROR] Import error: {e}")
        return False
    except Exception as e:
        print(f"[ERROR] Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)