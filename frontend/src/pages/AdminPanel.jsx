import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Shield,
  AlertTriangle,
  TrendingUp,
  UserPlus,
  Edit3,
  Trash2,
  Download,
  Eye,
  Mail,
  Crown,
  Ban
} from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const stats = [
    {
      title: 'Total Users',
      value: '12,847',
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Subscriptions',
      value: '8,432',
      change: '+8.2%',
      changeType: 'positive',
      icon: CreditCard,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: '$184,235',
      change: '+15.3%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Support Tickets',
      value: '23',
      change: '-18.7%',
      changeType: 'positive',
      icon: AlertTriangle,
      color: 'orange'
    }
  ];

  const users = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      email: 'sarah.mitchell@school.edu',
      role: 'Teacher',
      subscription: 'Premium',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      email: 'michael.chen@university.edu',
      role: 'Teacher',
      subscription: 'Enterprise',
      joinDate: '2024-02-03',
      lastActive: '1 day ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      email: 'emma.r@elementary.edu',
      role: 'Teacher',
      subscription: 'Basic',
      joinDate: '2024-03-12',
      lastActive: '3 days ago',
      status: 'active'
    },
    {
      id: 4,
      name: 'John Student',
      email: 'john.student@gmail.com',
      role: 'Student',
      subscription: 'Free',
      joinDate: '2024-04-01',
      lastActive: '1 week ago',
      status: 'inactive'
    }
  ];

  const subscriptions = [
    {
      id: 1,
      user: 'Sarah Mitchell',
      plan: 'Premium',
      amount: '$25/month',
      status: 'active',
      nextBilling: '2024-09-15',
      tokensUsed: '2,450 / 3,000'
    },
    {
      id: 2,
      user: 'Dr. Michael Chen',
      plan: 'Enterprise',
      amount: '$50/month',
      status: 'active',
      nextBilling: '2024-09-20',
      tokensUsed: '8,230 / 10,000'
    },
    {
      id: 3,
      user: 'Emma Rodriguez',
      plan: 'Basic',
      amount: '$10/month',
      status: 'active',
      nextBilling: '2024-09-10',
      tokensUsed: '850 / 1,000'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-purple-100 text-purple-800';
      case 'Premium':
        return 'bg-blue-100 text-blue-800';
      case 'Basic':
        return 'bg-green-100 text-green-800';
      case 'Free':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center mb-12">
            <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">Manage users, subscriptions, and platform settings</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-slate-500 text-slate-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-center">
                          <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <div className="flex items-center">
                              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                              <div className="ml-2 flex items-center text-sm text-green-600">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {stat.change}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent User Activity</h3>
                      <div className="space-y-3">
                        {[
                          { user: 'Sarah Mitchell', action: 'Created quiz', time: '2 hours ago' },
                          { user: 'Dr. Michael Chen', action: 'Generated parent letter', time: '4 hours ago' },
                          { user: 'Emma Rodriguez', action: 'Joined community forum', time: '6 hours ago' },
                          { user: 'John Student', action: 'Completed assessment', time: '1 day ago' }
                        ].map((activity, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{activity.user}</p>
                              <p className="text-sm text-gray-500">{activity.action}</p>
                            </div>
                            <span className="text-sm text-gray-400">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                      <div className="space-y-4">
                        {[
                          { metric: 'API Response Time', value: '245ms', status: 'good' },
                          { metric: 'Database Performance', value: '99.8%', status: 'good' },
                          { metric: 'AI Service Uptime', value: '99.9%', status: 'excellent' },
                          { metric: 'Error Rate', value: '0.02%', status: 'good' }
                        ].map((metric, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-700">{metric.metric}</span>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900 mr-2">{metric.value}</span>
                              <div className={`w-2 h-2 rounded-full ${
                                metric.status === 'excellent' ? 'bg-green-500' :
                                metric.status === 'good' ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Subscription
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Active
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(user.subscription)}`}>
                                  {user.subscription}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.lastActive}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-900">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                    <Ban className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Subscription Management</h3>
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Export Report
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center">
                        <Crown className="w-8 h-8 text-yellow-500 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">2,847</p>
                          <p className="text-sm text-gray-500">Premium Subscribers</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center">
                        <CreditCard className="w-8 h-8 text-green-500 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">$184K</p>
                          <p className="text-sm text-gray-500">Monthly Revenue</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center">
                        <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-gray-900">94.2%</p>
                          <p className="text-sm text-gray-500">Retention Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Next Billing
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Token Usage
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {subscriptions.map((subscription) => (
                            <tr key={subscription.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{subscription.user}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(subscription.plan)}`}>
                                  {subscription.plan}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {subscription.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                                  {subscription.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {subscription.nextBilling}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {subscription.tokensUsed}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button className="text-blue-600 hover:text-blue-900">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="text-green-600 hover:text-green-900">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button className="text-red-600 hover:text-red-900">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Platform Analytics</h3>
                  <div className="bg-gray-100 rounded-xl p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics Dashboard</h4>
                    <p className="text-gray-600 mb-4">
                      Comprehensive analytics with user behavior, revenue trends, and platform performance metrics.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                      View Full Analytics
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Platform Settings</h3>
                  <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">AI Configuration</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Default AI Model
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>GPT-5</option>
                            <option>GPT-4</option>
                            <option>Claude-3</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Token Rate Limit
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            defaultValue="1000"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Platform Maintenance</h4>
                      <div className="space-y-4">
                        <button className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Enable Maintenance Mode
                        </button>
                        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />
                          Backup Database
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;