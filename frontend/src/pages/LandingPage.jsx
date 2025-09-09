import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import ChatBot from '../components/ChatBot';
import {
  BookOpen,
  Brain,
  Users,
  MessageCircle,
  BarChart3,
  CheckCircle,
  Star,
  ArrowRight,
  Shield,
  Globe,
  Zap,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Github
} from 'lucide-react';

const LandingPage = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: BookOpen,
      title: "AI-Powered Quiz Creator",
      description: "Create engaging quizzes instantly with our intelligent quiz builder that adapts to any subject and difficulty level."
    },
    {
      icon: Brain,
      title: "Smart Assessment Tools",
      description: "Get detailed insights and automated feedback on student performance with our advanced AI assessment system."
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Connect with educators worldwide, share resources, and collaborate in our vibrant educational community."
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat Support",
      description: "Instant help and guidance with our AI-powered chatbot and real-time communication tools."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track progress, analyze performance, and gain actionable insights with comprehensive analytics dashboards."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security ensures your data and student information remain protected at all times."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "High School Teacher",
      content: "LehrKI has transformed how I create and manage assessments. The AI quiz generator saves me hours every week!",
      rating: 5
    },
    {
      name: "Dr. Michael Chen",
      role: "University Professor",
      content: "The analytics dashboard provides incredible insights into student learning patterns. It's a game-changer for education.",
      rating: 5
    },
    {
      name: "Emma Rodriguez",
      role: "Elementary Teacher",
      content: "The multilingual support and parent letter generator have made communication with families so much easier.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      tokens: "500",
      features: [
        "AI Quiz Creator",
        "Basic Analytics",
        "Community Access",
        "Email Support"
      ]
    },
    {
      name: "Premium",
      price: "$25",
      tokens: "3,000",
      features: [
        "Everything in Basic",
        "Advanced Analytics",
        "Real-time Chat",
        "Parent Letter Generator",
        "Priority Support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$50",
      tokens: "10,000",
      features: [
        "Everything in Premium",
        "Custom Integrations",
        "Advanced AI Features",
        "Dedicated Support",
        "Multi-school Management"
      ]
    }
  ];

  return (
    <div className="min-h-screen landing-page">
      {/* Enhanced Navigation Header for Landing Page */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Enhanced Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-3 rounded-xl mr-4 shadow-lg">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  LehrKI
                </span>
                <span className="text-xs text-gray-500 font-medium tracking-wide">
                  AI-Powered Education
                </span>
              </div>
            </motion.div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <motion.button 
                onClick={() => scrollToSection('features')} 
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                whileHover={{ y: -1 }}
              >
                {t('features')}
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('testimonials')} 
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                whileHover={{ y: -1 }}
              >
                {t('testimonials')}
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('pricing')} 
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                whileHover={{ y: -1 }}
              >
                {t('pricing')}
              </motion.button>
              <motion.button 
                onClick={() => scrollToSection('contact')} 
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                whileHover={{ y: -1 }}
              >
                {t('contact')}
              </motion.button>
              <motion.a 
                href="/register" 
                className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 ml-4"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('getStarted')}
              </motion.a>
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </motion.div>
              </motion.button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm"
            >
              <div className="flex flex-col space-y-2">
                <motion.button 
                  onClick={() => scrollToSection('features')} 
                  className="text-left text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg font-medium transition-all"
                  whileHover={{ x: 4 }}
                >
                  {t('features')}
                </motion.button>
                <motion.button 
                  onClick={() => scrollToSection('testimonials')} 
                  className="text-left text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg font-medium transition-all"
                  whileHover={{ x: 4 }}
                >
                  {t('testimonials')}
                </motion.button>
                <motion.button 
                  onClick={() => scrollToSection('pricing')} 
                  className="text-left text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg font-medium transition-all"
                  whileHover={{ x: 4 }}
                >
                  {t('pricing')}
                </motion.button>
                <motion.button 
                  onClick={() => scrollToSection('contact')} 
                  className="text-left text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg font-medium transition-all"
                  whileHover={{ x: 4 }}
                >
                  {t('contact')}
                </motion.button>
                <motion.a 
                  href="/register" 
                  className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-center block mt-4 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('getStarted')}
                </motion.a>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-20 bg-gradient-to-br from-pink-50 via-blue-50 to-yellow-50">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/30 to-rose-100/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Transform Education with{' '}
                <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  AI Power
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                LehrKI empowers educators with intelligent tools for quiz creation, assessment,
                and student engagement. Experience the future of education today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-primary-600 to-purple-600 text-white text-lg px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Educators</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">500K+</div>
              <div className="text-gray-600">Quizzes Created</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">Countries Served</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the comprehensive suite of AI-powered tools designed to enhance 
              teaching, learning, and educational management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8 hover:shadow-2xl"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Educators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what teachers and professors are saying about LehrKI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-b from-indigo-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your educational needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card p-8 relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-1">{plan.price}</div>
                  <div className="text-gray-500">per month</div>
                  <div className="text-sm text-gray-500 mt-2">{plan.tokens} AI tokens included</div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a 
                  href="/register"
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 text-center block ${
                  plan.popular 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  Get Started
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Teaching?
            </h2>
            <p className="text-xl text-white mb-8">
              Join thousands of educators who are already using LehrKI to create
              more engaging and effective learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/register"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-gray-900 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-block"
              >
                Start Your Free Trial
              </motion.a>
              <motion.button
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gradient-to-b from-slate-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="bg-primary-600 text-white p-2 rounded-lg mr-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-2xl font-bold">LehrKI</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Empowering educators worldwide with AI-powered tools for creating engaging quizzes, 
                assessments, and educational content. Transform your teaching experience today.
              </p>
              <div className="flex space-x-3">
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Facebook className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Twitter className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Instagram className="w-5 h-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <motion.button 
                    onClick={() => scrollToSection('features')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-left"
                    whileHover={{ x: 4 }}
                  >
                    Features
                  </motion.button>
                </li>
                <li>
                  <motion.button 
                    onClick={() => scrollToSection('pricing')} 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 text-left"
                    whileHover={{ x: 4 }}
                  >
                    Pricing
                  </motion.button>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    whileHover={{ x: 4 }}
                  >
                    Docs
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    whileHover={{ x: 4 }}
                  >
                    API
                  </motion.a>
                </li>
                <li>
                  <motion.a 
                    href="#" 
                    className="text-gray-300 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    whileHover={{ x: 4 }}
                  >
                    Support
                  </motion.a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">hello@lehrki.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-300">San Francisco, CA</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-3">Stay Updated</h4>
                <div className="flex rounded-xl overflow-hidden shadow-lg">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-3 bg-gray-800 border-0 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <motion.button 
                    className="bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 px-6 py-3 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 LehrKI. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ y: -1 }}
              >
                Privacy
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ y: -1 }}
              >
                Terms
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ y: -1 }}
              >
                Cookies
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* ChatBot Widget */}
      <ChatBot />
    </div>
  );
};

export default LandingPage;