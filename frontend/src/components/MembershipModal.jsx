import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Zap, Crown, Users, ArrowRight } from 'lucide-react';

const MembershipModal = ({ isOpen, onClose, onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState('free');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      tokens: '100',
      icon: Zap,
      color: 'gray',
      features: [
        'Basic AI Quiz Creator',
        'Community Forum Access',
        'Email Support',
        'Mobile App Access'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 10,
      tokens: '1,000',
      icon: Zap,
      color: 'blue',
      popular: false,
      features: [
        'AI Quiz Creator',
        'Basic Analytics Dashboard',
        'Community Forum Access',
        'Email Support',
        'Mobile App Access',
        'Basic Templates'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 25,
      tokens: '3,000',
      icon: Crown,
      color: 'purple',
      popular: true,
      features: [
        'Everything in Basic',
        'Parent Letter Generator',
        'Advanced Analytics',
        'Real-time Chat Support',
        'Assessment Center',
        'Custom Templates'
      ]
    }
  ];

  const handleContinue = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    onSelectPlan(plan);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Choose Your Plan</h2>
              <p className="text-gray-600 mt-2">Select the perfect plan to get started with LehrKI</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ scale: 1.02 }}
                className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${plan.popular ? 'ring-2 ring-purple-200' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                    plan.color === 'gray' ? 'bg-gray-100' :
                    plan.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    <plan.icon className={`w-6 h-6 ${
                      plan.color === 'gray' ? 'text-gray-600' :
                      plan.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                    }`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{plan.tokens} AI tokens/month</p>
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {selectedPlan === plan.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Skip for now
            </button>
            
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MembershipModal;