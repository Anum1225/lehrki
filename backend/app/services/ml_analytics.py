import numpy as np
from typing import Dict, List, Any
from datetime import datetime, timedelta
import json
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.models import Quiz, QuizAttempt, User, ParentLetter

class MLAnalytics:
    @staticmethod
    def calculate_learning_trajectory(scores: List[float]) -> Dict[str, Any]:
        """Calculate learning trajectory and predict future performance"""
        if len(scores) < 2:
            return {"trend": "insufficient_data", "prediction": None}
        
        # Simple linear regression for trend analysis
        x = np.arange(len(scores))
        y = np.array(scores)
        
        # Calculate slope (trend)
        slope = np.polyfit(x, y, 1)[0]
        
        # Predict next 3 scores
        future_x = np.arange(len(scores), len(scores) + 3)
        predictions = np.polyval([slope, y[-1] - slope * (len(scores) - 1)], future_x)
        
        trend = "improving" if slope > 0.5 else "declining" if slope < -0.5 else "stable"
        
        return {
            "trend": trend,
            "slope": float(slope),
            "current_avg": float(np.mean(y)),
            "predictions": [max(0, min(100, p)) for p in predictions.tolist()],
            "confidence": min(1.0, len(scores) / 10)  # Higher confidence with more data
        }

    @staticmethod
    def analyze_subject_strengths(subject_scores: Dict[str, List[float]]) -> Dict[str, Any]:
        """Analyze strengths and weaknesses across subjects"""
        analysis = {}
        
        for subject, scores in subject_scores.items():
            if not scores:
                continue
                
            avg_score = np.mean(scores)
            consistency = 1 - (np.std(scores) / 100)  # Normalized consistency
            improvement = MLAnalytics.calculate_learning_trajectory(scores)
            
            # Determine performance level
            if avg_score >= 85:
                level = "excellent"
            elif avg_score >= 70:
                level = "good"
            elif avg_score >= 60:
                level = "average"
            else:
                level = "needs_improvement"
            
            analysis[subject] = {
                "average_score": float(avg_score),
                "consistency": float(consistency),
                "performance_level": level,
                "trend": improvement["trend"],
                "recommendation": MLAnalytics._generate_subject_recommendation(level, improvement["trend"])
            }
        
        return analysis

    @staticmethod
    def _generate_subject_recommendation(level: str, trend: str) -> str:
        """Generate AI-powered recommendations"""
        recommendations = {
            ("excellent", "improving"): "Continue current study methods. Consider advanced topics.",
            ("excellent", "stable"): "Maintain consistency. Try challenging practice problems.",
            ("excellent", "declining"): "Review recent topics. Check for knowledge gaps.",
            ("good", "improving"): "Great progress! Focus on weak areas for excellence.",
            ("good", "stable"): "Consistent performance. Increase practice frequency.",
            ("good", "declining"): "Review fundamentals. Consider additional study time.",
            ("average", "improving"): "Positive trend! Continue current study approach.",
            ("average", "stable"): "Focus on understanding concepts deeply.",
            ("average", "declining"): "Immediate attention needed. Review basic concepts.",
            ("needs_improvement", "improving"): "Good progress! Maintain study routine.",
            ("needs_improvement", "stable"): "Consider different learning methods.",
            ("needs_improvement", "declining"): "Urgent intervention needed. Seek additional help."
        }
        
        return recommendations.get((level, trend), "Continue practicing regularly.")

    @staticmethod
    def predict_optimal_study_time(performance_data: List[Dict]) -> Dict[str, Any]:
        """Predict optimal study times based on performance patterns"""
        if not performance_data:
            return {"optimal_hours": 2, "confidence": 0}
        
        # Analyze performance vs study time correlation
        study_times = [d.get("study_time", 2) for d in performance_data]
        scores = [d.get("score", 0) for d in performance_data]
        
        if len(study_times) < 3:
            return {"optimal_hours": 2, "confidence": 0.3}
        
        # Find correlation between study time and performance
        correlation = np.corrcoef(study_times, scores)[0, 1] if len(study_times) > 1 else 0
        
        # Optimal study time (simplified model)
        optimal_time = np.mean(study_times) + (correlation * 0.5)
        optimal_time = max(1, min(6, optimal_time))  # Clamp between 1-6 hours
        
        return {
            "optimal_hours": float(optimal_time),
            "correlation": float(correlation),
            "confidence": min(1.0, len(performance_data) / 20)
        }

    @staticmethod
    async def generate_personalized_insights(session: AsyncSession, user_id: str) -> Dict[str, Any]:
        """Generate comprehensive personalized insights"""
        try:
            # Get user's quiz attempts
            attempts_result = await session.execute(
                select(QuizAttempt, Quiz)
                .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
                .where(Quiz.user_id == user_id)
                .order_by(QuizAttempt.created_at.desc())
                .limit(50)
            )
            attempts = attempts_result.all()
            
            if not attempts:
                return {"message": "No data available for analysis"}
            
            # Organize data by subject
            subject_data = {}
            all_scores = []
            performance_data = []
            
            for attempt, quiz in attempts:
                subject = quiz.topic or "General"
                if subject not in subject_data:
                    subject_data[subject] = []
                
                subject_data[subject].append(attempt.score)
                all_scores.append(attempt.score)
                performance_data.append({
                    "score": attempt.score,
                    "study_time": 2,  # Default, would be tracked in real app
                    "date": attempt.created_at
                })
            
            # Generate insights
            overall_trajectory = MLAnalytics.calculate_learning_trajectory(all_scores)
            subject_analysis = MLAnalytics.analyze_subject_strengths(subject_data)
            study_optimization = MLAnalytics.predict_optimal_study_time(performance_data)
            
            # Generate recommendations
            recommendations = []
            
            if overall_trajectory["trend"] == "declining":
                recommendations.append("Consider reviewing fundamental concepts")
            elif overall_trajectory["trend"] == "improving":
                recommendations.append("Great progress! Keep up the current study routine")
            
            # Add subject-specific recommendations
            for subject, analysis in subject_analysis.items():
                if analysis["performance_level"] == "needs_improvement":
                    recommendations.append(f"Focus more attention on {subject}")
            
            return {
                "overall_performance": {
                    "average_score": float(np.mean(all_scores)),
                    "trend": overall_trajectory["trend"],
                    "predictions": overall_trajectory["predictions"]
                },
                "subject_analysis": subject_analysis,
                "study_optimization": study_optimization,
                "recommendations": recommendations,
                "insights_generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {"error": f"Failed to generate insights: {str(e)}"}

class PredictiveAnalytics:
    @staticmethod
    def predict_quiz_difficulty(topic: str, user_performance: Dict) -> str:
        """Predict optimal quiz difficulty for user"""
        avg_score = user_performance.get("average_score", 70)
        
        if avg_score >= 85:
            return "hard"
        elif avg_score >= 70:
            return "medium"
        else:
            return "easy"
    
    @staticmethod
    def recommend_study_materials(weak_subjects: List[str]) -> List[Dict]:
        """Recommend study materials based on weak subjects"""
        materials = {
            "Mathematics": [
                {"type": "video", "title": "Algebra Fundamentals", "url": "#"},
                {"type": "practice", "title": "Math Practice Problems", "url": "#"}
            ],
            "Science": [
                {"type": "article", "title": "Scientific Method Guide", "url": "#"},
                {"type": "experiment", "title": "Virtual Lab Experiments", "url": "#"}
            ],
            "English": [
                {"type": "reading", "title": "Grammar Essentials", "url": "#"},
                {"type": "writing", "title": "Essay Writing Guide", "url": "#"}
            ]
        }
        
        recommendations = []
        for subject in weak_subjects:
            if subject in materials:
                recommendations.extend(materials[subject])
        
        return recommendations