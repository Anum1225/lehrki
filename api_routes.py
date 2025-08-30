from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from models import User, UserRole, ParentLetter, Quiz, QuizQuestion, QuizAttempt, TokenTransaction, Subscription, SubscriptionStatus
from ai_services import generate_parent_letter, generate_quiz_questions, generate_chatbot_response
import json
import os
import stripe

# Create API Blueprint
api = Blueprint('api', __name__, url_prefix='/api')

# Configure Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

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
        user = User()
        user.id = data['email']  # Using email as ID for simplicity
        user.email = data['email']
        user.first_name = data.get('first_name', '')
        user.last_name = data.get('last_name', '')
        user.role = UserRole[data.get('role', 'STUDENT').upper()]
        
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
        quiz = Quiz()
        quiz.user_id = user_id
        quiz.title = data['title']
        quiz.description = data.get('description', '')
        quiz.topic = data['topic']
        quiz.level = data['level']
        quiz.language = data.get('language', 'en')
        
        db.session.add(quiz)
        db.session.flush()  # Get the quiz ID
        
        # Add questions
        for q_data in data.get('questions', []):
            question = QuizQuestion()
            question.quiz_id = quiz.id
            question.question_text = q_data['question_text']
            question.question_type = q_data['question_type']
            question.correct_answer = q_data['correct_answer']
            question.options = q_data.get('options')
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
        
        # Check if user has enough tokens
        user = User.query.get(user_id)
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        token_balance = user.get_token_balance()
        if token_balance < 1:
            return jsonify({'message': 'Insufficient tokens'}), 400
        
        # Generate letter using AI
        letter_data = generate_parent_letter(
            student_context=data['student_context'],
            content_type=data.get('content_type', 'progress_report'),
            tone=data.get('tone', 'professional'),
            language=data.get('language', 'en')
        )
        
        # Save to database
        letter = ParentLetter()
        letter.user_id = user_id
        letter.title = letter_data['title']
        letter.content = letter_data['content']
        letter.language = data.get('language', 'en')
        letter.tone = data.get('tone', 'professional')
        letter.student_context = json.dumps(data['student_context'])
        letter.tokens_used = 1
        
        db.session.add(letter)
        
        # Deduct token
        token_transaction = TokenTransaction()
        token_transaction.user_id = user_id
        token_transaction.amount = -1
        token_transaction.description = f"Parent letter: {letter_data['title'][:50]}"
        token_transaction.reference_type = 'parent_letter'
        
        db.session.add(token_transaction)
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

@api.route('/parent-letters', methods=['GET'])
@jwt_required()
def get_parent_letters():
    try:
        user_id = get_jwt_identity()
        letters = ParentLetter.query.filter_by(user_id=user_id).order_by(ParentLetter.created_at.desc()).all()
        
        letter_list = []
        for letter in letters:
            letter_list.append({
                'id': letter.id,
                'title': letter.title,
                'content': letter.content[:200] + '...' if len(letter.content) > 200 else letter.content,
                'language': letter.language,
                'tone': letter.tone,
                'created_at': letter.created_at.isoformat()
            })
        
        return jsonify({'letters': letter_list}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Chatbot endpoint
@api.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        user = User.query.get(user_id)
        response = generate_chatbot_response(
            message=data['message'],
            language=data.get('language', 'en'),
            user_role=user.role.value if user else 'student'
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
                'name': user.first_name if user else 'Unknown',
                'role': user.role.value if user else 'student',
                'token_balance': user.get_token_balance() if user else 0
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

# Token management endpoints
@api.route('/tokens/balance', methods=['GET'])
@jwt_required()
def get_token_balance():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        balance = user.get_token_balance()
        subscription = user.subscription
        
        return jsonify({
            'balance': balance,
            'subscription': {
                'plan': subscription.plan_name if subscription else 'free',
                'monthly_limit': subscription.monthly_token_limit if subscription else 0,
                'status': subscription.status.value if subscription else 'inactive'
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@api.route('/tokens/history', methods=['GET'])
@jwt_required()
def get_token_history():
    try:
        user_id = get_jwt_identity()
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        transactions = TokenTransaction.query.filter_by(user_id=user_id)\
            .order_by(TokenTransaction.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        transaction_list = []
        for transaction in transactions.items:
            transaction_list.append({
                'id': transaction.id,
                'amount': transaction.amount,
                'description': transaction.description,
                'reference_type': transaction.reference_type,
                'created_at': transaction.created_at.isoformat()
            })
        
        return jsonify({
            'transactions': transaction_list,
            'pagination': {
                'page': transactions.page,
                'pages': transactions.pages,
                'per_page': transactions.per_page,
                'total': transactions.total
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Stripe subscription endpoints
@api.route('/subscriptions/create-checkout', methods=['POST'])
@jwt_required()
def create_checkout_session():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        plan_type = data.get('plan_type', 'basic')
        
        # Define price IDs for different plans
        price_mapping = {
            'basic': 'price_basic_monthly',    # Replace with actual Stripe price IDs
            'premium': 'price_premium_monthly',
            'enterprise': 'price_enterprise_monthly'
        }
        
        if plan_type not in price_mapping:
            return jsonify({'message': 'Invalid plan type'}), 400
        
        # Create or get Stripe customer
        if not user.subscription or not user.subscription.stripe_customer_id:
            customer = stripe.Customer.create(
                email=user.email,
                name=f"{user.first_name} {user.last_name}"
            )
            customer_id = customer.id
        else:
            customer_id = user.subscription.stripe_customer_id
        
        # Create checkout session
        domain = os.environ.get('REPLIT_DEV_DOMAIN', 'localhost:3000')
        if os.environ.get('REPLIT_DEPLOYMENT'):
            domain = os.environ.get('REPLIT_DOMAINS', '').split(',')[0]
        
        checkout_session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=['card'],
            line_items=[{
                'price': price_mapping[plan_type],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'https://{domain}/dashboard?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'https://{domain}/pricing',
            metadata={
                'user_id': user_id,
                'plan_type': plan_type
            }
        )
        
        return jsonify({
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@api.route('/subscriptions/portal', methods=['POST'])
@jwt_required()
def create_customer_portal():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.subscription or not user.subscription.stripe_customer_id:
            return jsonify({'message': 'No active subscription found'}), 404
        
        domain = os.environ.get('REPLIT_DEV_DOMAIN', 'localhost:3000')
        if os.environ.get('REPLIT_DEPLOYMENT'):
            domain = os.environ.get('REPLIT_DOMAINS', '').split(',')[0]
        
        portal_session = stripe.billing_portal.Session.create(
            customer=user.subscription.stripe_customer_id,
            return_url=f'https://{domain}/profile'
        )
        
        return jsonify({
            'portal_url': portal_session.url
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@api.route('/subscriptions/webhook', methods=['POST'])
def stripe_webhook():
    try:
        payload = request.get_data()
        sig_header = request.headers.get('Stripe-Signature')
        endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
        
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
        
        # Handle different event types
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            handle_checkout_completed(session)
        elif event['type'] == 'invoice.payment_succeeded':
            invoice = event['data']['object']
            handle_payment_succeeded(invoice)
        elif event['type'] == 'customer.subscription.updated':
            subscription = event['data']['object']
            handle_subscription_updated(subscription)
        elif event['type'] == 'customer.subscription.deleted':
            subscription = event['data']['object']
            handle_subscription_cancelled(subscription)
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 400

def handle_checkout_completed(session):
    """Handle successful checkout completion"""
    user_id = session['metadata']['user_id']
    plan_type = session['metadata']['plan_type']
    customer_id = session['customer']
    subscription_id = session['subscription']
    
    user = User.query.get(user_id)
    if not user:
        return
    
    # Token limits for different plans
    token_limits = {
        'basic': 1000,
        'premium': 3000,
        'enterprise': 10000
    }
    
    # Create or update subscription
    if not user.subscription:
        subscription = Subscription()
        subscription.user_id = user_id
        db.session.add(subscription)
    else:
        subscription = user.subscription
    
    subscription.stripe_customer_id = customer_id
    subscription.stripe_subscription_id = subscription_id
    subscription.plan_name = plan_type
    subscription.status = SubscriptionStatus.ACTIVE
    subscription.monthly_token_limit = token_limits.get(plan_type, 1000)
    
    # Add monthly tokens
    token_transaction = TokenTransaction()
    token_transaction.user_id = user_id
    token_transaction.amount = token_limits.get(plan_type, 1000)
    token_transaction.description = f"Monthly {plan_type} plan tokens"
    token_transaction.reference_type = 'subscription_renewal'
    
    db.session.add(token_transaction)
    db.session.commit()

def handle_payment_succeeded(invoice):
    """Handle successful subscription payment"""
    subscription_id = invoice['subscription']
    
    # Find user by subscription ID
    subscription = Subscription.query.filter_by(stripe_subscription_id=subscription_id).first()
    if not subscription:
        return
    
    # Add monthly tokens
    token_transaction = TokenTransaction()
    token_transaction.user_id = subscription.user_id
    token_transaction.amount = subscription.monthly_token_limit
    token_transaction.description = f"Monthly {subscription.plan_name} plan tokens"
    token_transaction.reference_type = 'subscription_renewal'
    
    db.session.add(token_transaction)
    db.session.commit()

def handle_subscription_updated(stripe_subscription):
    """Handle subscription updates"""
    subscription = Subscription.query.filter_by(
        stripe_subscription_id=stripe_subscription['id']
    ).first()
    
    if subscription:
        # Update subscription status based on Stripe status
        if stripe_subscription['status'] == 'active':
            subscription.status = SubscriptionStatus.ACTIVE
        elif stripe_subscription['status'] == 'past_due':
            subscription.status = SubscriptionStatus.PAST_DUE
        else:
            subscription.status = SubscriptionStatus.INACTIVE
        
        db.session.commit()

def handle_subscription_cancelled(stripe_subscription):
    """Handle subscription cancellation"""
    subscription = Subscription.query.filter_by(
        stripe_subscription_id=stripe_subscription['id']
    ).first()
    
    if subscription:
        subscription.status = SubscriptionStatus.CANCELLED
        db.session.commit()

# Error handlers
@api.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@api.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500