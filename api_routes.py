from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from models import User, UserRole, ParentLetter, Quiz, QuizQuestion, QuizAttempt, TokenTransaction
from ai_services import generate_parent_letter, generate_quiz_questions, generate_chatbot_response
import json

# Create API Blueprint
api = Blueprint('api', __name__, url_prefix='/api')

# Authentication endpoints
@api.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate input
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 400
        
        # Create new user
        user = User(
            id=data['email'],  # Using email as ID for simplicity
            email=data['email'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            role=UserRole[data.get('role', 'STUDENT').upper()]
        )
        
        # Set password (you'd typically hash this)
        user.password_hash = generate_password_hash(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role.value
            }
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@api.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role.value
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@api.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role.value,
                'token_balance': user.get_token_balance()
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Quiz endpoints
@api.route('/quizzes', methods=['GET'])
@jwt_required()
def get_quizzes():
    try:
        user_id = get_jwt_identity()
        quizzes = Quiz.query.filter_by(user_id=user_id).all()
        
        quiz_list = []
        for quiz in quizzes:
            quiz_list.append({
                'id': quiz.id,
                'title': quiz.title,
                'description': quiz.description,
                'topic': quiz.topic,
                'level': quiz.level,
                'language': quiz.language,
                'created_at': quiz.created_at.isoformat(),
                'question_count': len(quiz.questions)
            })
        
        return jsonify({'quizzes': quiz_list}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@api.route('/quizzes', methods=['POST'])
@jwt_required()
def create_quiz():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Create quiz
        quiz = Quiz(
            user_id=user_id,
            title=data['title'],
            description=data.get('description', ''),
            topic=data['topic'],
            level=data['level'],
            language=data.get('language', 'en')
        )
        
        db.session.add(quiz)
        db.session.flush()  # Get the quiz ID
        
        # Add questions
        for q_data in data.get('questions', []):
            question = QuizQuestion(
                quiz_id=quiz.id,
                question_text=q_data['question_text'],
                question_type=q_data['question_type'],
                correct_answer=q_data['correct_answer'],
                options=q_data.get('options')
            )
            db.session.add(question)
        
        db.session.commit()
        
        return jsonify({
            'quiz': {
                'id': quiz.id,
                'title': quiz.title,
                'description': quiz.description
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

@api.route('/quizzes/generate', methods=['POST'])
@jwt_required()
def generate_quiz():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Generate questions using AI
        questions = generate_quiz_questions(
            topic=data['topic'],
            level=data['level'],
            language=data.get('language', 'en'),
            num_questions=data.get('num_questions', 5)
        )
        
        return jsonify({'questions': questions}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Parent Letter endpoints
@api.route('/parent-letters', methods=['POST'])
@jwt_required()
def create_parent_letter():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Generate letter using AI
        letter_data = generate_parent_letter(
            student_context=data['student_context'],
            tone=data['tone'],
            language=data.get('language', 'en')
        )
        
        # Save to database
        letter = ParentLetter(
            user_id=user_id,
            title=letter_data['title'],
            content=letter_data['content'],
            language=data.get('language', 'en'),
            tone=data['tone'],
            student_context=data['student_context']
        )
        
        db.session.add(letter)
        db.session.commit()
        
        return jsonify({
            'letter': {
                'id': letter.id,
                'title': letter.title,
                'content': letter.content,
                'created_at': letter.created_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

# Chatbot endpoint
@api.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        response = generate_chatbot_response(
            message=data['message'],
            language=data.get('language', 'en'),
            user_context=data.get('context', {})
        )
        
        return jsonify({
            'response': response['response']
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Dashboard stats endpoint
@api.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        # Get user's quizzes
        quiz_count = Quiz.query.filter_by(user_id=user_id).count()
        
        # Get recent activities
        recent_quizzes = Quiz.query.filter_by(user_id=user_id).order_by(Quiz.created_at.desc()).limit(5).all()
        recent_letters = ParentLetter.query.filter_by(user_id=user_id).order_by(ParentLetter.created_at.desc()).limit(5).all()
        
        stats = {
            'user': {
                'name': user.first_name,
                'role': user.role.value,
                'token_balance': user.get_token_balance()
            },
            'quiz_count': quiz_count,
            'recent_quizzes': [
                {
                    'id': q.id,
                    'title': q.title,
                    'topic': q.topic,
                    'created_at': q.created_at.isoformat()
                } for q in recent_quizzes
            ],
            'recent_letters': [
                {
                    'id': l.id,
                    'title': l.title,
                    'created_at': l.created_at.isoformat()
                } for l in recent_letters
            ]
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Analytics endpoints
@api.route('/analytics/overview', methods=['GET'])
@jwt_required()
def get_analytics_overview():
    try:
        user_id = get_jwt_identity()
        
        # Mock analytics data for now
        analytics = {
            'total_students': 234,
            'quizzes_created': 45,
            'average_score': 84.2,
            'study_time': '2.4h',
            'subject_performance': [
                {'subject': 'Mathematics', 'avgScore': 87, 'students': 45, 'improvement': '+5%'},
                {'subject': 'Science', 'avgScore': 82, 'students': 38, 'improvement': '+3%'},
                {'subject': 'English', 'avgScore': 89, 'students': 52, 'improvement': '+7%'}
            ],
            'top_performers': [
                {'name': 'Alice Johnson', 'score': 96, 'quizzes': 12, 'rank': 1},
                {'name': 'Bob Smith', 'score': 94, 'quizzes': 15, 'rank': 2}
            ]
        }
        
        return jsonify(analytics), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Error handlers
@api.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@api.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500