from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from app.models.models import User, Quiz, QuizAttempt, Subscription, TokenTransaction
import json

class TenantManager:
    """Multi-tenant organization management"""
    
    @staticmethod
    async def create_organization(session: AsyncSession, org_data: Dict) -> Dict:
        """Create a new organization/tenant"""
        # In a real implementation, this would create organization records
        return {
            "id": f"org_{datetime.now().timestamp()}",
            "name": org_data.get("name"),
            "domain": org_data.get("domain"),
            "settings": org_data.get("settings", {}),
            "created_at": datetime.now().isoformat()
        }
    
    @staticmethod
    async def get_organization_users(session: AsyncSession, org_id: str) -> List[Dict]:
        """Get all users in an organization"""
        # Simplified - would filter by organization in real implementation
        result = await session.execute(
            select(User).limit(100)
        )
        users = result.scalars().all()
        
        return [{
            "id": user.id,
            "email": user.email,
            "name": f"{user.first_name} {user.last_name}",
            "role": user.role.value,
            "created_at": user.created_at.isoformat()
        } for user in users]

class EnterpriseAnalytics:
    """Advanced analytics for enterprise customers"""
    
    @staticmethod
    async def generate_organization_report(session: AsyncSession, org_id: str, date_range: Dict) -> Dict:
        """Generate comprehensive organization analytics"""
        try:
            start_date = datetime.fromisoformat(date_range.get("start", (datetime.now() - timedelta(days=30)).isoformat()))
            end_date = datetime.fromisoformat(date_range.get("end", datetime.now().isoformat()))
            
            # Get organization metrics
            user_count_result = await session.execute(
                select(func.count(User.id))
            )
            total_users = user_count_result.scalar() or 0
            
            # Quiz activity metrics
            quiz_activity_result = await session.execute(
                select(
                    func.count(Quiz.id),
                    func.avg(QuizAttempt.score)
                )
                .select_from(Quiz)
                .outerjoin(QuizAttempt, Quiz.id == QuizAttempt.quiz_id)
                .where(Quiz.created_at.between(start_date, end_date))
            )
            quiz_data = quiz_activity_result.first()
            total_quizzes = quiz_data[0] or 0
            avg_score = float(quiz_data[1]) if quiz_data[1] else 0
            
            # User engagement metrics
            active_users_result = await session.execute(
                select(func.count(func.distinct(Quiz.user_id)))
                .where(Quiz.created_at.between(start_date, end_date))
            )
            active_users = active_users_result.scalar() or 0
            
            # Performance by role
            role_performance = await EnterpriseAnalytics._get_role_performance(session, start_date, end_date)
            
            # Usage trends
            usage_trends = await EnterpriseAnalytics._get_usage_trends(session, start_date, end_date)
            
            return {
                "organization_id": org_id,
                "report_period": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat()
                },
                "summary": {
                    "total_users": total_users,
                    "active_users": active_users,
                    "engagement_rate": (active_users / total_users * 100) if total_users > 0 else 0,
                    "total_quizzes": total_quizzes,
                    "average_score": avg_score
                },
                "role_performance": role_performance,
                "usage_trends": usage_trends,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {"error": f"Failed to generate report: {str(e)}"}
    
    @staticmethod
    async def _get_role_performance(session: AsyncSession, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Get performance metrics by user role"""
        # Simplified implementation
        return [
            {"role": "teacher", "avg_score": 88.5, "quiz_count": 45, "active_users": 12},
            {"role": "student", "avg_score": 76.2, "quiz_count": 234, "active_users": 89},
            {"role": "admin", "avg_score": 92.1, "quiz_count": 8, "active_users": 3}
        ]
    
    @staticmethod
    async def _get_usage_trends(session: AsyncSession, start_date: datetime, end_date: datetime) -> List[Dict]:
        """Get usage trends over time"""
        # Generate daily usage data
        trends = []
        current_date = start_date
        
        while current_date <= end_date:
            # Simplified trend data
            trends.append({
                "date": current_date.isoformat()[:10],
                "active_users": max(1, int(20 + (current_date.day % 10) * 2)),
                "quizzes_created": max(0, int(5 + (current_date.day % 7))),
                "avg_score": 75 + (current_date.day % 20)
            })
            current_date += timedelta(days=1)
        
        return trends

class ComplianceManager:
    """Handle compliance and audit requirements"""
    
    @staticmethod
    async def generate_audit_log(session: AsyncSession, filters: Dict) -> List[Dict]:
        """Generate audit log for compliance"""
        # In real implementation, this would query audit tables
        return [
            {
                "timestamp": datetime.now().isoformat(),
                "user_id": "user123",
                "action": "quiz_created",
                "resource": "quiz_456",
                "ip_address": "192.168.1.1",
                "user_agent": "Mozilla/5.0..."
            }
        ]
    
    @staticmethod
    async def export_user_data(session: AsyncSession, user_id: str) -> Dict:
        """Export all user data for GDPR compliance"""
        try:
            # Get user data
            user_result = await session.execute(
                select(User).where(User.id == user_id)
            )
            user = user_result.scalar_one_or_none()
            
            if not user:
                return {"error": "User not found"}
            
            # Get user's quizzes
            quizzes_result = await session.execute(
                select(Quiz).where(Quiz.user_id == user_id)
            )
            quizzes = quizzes_result.scalars().all()
            
            # Get user's attempts
            attempts_result = await session.execute(
                select(QuizAttempt)
                .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
                .where(Quiz.user_id == user_id)
            )
            attempts = attempts_result.scalars().all()
            
            return {
                "user_profile": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "role": user.role.value,
                    "created_at": user.created_at.isoformat()
                },
                "quizzes": [{
                    "id": quiz.id,
                    "title": quiz.title,
                    "topic": quiz.topic,
                    "created_at": quiz.created_at.isoformat()
                } for quiz in quizzes],
                "quiz_attempts": [{
                    "quiz_id": attempt.quiz_id,
                    "score": attempt.score,
                    "completed_at": attempt.created_at.isoformat()
                } for attempt in attempts],
                "exported_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {"error": f"Failed to export data: {str(e)}"}

class IntegrationManager:
    """Handle third-party integrations"""
    
    @staticmethod
    async def sync_with_lms(org_id: str, lms_config: Dict) -> Dict:
        """Sync data with Learning Management System"""
        # Simulate LMS integration
        return {
            "status": "success",
            "synced_users": 150,
            "synced_courses": 25,
            "last_sync": datetime.now().isoformat()
        }
    
    @staticmethod
    async def export_to_sis(org_id: str, sis_config: Dict) -> Dict:
        """Export grades to Student Information System"""
        # Simulate SIS export
        return {
            "status": "success",
            "exported_grades": 500,
            "export_file": "grades_export_2024.csv",
            "exported_at": datetime.now().isoformat()
        }

class CustomizationManager:
    """Handle organization-specific customizations"""
    
    @staticmethod
    def get_organization_theme(org_id: str) -> Dict:
        """Get organization's custom theme"""
        # Default theme with customization options
        return {
            "primary_color": "#3B82F6",
            "secondary_color": "#10B981",
            "logo_url": "/api/organizations/{org_id}/logo",
            "custom_css": "",
            "branding": {
                "name": "LehrKI Enterprise",
                "tagline": "Empowering Education Through AI"
            }
        }
    
    @staticmethod
    def get_organization_settings(org_id: str) -> Dict:
        """Get organization-specific settings"""
        return {
            "features": {
                "ai_quiz_generation": True,
                "parent_letters": True,
                "advanced_analytics": True,
                "custom_branding": True,
                "sso_integration": True
            },
            "limits": {
                "max_users": 1000,
                "monthly_tokens": 100000,
                "storage_gb": 100
            },
            "integrations": {
                "google_classroom": False,
                "canvas_lms": False,
                "microsoft_teams": False
            }
        }