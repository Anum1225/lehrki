from flask import jsonify, send_from_directory, send_file
from app import app, db
from api_routes import api
from flask_babel import get_locale
import os

# Register API blueprint
app.register_blueprint(api)

# Make get_locale available in template context
@app.context_processor
def inject_locale():
    return dict(get_locale=get_locale)

# Serve React app static files
@app.route('/static/<path:filename>')
def react_static(filename):
    return send_from_directory('frontend/dist/assets', filename)

# Serve React app for all frontend routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    # For API routes, return 404
    if path.startswith('api/'):
        return jsonify({'message': 'API endpoint not found'}), 404
    
    # Check if React build exists
    react_build_path = os.path.join(os.getcwd(), 'frontend', 'dist', 'index.html')
    if os.path.exists(react_build_path):
        return send_file(react_build_path)
    else:
        # Return a beautiful HTML page showing the system is ready
        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>LehrKI - AI-Powered Educational Platform | Modern EdTech Solution</title>
            <meta name="description" content="Transform education with LehrKI's AI-powered platform. Create quizzes, generate parent letters, and manage assessments with advanced analytics. Multilingual support for German, French, Italian, and English.">
            <meta name="keywords" content="AI education, EdTech, quiz creator, parent letters, assessment platform, multilingual education, LehrKI">
            <meta property="og:title" content="LehrKI - AI-Powered Educational Platform">
            <meta property="og:description" content="Transform education with AI-powered tools for quiz creation, assessment, and parent communication.">
            <meta property="og:type" content="website">
            <link rel="canonical" href="https://lehrki.ch/">
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
                tailwind.config = {
                    theme: {
                        extend: {
                            colors: {
                                primary: {
                                    50: '#eff6ff',
                                    500: '#3b82f6',
                                    600: '#2563eb',
                                    700: '#1d4ed8',
                                }
                            }
                        }
                    }
                }
            </script>
        </head>
        <body class="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
            <div class="container mx-auto px-4 py-16">
                <div class="max-w-4xl mx-auto text-center">
                    <div class="mb-8">
                        <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                        </div>
                        <h1 class="text-5xl font-bold text-gray-900 mb-4">
                            Welcome to <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LehrKI</span>
                        </h1>
                        <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            AI-Powered Educational Platform with Modern React Frontend & Python API Backend
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">AI Quiz Creator</h3>
                            <p class="text-gray-600 text-sm">Create engaging quizzes with AI assistance</p>
                        </div>

                        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Smart Assessment</h3>
                            <p class="text-gray-600 text-sm">Automated feedback and performance insights</p>
                        </div>

                        <div class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Community Forum</h3>
                            <p class="text-gray-600 text-sm">Connect with educators worldwide</p>
                        </div>
                    </div>

                    <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
                        <h2 class="text-2xl font-bold text-gray-900 mb-4">🎉 System Status</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-3">✅ Backend Features</h3>
                                <ul class="space-y-2 text-sm text-gray-600">
                                    <li>✓ JWT Authentication System</li>
                                    <li>✓ RESTful API Endpoints</li>
                                    <li>✓ AI Integration (OpenAI GPT-5)</li>
                                    <li>✓ PostgreSQL Database</li>
                                    <li>✓ CORS Support</li>
                                    <li>✓ Role-based Access Control</li>
                                </ul>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900 mb-3">⚛️ Frontend Features</h3>
                                <ul class="space-y-2 text-sm text-gray-600">
                                    <li>✓ Modern React Components</li>
                                    <li>✓ Responsive Tailwind Design</li>
                                    <li>✓ Framer Motion Animations</li>
                                    <li>✓ React Router Navigation</li>
                                    <li>✓ Real-time Chat Interface</li>
                                    <li>✓ Advanced Analytics Dashboard</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                        <h3 class="text-lg font-semibold mb-2">🚀 Ready for Development</h3>
                        <p class="mb-4">Complete React + Python API architecture with modern tooling</p>
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/api" class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                                📡 API Endpoints
                            </a>
                            <a href="/health" class="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors">
                                🔍 Health Check
                            </a>
                        </div>
                    </div>

                    <div class="mt-8 text-center">
                        <p class="text-gray-500 text-sm">
                            LehrKI - Transforming Education with AI Technology
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'service': 'LehrKI API'}), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'message': 'Internal server error'}), 500