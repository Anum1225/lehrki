import os
import stripe
from flask import url_for, request
from models import Subscription, SubscriptionStatus, TokenTransaction, db
from datetime import datetime, timedelta

# Configure Stripe
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_default')

# Get domain for redirect URLs
def get_domain():
    if os.environ.get('REPLIT_DEPLOYMENT'):
        return os.environ.get('REPLIT_DEV_DOMAIN')
    else:
        domains = os.environ.get('REPLIT_DOMAINS', 'localhost:5000')
        return domains.split(',')[0]

SUBSCRIPTION_PLANS = {
    'basic': {
        'name': 'Basic Plan',
        'price_id': 'price_basic_monthly',  # Replace with actual Stripe price ID
        'price_cents': 1000,  # $10.00
        'tokens': 1000,
        'description': '1,000 tokens per month'
    },
    'premium': {
        'name': 'Premium Plan', 
        'price_id': 'price_premium_monthly',  # Replace with actual Stripe price ID
        'price_cents': 2500,  # $25.00
        'tokens': 3000,
        'description': '3,000 tokens per month'
    },
    'enterprise': {
        'name': 'Enterprise Plan',
        'price_id': 'price_enterprise_monthly',  # Replace with actual Stripe price ID
        'price_cents': 5000,  # $50.00
        'tokens': 10000,
        'description': '10,000 tokens per month'
    }
}

def create_checkout_session(user, plan_key):
    """Create a Stripe checkout session for subscription"""
    try:
        plan = SUBSCRIPTION_PLANS.get(plan_key)
        if not plan:
            raise ValueError(f"Invalid plan: {plan_key}")
        
        domain = get_domain()
        
        # Create or get Stripe customer
        customer = None
        if user.subscription and user.subscription.stripe_customer_id:
            customer = user.subscription.stripe_customer_id
        else:
            stripe_customer = stripe.Customer.create(
                email=user.email,
                metadata={
                    'user_id': user.id,
                    'first_name': user.first_name or '',
                    'last_name': user.last_name or ''
                }
            )
            customer = stripe_customer.id
        
        checkout_session = stripe.checkout.Session.create(
            customer=customer,
            line_items=[{
                'price': plan['price_id'],
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f'https://{domain}/subscription/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url=f'https://{domain}/subscription/cancel',
            metadata={
                'user_id': user.id,
                'plan_key': plan_key
            }
        )
        
        return checkout_session.url
        
    except Exception as e:
        raise Exception(f"Failed to create checkout session: {e}")

def create_customer_portal_session(user):
    """Create a Stripe customer portal session"""
    try:
        if not user.subscription or not user.subscription.stripe_customer_id:
            raise ValueError("User does not have a Stripe customer ID")
        
        domain = get_domain()
        
        portal_session = stripe.billing_portal.Session.create(
            customer=user.subscription.stripe_customer_id,
            return_url=f'https://{domain}/dashboard'
        )
        
        return portal_session.url
        
    except Exception as e:
        raise Exception(f"Failed to create portal session: {e}")

def handle_webhook(payload, sig_header):
    """Handle Stripe webhooks"""
    try:
        endpoint_secret = os.environ.get('STRIPE_WEBHOOK_SECRET')
        if not endpoint_secret:
            raise ValueError("Stripe webhook secret not configured")
        
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
        
        if event['type'] == 'checkout.session.completed':
            handle_checkout_completed(event['data']['object'])
        elif event['type'] == 'customer.subscription.updated':
            handle_subscription_updated(event['data']['object'])
        elif event['type'] == 'customer.subscription.deleted':
            handle_subscription_deleted(event['data']['object'])
        elif event['type'] == 'invoice.payment_succeeded':
            handle_payment_succeeded(event['data']['object'])
        elif event['type'] == 'invoice.payment_failed':
            handle_payment_failed(event['data']['object'])
        
        return True
        
    except Exception as e:
        print(f"Webhook error: {e}")
        return False

def handle_checkout_completed(session):
    """Handle successful checkout completion"""
    try:
        user_id = session['metadata']['user_id']
        plan_key = session['metadata']['plan_key']
        plan = SUBSCRIPTION_PLANS[plan_key]
        
        # Get the subscription from Stripe
        subscription = stripe.Subscription.retrieve(session['subscription'])
        
        # Update or create user subscription
        user_subscription = Subscription.query.filter_by(user_id=user_id).first()
        if not user_subscription:
            user_subscription = Subscription(user_id=user_id)
            db.session.add(user_subscription)
        
        user_subscription.stripe_subscription_id = subscription['id']
        user_subscription.stripe_customer_id = subscription['customer']
        user_subscription.status = SubscriptionStatus.ACTIVE
        user_subscription.plan_name = plan_key
        user_subscription.monthly_token_limit = plan['tokens']
        user_subscription.price_cents = plan['price_cents']
        user_subscription.expires_at = datetime.fromtimestamp(subscription['current_period_end'])
        
        # Add tokens to user account
        token_transaction = TokenTransaction(
            user_id=user_id,
            amount=plan['tokens'],
            description=f"Monthly tokens for {plan['name']}",
            reference_type='subscription',
            reference_id=user_subscription.id
        )
        db.session.add(token_transaction)
        
        db.session.commit()
        
    except Exception as e:
        print(f"Error handling checkout completion: {e}")
        db.session.rollback()

def handle_subscription_updated(subscription):
    """Handle subscription updates"""
    try:
        user_subscription = Subscription.query.filter_by(
            stripe_subscription_id=subscription['id']
        ).first()
        
        if user_subscription:
            # Update subscription status
            if subscription['status'] == 'active':
                user_subscription.status = SubscriptionStatus.ACTIVE
            elif subscription['status'] == 'canceled':
                user_subscription.status = SubscriptionStatus.CANCELLED
            elif subscription['status'] == 'past_due':
                user_subscription.status = SubscriptionStatus.PAST_DUE
            else:
                user_subscription.status = SubscriptionStatus.INACTIVE
            
            user_subscription.expires_at = datetime.fromtimestamp(subscription['current_period_end'])
            db.session.commit()
        
    except Exception as e:
        print(f"Error handling subscription update: {e}")
        db.session.rollback()

def handle_subscription_deleted(subscription):
    """Handle subscription cancellation"""
    try:
        user_subscription = Subscription.query.filter_by(
            stripe_subscription_id=subscription['id']
        ).first()
        
        if user_subscription:
            user_subscription.status = SubscriptionStatus.CANCELLED
            db.session.commit()
        
    except Exception as e:
        print(f"Error handling subscription deletion: {e}")
        db.session.rollback()

def handle_payment_succeeded(invoice):
    """Handle successful payment - add monthly tokens"""
    try:
        subscription_id = invoice['subscription']
        subscription = stripe.Subscription.retrieve(subscription_id)
        
        user_subscription = Subscription.query.filter_by(
            stripe_subscription_id=subscription_id
        ).first()
        
        if user_subscription and user_subscription.plan_name in SUBSCRIPTION_PLANS:
            plan = SUBSCRIPTION_PLANS[user_subscription.plan_name]
            
            # Add monthly tokens
            token_transaction = TokenTransaction(
                user_id=user_subscription.user_id,
                amount=plan['tokens'],
                description=f"Monthly tokens for {plan['name']}",
                reference_type='subscription',
                reference_id=user_subscription.id
            )
            db.session.add(token_transaction)
            db.session.commit()
        
    except Exception as e:
        print(f"Error handling payment success: {e}")
        db.session.rollback()

def handle_payment_failed(invoice):
    """Handle failed payment"""
    try:
        subscription_id = invoice['subscription']
        
        user_subscription = Subscription.query.filter_by(
            stripe_subscription_id=subscription_id
        ).first()
        
        if user_subscription:
            user_subscription.status = SubscriptionStatus.PAST_DUE
            db.session.commit()
        
    except Exception as e:
        print(f"Error handling payment failure: {e}")
        db.session.rollback()

def deduct_tokens(user, amount, description, reference_type=None, reference_id=None):
    """Deduct tokens from user account"""
    try:
        current_balance = user.get_token_balance()
        
        if current_balance < amount:
            raise ValueError("Insufficient tokens")
        
        token_transaction = TokenTransaction(
            user_id=user.id,
            amount=-amount,  # Negative for deduction
            description=description,
            reference_type=reference_type,
            reference_id=reference_id
        )
        db.session.add(token_transaction)
        db.session.commit()
        
        return True
        
    except Exception as e:
        db.session.rollback()
        raise e
