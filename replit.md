# LehrKI.ch - AI-Powered Educational Platform

## Overview

LehrKI.ch is a multilingual SaaS educational platform that provides AI-powered tools for teachers, students, and administrators. The platform features a subscription-based token system with role-based access control, offering services like parent letter generation, quiz creation, and AI chatbot assistance across four languages (English, German, French, Italian).

The system is built as a Flask-based web application with integrated payment processing, user management, and AI service integration, designed to scale and support educational institutions with intelligent automation tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Template Engine**: Jinja2 templates with Bootstrap 5 for responsive UI
- **Styling**: Bootstrap CSS framework with custom CSS for brand consistency
- **JavaScript**: Vanilla JavaScript with Bootstrap components for interactive features
- **Internationalization**: Flask-Babel for multi-language support with session-based language selection
- **Accessibility**: WCAG-compliant design patterns with proper semantic HTML

### Backend Architecture
- **Web Framework**: Flask with SQLAlchemy ORM for database operations
- **Database**: SQLAlchemy with declarative base, designed for PostgreSQL but adaptable
- **Authentication**: Replit Auth integration with OAuth2 flow and session management
- **Authorization**: Role-based access control (Admin, Teacher, Student) with premium subscription checks
- **API Layer**: RESTful endpoints with JSON responses for AJAX operations
- **Business Logic**: Service layer pattern separating AI operations, payment processing, and user management

### Data Storage Design
- **User Management**: Comprehensive user profiles with role-based permissions and subscription tracking
- **Content Management**: Parent letters, quizzes, and quiz attempts with full audit trails
- **Token System**: Transaction-based token accounting with balance calculations
- **Subscription Management**: Stripe-integrated subscription tracking with status management
- **Internationalization**: Language preferences stored per user with fallback mechanisms

### AI Integration Architecture
- **Modular AI Services**: Pluggable provider interface supporting OpenAI GPT-5 with extensibility for other providers
- **Service Abstraction**: Separated AI operations (letter generation, quiz creation, chatbot) with consistent error handling
- **Token Management**: AI service calls integrated with token deduction system
- **Multi-language Support**: AI prompts and responses localized for four supported languages

### Authentication & Authorization
- **OAuth Integration**: Replit Auth with secure token storage and session management
- **Permission System**: Hierarchical role system with premium feature gating
- **Session Management**: Flask sessions with permanent storage and security middleware
- **Premium Access Control**: Subscription-based feature access with real-time verification

## External Dependencies

### Payment Processing
- **Stripe Integration**: Checkout sessions, customer portal, and webhook handling for subscription management
- **Subscription Plans**: Tiered pricing (Basic, Premium, Enterprise) with monthly token allocations
- **Billing Management**: Automated subscription lifecycle with status tracking and portal access

### AI Services
- **OpenAI API**: GPT-5 model for content generation with JSON-structured responses
- **Service Reliability**: Error handling and fallback mechanisms for AI service interruptions
- **Cost Management**: Token-based usage tracking with service call optimization

### Infrastructure Services
- **Database**: PostgreSQL-compatible database with connection pooling and health checks
- **Session Storage**: Flask-based session management with secure cookie handling
- **Environment Configuration**: Environment variable-based configuration for security and deployment flexibility

### Development & Deployment
- **Replit Platform**: Integrated development and hosting environment with domain management
- **Security Middleware**: ProxyFix for secure header handling in production environments
- **Logging**: Structured logging with configurable levels for monitoring and debugging

### Third-party Libraries
- **Flask Ecosystem**: SQLAlchemy, Flask-Babel, Flask-Login for core functionality
- **Frontend Libraries**: Bootstrap 5, Font Awesome for UI components and icons
- **Authentication**: Flask-Dance for OAuth2 integration with Replit Auth
- **Payment**: Stripe Python SDK for payment processing and webhook management