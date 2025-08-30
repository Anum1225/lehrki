import json
import os
from openai import OpenAI
from flask_babel import gettext as _

# the newest OpenAI model is "gpt-5" which was released August 7, 2025.
# do not change this unless explicitly requested by the user
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "default_key")
openai = OpenAI(api_key=OPENAI_API_KEY)

def generate_parent_letter(student_context, tone, language):
    """Generate a parent letter using OpenAI"""
    try:
        language_names = {
            'en': 'English',
            'de': 'German',
            'fr': 'French',
            'it': 'Italian'
        }
        
        prompt = f"""Generate a professional parent letter in {language_names.get(language, 'English')}. 
        
        Tone: {tone}
        Student context: {student_context}
        
        The letter should be formal, respectful, and provide constructive feedback or information about the student.
        Structure it as a proper business letter with appropriate greeting and closing.
        
        Respond with JSON in this format:
        {{
            "title": "Brief title for the letter",
            "content": "Full letter content"
        }}
        """
        
        response = openai.chat.completions.create(
            model="gpt-5",
            messages=[
                {
                    "role": "system",
                    "content": "You are an experienced teacher writing professional letters to parents. Always respond in valid JSON format."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1000
        )
        
        result = json.loads(response.choices[0].message.content)
        return {
            "title": result.get("title", "Parent Letter"),
            "content": result.get("content", "Letter content could not be generated.")
        }
        
    except Exception as e:
        raise Exception(f"Failed to generate parent letter: {e}")

def generate_quiz_questions(topic, level, language, num_questions=5):
    """Generate quiz questions using OpenAI"""
    try:
        language_names = {
            'en': 'English',
            'de': 'German', 
            'fr': 'French',
            'it': 'Italian'
        }
        
        prompt = f"""Create {num_questions} educational quiz questions on the topic "{topic}" 
        for {level} level students in {language_names.get(language, 'English')}.
        
        Include a mix of multiple choice, true/false, and short answer questions.
        
        Respond with JSON in this format:
        {{
            "questions": [
                {{
                    "question_text": "Question text",
                    "question_type": "multiple_choice|true_false|short_answer",
                    "correct_answer": "Correct answer",
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"] // only for multiple_choice
                }}
            ]
        }}
        """
        
        response = openai.chat.completions.create(
            model="gpt-5",
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational content creator. Create engaging and accurate quiz questions. Always respond in valid JSON format."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1500
        )
        
        result = json.loads(response.choices[0].message.content)
        return result.get("questions", [])
        
    except Exception as e:
        raise Exception(f"Failed to generate quiz questions: {e}")

def generate_chatbot_response(message, user_role, language):
    """Generate chatbot response based on user role and language"""
    try:
        language_names = {
            'en': 'English',
            'de': 'German',
            'fr': 'French', 
            'it': 'Italian'
        }
        
        role_context = {
            'student': 'You are helping a student with their learning. Be encouraging and educational.',
            'teacher': 'You are assisting a teacher with educational tools and classroom management.',
            'admin': 'You are helping an administrator with platform management and user support.'
        }
        
        system_prompt = f"""You are LehrKI, an AI assistant for an educational platform. 
        {role_context.get(user_role, 'You are helping a user with educational content.')}
        
        Always respond in {language_names.get(language, 'English')}.
        Be helpful, professional, and educational in your responses.
        If asked about technical issues, direct users to contact support.
        """
        
        response = openai.chat.completions.create(
            model="gpt-5",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message}
            ],
            max_tokens=500
        )
        
        return response.choices[0].message.content
        
    except Exception as e:
        return _("I'm sorry, I'm currently unavailable. Please try again later.")

def assess_quiz_answers(quiz_questions, user_answers, language):
    """Provide assessment feedback for quiz answers"""
    try:
        language_names = {
            'en': 'English',
            'de': 'German',
            'fr': 'French',
            'it': 'Italian'
        }
        
        assessment_data = {
            "questions": quiz_questions,
            "answers": user_answers
        }
        
        prompt = f"""Assess the following quiz answers and provide constructive feedback in {language_names.get(language, 'English')}.
        
        Quiz data: {json.dumps(assessment_data)}
        
        For each question, determine if the answer is correct and provide brief feedback.
        Calculate an overall score as a percentage.
        
        Respond with JSON in this format:
        {{
            "score": 85.5,
            "feedback": [
                {{
                    "question_index": 0,
                    "is_correct": true,
                    "feedback": "Excellent! Your answer is correct."
                }}
            ],
            "overall_feedback": "Overall assessment summary"
        }}
        """
        
        response = openai.chat.completions.create(
            model="gpt-5",
            messages=[
                {
                    "role": "system",
                    "content": "You are an educational assessment expert. Provide fair and constructive feedback. Always respond in valid JSON format."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            max_tokens=1000
        )
        
        result = json.loads(response.choices[0].message.content)
        return result
        
    except Exception as e:
        raise Exception(f"Failed to assess quiz answers: {e}")
