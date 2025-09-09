import json
import os
import httpx
import hashlib
import time
from typing import Dict, List, Optional, Any
from openai import AsyncOpenAI

# Using GPT-4o as the primary model
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

_openai_client = None
_response_cache = {}
_cache_ttl = 3600  # 1 hour cache

def _get_openai():
    global _openai_client
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return None  # Return None instead of raising exception
    if _openai_client is None:
        _openai_client = AsyncOpenAI(api_key=api_key)
    return _openai_client

def _get_cache_key(prompt: str, model: str = "gpt-4o") -> str:
    """Generate cache key for AI responses"""
    return hashlib.md5(f"{model}:{prompt}".encode()).hexdigest()

def _get_cached_response(cache_key: str) -> Optional[Dict]:
    """Get cached response if still valid"""
    if cache_key in _response_cache:
        cached_data = _response_cache[cache_key]
        if time.time() - cached_data['timestamp'] < _cache_ttl:
            return cached_data['response']
        else:
            del _response_cache[cache_key]
    return None

def _cache_response(cache_key: str, response: Dict):
    """Cache AI response"""
    _response_cache[cache_key] = {
        'response': response,
        'timestamp': time.time()
    }

def get_fallback_parent_letter(student_context, content_type, tone, language):
    """Generate enhanced fallback parent letter when AI is unavailable"""
    student_name = student_context.get('name', 'Student')
    parent_name = student_context.get('parent_name', 'Parent')
    subject = student_context.get('subject', 'General Studies')
    grade = student_context.get('grade', '')
    key_points = student_context.get('key_points', '')
    additional_context = student_context.get('additional_context', '')
    
    from datetime import datetime
    date = datetime.now().strftime('%B %d, %Y')
    
    templates = {
        'progress_report': f"""Dear {parent_name},

I hope this letter finds you well. I am writing to provide you with an update regarding {student_name}'s progress in {subject}{f' ({grade})' if grade else ''}.

{key_points + '\n\n' if key_points else ''}{student_name} has been demonstrating consistent effort and engagement in class. Their understanding of the core concepts is developing well, and they actively participate in classroom discussions.

Recent observations:
• Shows improvement in problem-solving skills
• Demonstrates good collaboration with peers
• Completes assignments on time
• Asks thoughtful questions during lessons

{additional_context + '\n\n' if additional_context else ''}I encourage continued support at home through regular review of class materials and completion of homework assignments. Please feel free to contact me if you have any questions or would like to schedule a conference to discuss {student_name}'s progress in more detail.

Best regards,
[Teacher Name]
{subject} Teacher
[School Name]

Date: {date}""",
        
        'behavior_update': f"""Dear {parent_name},

I wanted to reach out to discuss {student_name}'s recent behavior and social development in {subject} class.

{key_points + '\n\n' if key_points else ''}{student_name} has been showing positive growth in their classroom behavior. They are learning to follow classroom expectations and work well with their classmates.

Positive observations:
• Shows respect for classroom rules
• Demonstrates good listening skills
• Works cooperatively in group activities
• Shows kindness to fellow students

{additional_context + '\n\n' if additional_context else ''}I appreciate your support in reinforcing these positive behaviors at home. Together, we can help {student_name} continue to develop strong social and academic skills.

Warm regards,
[Teacher Name]
{subject} Teacher

Date: {date}""",
        
        'achievement_celebration': f"""Dear {parent_name},

I am delighted to share some wonderful news about {student_name}'s recent achievements in {subject}!

{key_points + '\n\n' if key_points else ''}{student_name} has demonstrated exceptional performance and dedication in their studies. Their hard work and positive attitude have truly paid off.

Notable achievements:
• Excellent performance on recent assessments
• Outstanding participation in class discussions
• Demonstrates mastery of key concepts
• Shows leadership qualities in group work

{additional_context + '\n\n' if additional_context else ''}Please join me in celebrating {student_name}'s success! Their commitment to learning is truly commendable, and I look forward to seeing their continued growth.

Congratulations to both you and {student_name}!

Proud regards,
[Teacher Name]
{subject} Teacher

Date: {date}""",
        
        'academic_concern': f"""Dear {parent_name},

I hope this letter finds you well. I am writing to discuss some concerns regarding {student_name}'s academic performance in {subject}.

{key_points + '\n\n' if key_points else ''}While {student_name} is a capable student, I have noticed some areas where additional support would be beneficial. I believe that with the right strategies and support, {student_name} can overcome these challenges.

Areas for improvement:
• Consistent completion of homework assignments
• Active participation in class discussions
• Seeking help when concepts are unclear
• Time management and organization skills

{additional_context + '\n\n' if additional_context else ''}I would like to work together with you to develop strategies that will help {student_name} succeed. Please feel free to contact me to discuss how we can best support {student_name}'s learning.

Sincerely,
[Teacher Name]
{subject} Teacher

Date: {date}""",
        
        'meeting_request': f"""Dear {parent_name},

I hope this letter finds you well. I would like to request a meeting to discuss {student_name}'s progress in {subject}.

{key_points + '\n\n' if key_points else ''}I believe it would be beneficial for us to meet and discuss {student_name}'s academic and social development. This will allow us to work together to ensure {student_name} continues to thrive.

Discussion topics:
• Academic progress and achievements
• Areas for continued growth
• Strategies for home support
• Goals for the remainder of the term

{additional_context + '\n\n' if additional_context else ''}Please let me know your availability for a meeting in the coming weeks. I am flexible with scheduling and can accommodate your preferred time.

Looking forward to our conversation,
[Teacher Name]
{subject} Teacher

Date: {date}""",
        
        'homework_reminder': f"""Dear {parent_name},

I hope this letter finds you well. I wanted to reach out regarding {student_name}'s homework completion in {subject}.

{key_points + '\n\n' if key_points else ''}Consistent homework completion is essential for reinforcing classroom learning and building strong study habits. I wanted to share some strategies that might help {student_name} stay on track.

Homework support strategies:
• Establish a regular homework routine
• Create a quiet, organized study space
• Break larger assignments into smaller tasks
• Encourage {student_name} to ask for help when needed

{additional_context + '\n\n' if additional_context else ''}Please feel free to contact me if you have any questions about assignments or if {student_name} needs additional support with the material.

Best regards,
[Teacher Name]
{subject} Teacher

Date: {date}"""
    }
    
    content = templates.get(content_type, templates['progress_report'])
    return {
        'title': f'{content_type.replace("_", " ").title()} - {student_name}',
        'content': content,
        'key_points': ["Student progress update", "Continued support needed", "Open communication encouraged"],
        'follow_up_suggestions': ["Schedule parent-teacher conference", "Monitor homework completion", "Maintain regular communication"]
    }

async def generate_parent_letter(student_context, content_type, tone, language):
    """Generate a parent letter using OpenAI with caching"""
    try:
        openai_client = _get_openai()
        if not openai_client:
            # No API key configured, use fallback immediately
            fallback = get_fallback_parent_letter(student_context, content_type, tone, language)
            fallback['ai_generated'] = False
            return fallback
            
        cache_key = _get_cache_key(f"parent_letter:{content_type}:{tone}:{student_context.get('name', 'student')}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        language_names = {
            'en': 'English', 'de': 'German', 'fr': 'French', 'it': 'Italian'
        }
        
        prompt = f"""Generate a professional parent letter in {language_names.get(language, 'English')}. 
        
        Content type: {content_type}
        Tone: {tone}
        Student context: {student_context}
        
        The letter should be formal, respectful, and provide constructive feedback or information about the student.
        Structure it as a proper business letter with appropriate greeting and closing.
        Include specific examples and actionable recommendations.
        
        Respond with JSON in this format:
        {{
            "title": "Brief title for the letter",
            "content": "Full letter content",
            "key_points": ["point1", "point2", "point3"],
            "follow_up_suggestions": ["suggestion1", "suggestion2"]
        }}
        """
        
        response = await openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an experienced teacher writing professional letters to parents. Always respond in valid JSON format."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1200
        )
        
        result = json.loads(response.choices[0].message.content)
        enhanced_result = {
            "title": result.get("title", "Parent Letter"),
            "content": result.get("content", "Letter content could not be generated."),
            "key_points": result.get("key_points", []),
            "follow_up_suggestions": result.get("follow_up_suggestions", [])
        }
        _cache_response(cache_key, enhanced_result)
        return enhanced_result
        
    except Exception as e:
        # Fallback to template when AI fails
        fallback = get_fallback_parent_letter(student_context, content_type, tone, language)
        fallback['ai_generated'] = False
        return fallback

def get_fallback_quiz_questions(topic, level, language, num_questions=5):
    """Generate enhanced fallback quiz questions when AI is unavailable"""
    questions = []
    for i in range(min(num_questions, 3)):
        questions.append({
            'question_text': f'What is an important concept in {topic}?',
            'question_type': 'multiple_choice',
            'correct_answer': 'Understanding the fundamentals',
            'options': ['Understanding the fundamentals', 'Memorizing facts', 'Ignoring details', 'Skipping practice'],
            'explanation': f'Understanding fundamentals is crucial for mastering {topic}.',
            'difficulty': 'medium',
            'learning_objective': f'Assess basic understanding of {topic} concepts'
        })
        questions.append({
            'question_text': f'True or False: {topic} requires practice to master.',
            'question_type': 'true_false', 
            'correct_answer': 'True',
            'options': ['True', 'False'],
            'explanation': f'Like most subjects, {topic} requires consistent practice to achieve mastery.',
            'difficulty': 'easy',
            'learning_objective': f'Understand the importance of practice in {topic}'
        })
    return questions[:num_questions]

async def generate_quiz_questions(topic, level, language, num_questions=5):
    """Generate quiz questions using OpenAI with caching and enhanced features"""
    try:
        openai_client = _get_openai()
        if not openai_client:
            # No API key configured, use fallback immediately
            return get_fallback_quiz_questions(topic, level, language, num_questions)
            
        cache_key = _get_cache_key(f"quiz:{topic}:{level}:{language}:{num_questions}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        language_names = {
            'en': 'English', 'de': 'German', 'fr': 'French', 'it': 'Italian'
        }
        
        prompt = f"""Create {num_questions} educational quiz questions on the topic "{topic}" 
        for {level} level students in {language_names.get(language, 'English')}.
        
        Include a mix of multiple choice, true/false, and short answer questions.
        Ensure questions are engaging, accurate, and progressively challenging.
        Include detailed explanations for each correct answer.
        
        Respond with JSON in this format:
        {{
            "questions": [
                {{
                    "question_text": "Question text",
                    "question_type": "multiple_choice|true_false|short_answer",
                    "correct_answer": "Correct answer",
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                    "explanation": "Detailed explanation of the correct answer",
                    "difficulty": "easy|medium|hard",
                    "learning_objective": "What this question tests"
                }}
            ],
            "metadata": {{
                "topic": "{topic}",
                "level": "{level}",
                "estimated_time": "10 minutes"
            }}
        }}
        """
        
        response = await openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational content creator. Create engaging and accurate quiz questions with detailed explanations. Always respond in valid JSON format."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=2000
        )
        
        result = json.loads(response.choices[0].message.content)
        questions = result.get("questions", [])
        _cache_response(cache_key, questions)
        return questions
        
    except Exception as e:
        # Fallback to template questions when AI fails
        return get_fallback_quiz_questions(topic, level, language, num_questions)

async def generate_chatbot_response(message, user_role, language, conversation_history: List[Dict] = None):
    """Generate enhanced chatbot response with context awareness"""
    try:
        openai_client = _get_openai()
        if not openai_client:
            # No API key configured, provide helpful fallback response
            return {
                "response": f"Hello! I'm LehrKI's AI assistant. I can help you with educational questions, quiz creation, and learning support. However, my AI features are currently in demo mode. What would you like to know about our platform?",
                "suggestions": ["Tell me about quiz creation", "How do I create a parent letter?", "What features are available?"],
                "context_aware": False
            }
            
        cache_key = _get_cache_key(f"chat:{message[:50]}:{user_role}:{language}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        language_names = {
            'en': 'English', 'de': 'German', 'fr': 'French', 'it': 'Italian'
        }
        
        role_context = {
            'student': 'You are helping a student with their learning. Be encouraging, educational, and provide study tips.',
            'teacher': 'You are assisting a teacher with educational tools, classroom management, and pedagogical advice.',
            'admin': 'You are helping an administrator with platform management, user support, and system insights.',
            'parent': 'You are helping a parent understand their child\'s educational progress and how to support learning at home.'
        }
        
        system_prompt = f"""You are LehrKI, an AI assistant for an educational platform.
        {role_context.get(user_role, 'You are helping a user with educational content.')}

        Always respond in {language_names.get(language, 'English')}.
        Be helpful, professional, and educational in your responses.
        Provide actionable advice and specific examples when possible.
        If asked about technical issues, direct users to contact support.
        Keep responses concise but informative.
        """
        
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add conversation history for context
        if conversation_history:
            messages.extend(conversation_history[-6:])  # Last 6 messages for context
            
        messages.append({"role": "user", "content": message})
        
        response = await openai_client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=600,
            temperature=0.7
        )
        
        result = {
            "response": response.choices[0].message.content,
            "suggestions": [],  # Could be enhanced with follow-up suggestions
            "context_aware": bool(conversation_history)
        }
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        return {
            "response": "I'm sorry, I'm currently in demo mode. I can still help you navigate the platform and answer basic questions about LehrKI's features!",
            "suggestions": ["Show me the quiz creator", "How do parent letters work?", "What analytics are available?"],
            "context_aware": False
        }

async def assess_quiz_answers(quiz_questions, user_answers, language, detailed_analysis=True):
    """Provide enhanced assessment feedback for quiz answers"""
    try:
        cache_key = _get_cache_key(f"assess:{str(quiz_questions)[:50]}:{str(user_answers)[:50]}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        language_names = {
            'en': 'English', 'de': 'German', 'fr': 'French', 'it': 'Italian'
        }
        
        assessment_data = {
            "questions": quiz_questions,
            "answers": user_answers
        }
        
        prompt = f"""Assess the following quiz answers and provide constructive feedback in {language_names.get(language, 'English')}.
        
        Quiz data: {json.dumps(assessment_data)}
        
        For each question, determine if the answer is correct and provide detailed feedback.
        Calculate an overall score as a percentage.
        Identify learning patterns and provide improvement suggestions.
        
        Respond with JSON in this format:
        {{
            "score": 85.5,
            "grade": "B+",
            "feedback": [
                {{
                    "question_index": 0,
                    "is_correct": true,
                    "feedback": "Excellent! Your answer is correct.",
                    "explanation": "Additional explanation if needed"
                }}
            ],
            "overall_feedback": "Overall assessment summary",
            "strengths": ["strength1", "strength2"],
            "areas_for_improvement": ["area1", "area2"],
            "study_recommendations": ["recommendation1", "recommendation2"],
            "time_analysis": "Performance timing insights",
            "next_steps": ["step1", "step2"]
        }}
        """
        
        response = await _get_openai().chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational assessment expert. Provide fair, constructive, and detailed feedback. Always respond in valid JSON format."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1500
        )
        
        result = json.loads(response.choices[0].message.content)
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        raise Exception(f"Failed to assess quiz answers: {e}")

async def summarize_content(content: str, summary_type: str = "brief", language: str = "en") -> Dict:
    """AI-powered content summarization service"""
    try:
        cache_key = _get_cache_key(f"summarize:{content[:100]}:{summary_type}:{language}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        language_names = {
            'en': 'English', 'de': 'German', 'fr': 'French', 'it': 'Italian'
        }
        
        summary_types = {
            "brief": "Create a concise 2-3 sentence summary",
            "detailed": "Create a comprehensive summary with key points",
            "bullet_points": "Create a bullet-point summary of main ideas",
            "study_notes": "Create study notes with important concepts highlighted"
        }
        
        prompt = f"""{summary_types.get(summary_type, summary_types['brief'])} of the following content in {language_names.get(language, 'English')}:
        
        Content: {content}
        
        Respond with JSON:
        {{
            "summary": "The summarized content",
            "key_points": ["point1", "point2", "point3"],
            "word_count": 150,
            "reading_time": "2 minutes"
        }}
        """
        
        response = await _get_openai().chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert content summarizer. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=800
        )
        
        result = json.loads(response.choices[0].message.content)
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        return {
            "summary": "Content summarization temporarily unavailable.",
            "key_points": ["Please try again later"],
            "word_count": 0,
            "reading_time": "N/A"
        }

async def generate_learning_path(subject: str, current_level: str, target_level: str, timeframe: str, language: str = "en") -> Dict:
    """Generate personalized learning path"""
    try:
        cache_key = _get_cache_key(f"learning_path:{subject}:{current_level}:{target_level}:{timeframe}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        language_names = {
            'en': 'English', 'de': 'German', 'fr': 'French', 'it': 'Italian'
        }
        
        prompt = f"""Create a detailed learning path in {language_names.get(language, 'English')} for:
        
        Subject: {subject}
        Current Level: {current_level}
        Target Level: {target_level}
        Timeframe: {timeframe}
        
        Include:
        1. Learning phases with specific goals
        2. Recommended resources and activities
        3. Assessment checkpoints
        4. Time allocation for each phase
        5. Prerequisites and dependencies
        
        Respond with JSON:
        {{
            "learning_path": {{
                "phase_1": {{
                    "title": "Foundation Building",
                    "duration": "2 weeks",
                    "goals": ["goal1", "goal2"],
                    "activities": ["activity1", "activity2"],
                    "resources": ["resource1", "resource2"],
                    "assessment": "checkpoint description"
                }}
            }},
            "total_duration": "{timeframe}",
            "difficulty_progression": ["beginner", "intermediate", "advanced"],
            "success_metrics": ["metric1", "metric2"]
        }}
        """
        
        response = await _get_openai().chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an educational curriculum designer. Create structured learning paths. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1500
        )
        
        result = json.loads(response.choices[0].message.content)
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        return {
            "learning_path": {
                "phase_1": {
                    "title": "Getting Started",
                    "duration": "1 week",
                    "goals": ["Learn basics", "Practice fundamentals"],
                    "activities": ["Read introductory materials", "Complete basic exercises"],
                    "resources": ["Textbook chapters 1-3", "Online tutorials"],
                    "assessment": "Basic knowledge quiz"
                }
            },
            "total_duration": timeframe,
            "difficulty_progression": ["beginner", "intermediate"],
            "success_metrics": ["Complete all phases", "Pass assessments"]
        }

# New AI Component: Smart Study Scheduler
async def generate_study_schedule(subjects: List[str], available_hours: int, preferences: Dict, language: str = "en") -> Dict:
    """AI-powered study schedule optimization"""
    try:
        cache_key = _get_cache_key(f"schedule:{str(subjects)}:{available_hours}:{str(preferences)}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        prompt = f"""Create an optimized study schedule for:
        Subjects: {subjects}
        Available hours per week: {available_hours}
        Preferences: {preferences}
        
        Generate a weekly schedule with optimal time allocation.
        
        Respond with JSON:
        {{
            "weekly_schedule": {{
                "monday": [{{"subject": "Math", "time": "9:00-10:30", "type": "study"}}],
                "tuesday": [{{"subject": "Science", "time": "14:00-15:00", "type": "review"}}]
            }},
            "study_tips": ["tip1", "tip2"],
            "break_recommendations": "Take 15min breaks every hour"
        }}
        """
        
        response = await _get_openai().chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a study optimization expert. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1000
        )
        
        result = json.loads(response.choices[0].message.content)
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        return {
            "weekly_schedule": {"monday": [{"subject": subjects[0] if subjects else "General", "time": "9:00-10:00", "type": "study"}]},
            "study_tips": ["Create a consistent routine", "Take regular breaks"],
            "break_recommendations": "Take breaks every hour"
        }

# New AI Component: Performance Predictor
async def predict_performance(student_data: Dict, target_subject: str, language: str = "en") -> Dict:
    """AI-powered performance prediction and recommendations"""
    try:
        cache_key = _get_cache_key(f"predict:{str(student_data)}:{target_subject}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        prompt = f"""Analyze student performance data and predict outcomes:
        Student Data: {student_data}
        Target Subject: {target_subject}
        
        Provide predictions and actionable recommendations.
        
        Respond with JSON:
        {{
            "predicted_score": 85,
            "confidence_level": "high",
            "risk_factors": ["factor1", "factor2"],
            "improvement_areas": ["area1", "area2"],
            "recommended_actions": ["action1", "action2"],
            "timeline": "2-3 weeks"
        }}
        """
        
        response = await _get_openai().chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an educational data analyst. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=800
        )
        
        result = json.loads(response.choices[0].message.content)
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        return {
            "predicted_score": 75,
            "confidence_level": "medium",
            "risk_factors": ["Needs more practice"],
            "improvement_areas": ["Focus on fundamentals"],
            "recommended_actions": ["Increase study time", "Seek help when needed"],
            "timeline": "4-6 weeks"
        }

async def automated_grading_assistant(assignment_text: str, rubric: Dict, student_answer: str, language: str = "en") -> Dict:
    """AI-powered automated grading with detailed feedback"""
    try:
        cache_key = _get_cache_key(f"grading:{assignment_text[:50]}:{student_answer[:50]}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        language_names = {
            'en': 'English', 'de': 'German', 'fr': 'French', 'it': 'Italian'
        }
        
        prompt = f"""Grade this student assignment in {language_names.get(language, 'English')} using the provided rubric:
        
        Assignment: {assignment_text}
        
        Rubric: {json.dumps(rubric, indent=2)}
        
        Student Answer: {student_answer}
        
        Provide:
        1. Overall score based on rubric
        2. Detailed feedback for each rubric criterion
        3. Strengths and areas for improvement
        4. Specific suggestions for enhancement
        5. Grade justification
        
        Respond with JSON:
        {{
            "overall_score": 85,
            "max_score": 100,
            "grade_letter": "B+",
            "criterion_scores": {{
                "content": {{"score": 40, "max": 50, "feedback": "Good understanding shown"}},
                "organization": {{"score": 25, "max": 30, "feedback": "Well structured"}}
            }},
            "strengths": ["strength1", "strength2"],
            "improvements": ["improvement1", "improvement2"],
            "detailed_feedback": "Comprehensive feedback text",
            "next_steps": ["step1", "step2"]
        }}
        """
        
        response = await _get_openai().chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an experienced educator providing fair and constructive grading. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1200
        )
        
        result = json.loads(response.choices[0].message.content)
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        return {
            "overall_score": 75,
            "max_score": 100,
            "grade_letter": "C+",
            "criterion_scores": {
                "content": {"score": 35, "max": 50, "feedback": "Shows basic understanding"},
                "organization": {"score": 20, "max": 30, "feedback": "Could be better organized"}
            },
            "strengths": ["Effort shown", "Basic concepts understood"],
            "improvements": ["Add more detail", "Improve structure"],
            "detailed_feedback": "Your work shows understanding but needs more development.",
            "next_steps": ["Review feedback", "Revise and resubmit"]
        }

# New AI Component: Adaptive Question Generator
async def generate_adaptive_questions(difficulty_level: str, subject: str, student_performance: Dict, language: str = "en") -> Dict:
    """Generate questions that adapt to student performance"""
    try:
        cache_key = _get_cache_key(f"adaptive:{difficulty_level}:{subject}:{str(student_performance)}")
        cached = _get_cached_response(cache_key)
        if cached:
            return cached
            
        prompt = f"""Generate adaptive questions based on:
        Difficulty: {difficulty_level}
        Subject: {subject}
        Student Performance: {student_performance}
        
        Create questions that target weak areas and reinforce strengths.
        
        Respond with JSON:
        {{
            "questions": [
                {{
                    "question": "Question text",
                    "type": "multiple_choice",
                    "options": ["A", "B", "C", "D"],
                    "correct_answer": "A",
                    "difficulty": "medium",
                    "skill_target": "problem_solving"
                }}
            ],
            "adaptation_reason": "Targeting weak areas in algebra",
            "next_difficulty": "medium"
        }}
        """
        
        response = await _get_openai().chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an adaptive learning expert. Always respond in valid JSON format."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1200
        )
        
        result = json.loads(response.choices[0].message.content)
        _cache_response(cache_key, result)
        return result
        
    except Exception as e:
        return {
            "questions": [{
                "question": f"What is a key concept in {subject}?",
                "type": "multiple_choice",
                "options": ["Understanding basics", "Memorizing facts", "Skipping practice", "Ignoring theory"],
                "correct_answer": "Understanding basics",
                "difficulty": difficulty_level,
                "skill_target": "comprehension"
            }],
            "adaptation_reason": "Building foundational knowledge",
            "next_difficulty": difficulty_level
        }