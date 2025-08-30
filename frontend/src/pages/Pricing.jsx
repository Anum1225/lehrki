import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Zap, 
  Users, 
  Crown, 
  Star,
  ArrowRight,
  Shield,
  Sparkles,
  Clock,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Pricing = () => {
  const { isAuthenticated } = useAuth();
  const [billingInterval, setBillingInterval] = useState('monthly');

  const plans = [
    {
      name: "Basic",
      description: "Perfect for individual teachers getting started",
      price: billingInterval === 'monthly' ? 10 : 100,
      originalPrice: billingInterval === 'monthly' ? null : 120,
      tokens: "1,000",
      icon: Zap,
      color: "blue",
      features: [
        "AI Quiz Creator",
        "Basic Analytics Dashboard", 
        "Community Forum Access",
        "Email Support",
        "Mobile App Access",
        "Basic Templates"
      ],
      limitations: [
        "Limited to 1,000 AI tokens/month",
        "Basic analytics only",
        "Email support only"
      ]
    },
    {
      name: "Premium",
      description: "Ideal for active educators and small teams",
      price: billingInterval === 'monthly' ? 25 : 250,
      originalPrice: billingInterval === 'monthly' ? null : 300,
      tokens: "3,000",
      icon: Crown,
      color: "purple",
      popular: true,
      features: [
        "Everything in Basic",
        "Parent Letter Generator",
        "Advanced Analytics & Insights",
        "Real-time Chat Support",
        "Assessment Center",
        "Custom Quiz Templates",
        "Multi-language Support",
        "Export & Share Features",
        "Priority Support"
      ],
      limitations: [
        "Limited to 3,000 AI tokens/month"
      ]
    },
    {
      name: "Enterprise",
      description: "For schools and educational institutions",
      price: billingInterval === 'monthly' ? 50 : 500,
      originalPrice: billingInterval === 'monthly' ? null : 600,
      tokens: "10,000",
      icon: Users,
      color: "green",
      features: [
        "Everything in Premium",
        "Unlimited AI Tokens",
        "Custom AI Model Training",
        "Advanced Admin Panel",
        "Multi-school Management",
        "Custom Integrations",
        "White-label Options",
        "Dedicated Account Manager",
        "24/7 Phone Support",
        "Custom Analytics Reports",
        "API Access",
        "Single Sign-On (SSO)"
      ],
      limitations: []
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC 2 compliant with advanced encryption and data protection"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Innovation",
      description: "Cutting-edge AI technology that adapts to your teaching style"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance when you need it most"
    },
    {
      icon: MessageCircle,
      title: "Community Access",
      description: "Connect with 10,000+ educators worldwide"
    }
  ];

  const faqs = [
    {
      question: "What are AI tokens and how do they work?",
      answer: "AI tokens are used for AI-powered features like quiz generation and parent letters. Each interaction consumes tokens based on complexity. You can always upgrade or purchase additional tokens if needed."
    },
    {
      question: "Can I switch between plans anytime?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial of our Premium plan with no credit card required. Experience all features before committing."
    },
    {
      question: "Do you offer discounts for schools?",
      answer: "Absolutely! We provide special pricing for educational institutions. Contact our sales team for custom quotes and volume discounts."
    },
    {
      question: "What languages are supported?",
      answer: "LehrKI supports German, French, Italian, and English with full AI functionality in all languages."
    }
  ];

  const getColorClasses = (color, variant = 'bg') => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        bgLight: 'bg-blue-100',
        text: 'text-blue-600',
        border: 'border-blue-500',
        hover: 'hover:bg-blue-600'
      },
      purple: {
        bg: 'bg-purple-500',
        bgLight: 'bg-purple-100', 
        text: 'text-purple-600',
        border: 'border-purple-500',
        hover: 'hover:bg-purple-600'
      },
      green: {
        bg: 'bg-green-500',
        bgLight: 'bg-green-100',
        text: 'text-green-600', 
        border: 'border-green-500',
        hover: 'hover:bg-green-600'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pricing</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your educational needs. All plans include our core AI features with different usage limits and advanced capabilities.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingInterval === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => {
            const colorClasses = getColorClasses(plan.color);
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl border-2 p-8 ${
                  plan.popular 
                    ? 'border-purple-500 scale-105 ring-4 ring-purple-100' 
                    : 'border-gray-100 hover:border-gray-200'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 ${colorClasses.bgLight} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className={`w-8 h-8 ${colorClasses.text}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500 ml-2">/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-gray-500 mt-1">
                        <span className="line-through">${plan.originalPrice}/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
                        <span className="text-green-600 ml-2 font-semibold">Save ${plan.originalPrice - plan.price}</span>
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-2">{plan.tokens} AI tokens included</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg' 
                    : `${colorClasses.bg} text-white ${colorClasses.hover} shadow-md`
                }`}>
                  {isAuthenticated ? 'Upgrade Now' : 'Get Started'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>

                {plan.limitations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {plan.limitations.join(' • ')}
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose LehrKI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Teaching?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators who are already using LehrKI to create more engaging and effective learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Start 14-Day Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;