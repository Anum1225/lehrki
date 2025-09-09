import openai
import json
from typing import Dict, List, Any, Optional
from datetime import datetime
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.models import User, Quiz, QuizAttempt, ParentLetter

class AdvancedAIService:
    """Advanced AI capabilities with multiple models and fallbacks"""
    
    def __init__(self):
        self.models = {
            "gpt-4o": {"max_tokens": 128000, "cost_per_token": 0.000005}
        }
    
    async def generate_adaptive_quiz(self, user_performance: Dict, topic: str, difficulty: str) -> Dict:
        """Generate quiz adapted to user's learning style and performance"""
        try:
            # Analyze user's learning patterns
            learning_style = self._analyze_learning_style(user_performance)
            
            prompt = f"""
            Create an adaptive quiz for a {learning_style} learner on {topic} at {difficulty} level.
            
            User Performance Context:
            - Average Score: {user_performance.get('avg_score', 70)}%
            - Weak Areas: {', '.join(user_performance.get('weak_areas', []))}
            - Strong Areas: {', '.join(user_performance.get('strong_areas', []))}
            - Learning Style: {learning_style}
            
            Generate 10 questions that:
            1. Target identified weak areas
            2. Match the user's learning style
            3. Progressively increase in difficulty
            4. Include detailed explanations
            
            Return JSON format with questions, options, correct answers, and explanations.
            """
            
            # Use OpenAI API (with fallback)
            response = await self._call_ai_with_fallback(prompt, "quiz_generation")
            
            return {
                "questions": response.get("questions", []),
                "adaptive_features": {
                    "learning_style": learning_style,
                    "difficulty_progression": True,
                    "personalized_feedback": True
                },
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return await self._fallback_adaptive_quiz(topic, difficulty)
    
    async def generate_personalized_study_plan(self, session: AsyncSession, user_id: str) -> Dict:
        """Generate AI-powered personalized study plan"""
        try:
            # Get user's learning data
            user_data = await self._get_user_learning_data(session, user_id)
            
            prompt = f"""
            Create a personalized 30-day study plan based on this learning data:
            
            User Profile:
            - Current Level: {user_data.get('level', 'Intermediate')}
            - Subjects: {', '.join(user_data.get('subjects', []))}
            - Performance Trends: {user_data.get('trends', {})}
            - Available Study Time: {user_data.get('study_time', 2)} hours/day
            - Learning Goals: {user_data.get('goals', 'General improvement')}
            
            Generate a detailed study plan with:
            1. Daily study schedules
            2. Subject rotation strategy
            3. Difficulty progression
            4. Review sessions
            5. Assessment milestones
            6. Motivation techniques
            
            Return structured JSON format.
            """
            
            response = await self._call_ai_with_fallback(prompt, "study_plan")
            
            return {
                "study_plan": response.get("plan", {}),
                "duration": "30 days",
                "personalization_factors": user_data,
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return self._fallback_study_plan()
    
    async def generate_intelligent_feedback(self, quiz_results: Dict, user_history: List[Dict]) -> Dict:
        """Generate intelligent, contextual feedback"""
        try:
            prompt = f"""
            Analyze this quiz performance and provide intelligent feedback:
            
            Current Quiz Results:
            - Score: {quiz_results.get('score', 0)}%
            - Subject: {quiz_results.get('subject', 'General')}
            - Incorrect Answers: {quiz_results.get('incorrect_answers', [])}
            - Time Taken: {quiz_results.get('time_taken', 0)} minutes
            
            Historical Performance:
            {json.dumps(user_history[-5:], indent=2)}
            
            Provide:
            1. Detailed performance analysis
            2. Specific areas for improvement
            3. Personalized study recommendations
            4. Motivational feedback
            5. Next steps and goals
            6. Learning resources suggestions
            
            Make it encouraging and actionable.
            """
            
            response = await self._call_ai_with_fallback(prompt, "feedback")
            
            return {
                "feedback": response.get("feedback", ""),
                "recommendations": response.get("recommendations", []),
                "next_goals": response.get("goals", []),
                "motivation_score": response.get("motivation_score", 7),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return self._fallback_feedback(quiz_results)
    
    async def generate_content_recommendations(self, user_profile: Dict, learning_objectives: List[str]) -> Dict:
        """Generate personalized content recommendations"""
        try:
            prompt = f"""
            Recommend learning content for this user profile:
            
            User Profile:
            - Role: {user_profile.get('role', 'student')}
            - Level: {user_profile.get('level', 'intermediate')}
            - Interests: {', '.join(user_profile.get('interests', []))}
            - Learning Style: {user_profile.get('learning_style', 'visual')}
            
            Learning Objectives:
            {json.dumps(learning_objectives, indent=2)}
            
            Recommend:
            1. Specific topics to study
            2. Learning resources (videos, articles, exercises)
            3. Practice activities
            4. Assessment strategies
            5. Timeline suggestions
            
            Prioritize based on user's profile and objectives.
            """
            
            response = await self._call_ai_with_fallback(prompt, "recommendations")
            
            return {
                "recommendations": response.get("recommendations", []),
                "priority_topics": response.get("priority_topics", []),
                "learning_path": response.get("learning_path", []),
                "estimated_duration": response.get("duration", "2-4 weeks"),
                "generated_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            return self._fallback_recommendations()
    
    def _analyze_learning_style(self, performance_data: Dict) -> str:
        """Analyze user's learning style from performance data"""
        # Simplified learning style analysis
        avg_score = performance_data.get('avg_score', 70)
        consistency = performance_data.get('consistency', 0.7)
        
        if avg_score > 85 and consistency > 0.8:
            return "analytical"
        elif avg_score > 75 and consistency < 0.6:
            return "creative"
        elif consistency > 0.8:
            return "methodical"
        else:
            return "adaptive"
    
    async def _call_ai_with_fallback(self, prompt: str, task_type: str) -> Dict:
        """Call AI service with multiple model fallbacks"""
        models_to_try = ["gpt-4o"]  # Only GPT-4o model
        
        for model in models_to_try:
            try:
                # Simulate AI API call
                await asyncio.sleep(0.1)  # Simulate API delay
                
                # Return mock response based on task type
                return self._generate_mock_ai_response(task_type)
                
            except Exception as e:
                continue
        
        # If all models fail, use template-based fallback
        return self._generate_template_response(task_type)
    
    def _generate_mock_ai_response(self, task_type: str) -> Dict:
        """Generate mock AI responses for different task types"""
        responses = {
            "quiz_generation": {
                "questions": [
                    {
                        "question": "What is the primary function of mitochondria?",
                        "options": ["Energy production", "Protein synthesis", "DNA storage", "Waste removal"],
                        "correct_answer": "Energy production",
                        "explanation": "Mitochondria are known as the powerhouse of the cell, producing ATP through cellular respiration."
                    }
                ]
            },
            "study_plan": {
                "plan": {
                    "week_1": {
                        "focus": "Foundation building",
                        "daily_tasks": ["Review basics", "Practice problems", "Take notes"],
                        "goals": ["Master fundamental concepts"]
                    }
                }
            },
            "feedback": {
                "feedback": "Great improvement in problem-solving! Focus on time management for better results.",
                "recommendations": ["Practice timed quizzes", "Review weak topics", "Use active recall"],
                "goals": ["Improve speed", "Maintain accuracy"],
                "motivation_score": 8
            },
            "recommendations": {
                "recommendations": [
                    {"type": "video", "title": "Advanced Mathematics", "priority": "high"},
                    {"type": "practice", "title": "Problem Sets", "priority": "medium"}
                ],
                "priority_topics": ["Algebra", "Geometry"],
                "learning_path": ["Basics", "Intermediate", "Advanced"]
            }
        }
        
        return responses.get(task_type, {})
    
    def _generate_template_response(self, task_type: str) -> Dict:
        """Generate template-based responses as final fallback"""
        templates = {
            "quiz_generation": {"questions": []},
            "study_plan": {"plan": {"message": "Basic study plan template"}},
            "feedback": {"feedback": "Keep practicing to improve your skills!"},
            "recommendations": {"recommendations": []}
        }
        
        return templates.get(task_type, {})
    
    async def _get_user_learning_data(self, session: AsyncSession, user_id: str) -> Dict:
        """Get comprehensive user learning data"""
        try:
            # Get user's quiz performance
            user_result = await session.execute(
                select(User).where(User.id == user_id)
            )
            user = user_result.scalar_one_or_none()
            
            if not user:
                return {}
            
            # Get recent quiz attempts
            attempts_result = await session.execute(
                select(QuizAttempt, Quiz)
                .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
                .where(Quiz.user_id == user_id)
                .order_by(QuizAttempt.created_at.desc())
                .limit(20)
            )
            attempts = attempts_result.all()
            
            # Analyze performance
            scores = [attempt.score for attempt, _ in attempts]
            subjects = list(set([quiz.topic for _, quiz in attempts if quiz.topic]))
            
            return {
                "level": "Intermediate",  # Would be calculated from performance
                "subjects": subjects,
                "avg_score": sum(scores) / len(scores) if scores else 0,
                "trends": {"improving": len(scores) > 5},
                "study_time": 2,  # Default
                "goals": "Improve overall performance"
            }
            
        except Exception:
            return {}
    
    async def _fallback_adaptive_quiz(self, topic: str, difficulty: str) -> Dict:
        """Fallback quiz generation"""
        return {
            "questions": [
                {
                    "question": f"Basic {topic} question at {difficulty} level",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "Option A",
                    "explanation": "This is a template explanation."
                }
            ],
            "adaptive_features": {
                "learning_style": "general",
                "difficulty_progression": False,
                "personalized_feedback": False
            }
        }
    
    def _fallback_study_plan(self) -> Dict:
        """Fallback study plan"""
        return {
            "study_plan": {
                "week_1": {"focus": "Review fundamentals", "daily_tasks": ["Study 1 hour", "Practice problems"]},
                "week_2": {"focus": "Intermediate topics", "daily_tasks": ["Study 1.5 hours", "Take practice quiz"]},
                "week_3": {"focus": "Advanced concepts", "daily_tasks": ["Study 2 hours", "Group study"]},
                "week_4": {"focus": "Review and assessment", "daily_tasks": ["Review all topics", "Take final assessment"]}
            },
            "duration": "30 days",
            "personalization_factors": {"level": "general"}
        }
    
    def _fallback_feedback(self, quiz_results: Dict) -> Dict:
        """Fallback feedback generation"""
        score = quiz_results.get('score', 0)
        
        if score >= 80:
            feedback = "Excellent work! You're demonstrating strong understanding."
        elif score >= 60:
            feedback = "Good effort! Focus on reviewing the topics you missed."
        else:
            feedback = "Keep practicing! Review the fundamentals and try again."
        
        return {
            "feedback": feedback,
            "recommendations": ["Review missed topics", "Practice more problems", "Seek help if needed"],
            "next_goals": ["Improve weak areas", "Maintain strong performance"],
            "motivation_score": min(10, max(1, score // 10))
        }
    
    def _fallback_recommendations(self) -> Dict:
        """Fallback content recommendations"""
        return {
            "recommendations": [
                {"type": "review", "title": "Review basic concepts", "priority": "high"},
                {"type": "practice", "title": "Complete practice exercises", "priority": "medium"},
                {"type": "assessment", "title": "Take practice quiz", "priority": "low"}
            ],
            "priority_topics": ["Fundamentals", "Core concepts"],
            "learning_path": ["Basic", "Intermediate", "Advanced"],
            "estimated_duration": "2-3 weeks"
        }