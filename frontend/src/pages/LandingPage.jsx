import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Users, 
  MessageCircle, 
  BarChart3, 
  CheckCircle, 
  Star,
  ArrowRight,
  PlayCircle,
  Shield,
  Globe,
  Zap
} from 'lucide-react';

const LandingPage = () => {
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
      price: "$10",
      tokens: "1,000",
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
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
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  <PlayCircle className="mr-2 w-5 h-5" />
                  Watch Demo
                </motion.button>
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
      <section className="py-20 bg-white">
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
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 bg-white">
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
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular 
                    ? 'bg-primary-600 text-white hover:bg-primary-700' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
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
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of educators who are already using LehrKI to create 
              more engaging and effective learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Start Your Free Trial
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Contact Sales
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;