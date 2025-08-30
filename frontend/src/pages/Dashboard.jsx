import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Brain, 
  Users, 
  BarChart3, 
  MessageCircle,
  TrendingUp,
  Clock,
  Award,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Create Quiz',
      description: 'Build interactive quizzes with AI assistance',
      icon: BookOpen,
      href: '/quiz-creator',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Assessment Center',
      description: 'Analyze student performance and provide feedback',
      icon: Brain,
      href: '/assessment',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other educators worldwide',
      icon: Users,
      href: '/community',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Analytics',
      description: 'View detailed insights and progress reports',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivity = [
    {
      type: 'quiz',
      title: 'Math Quiz - Algebra Basics',
      action: 'created',
      time: '2 hours ago',
      icon: BookOpen
    },
    {
      type: 'assessment',
      title: 'Science Assessment',
      action: 'completed',
      time: '5 hours ago',
      icon: Brain
    },
    {
      type: 'forum',
      title: 'Teaching Strategies Discussion',
      action: 'participated in',
      time: '1 day ago',
      icon: MessageCircle
    }
  ];

  const stats = [
    {
      name: 'Quizzes Created',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: BookOpen
    },
    {
      name: 'Students Assessed',
      value: '156',
      change: '+18%',
      changeType: 'increase',
      icon: Users
    },
    {
      name: 'Average Score',
      value: '87%',
      change: '+5%',
      changeType: 'increase',
      icon: Award
    },
    {
      name: 'Time Saved',
      value: '32h',
      change: '+22%',
      changeType: 'increase',
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.first_name || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your educational tools today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <div className="flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.title} to={action.href}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                    Get started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity and Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Link to="/activity" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <activity.icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span> {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Assistant Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-r from-primary-500 to-purple-600 p-6 rounded-xl text-white"
          >
            <div className="flex items-center mb-4">
              <Brain className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-semibold">AI Assistant Tips</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <p className="text-sm mb-2">💡 Pro Tip</p>
                <p className="text-sm">
                  Try using specific keywords when creating quizzes. The AI performs better with detailed topics like "photosynthesis in plants" rather than just "biology".
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <p className="text-sm mb-2">🎯 Feature Highlight</p>
                <p className="text-sm">
                  Use the Assessment Center to get automated feedback on student answers. It can identify common mistakes and suggest personalized improvements.
                </p>
              </div>
            </div>
            <button className="mt-4 bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-4 h-4 inline mr-2" />
              Chat with AI
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;