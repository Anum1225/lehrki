import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  BarChart3,
  Settings,
  TrendingUp,
  DollarSign,
  Activity,
  Plus,
  ArrowRight,
  Server,
  Database,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Edit,
  Trash2,
  Bell,
  Search,
  Filter,
  MoreVertical,
  RefreshCw,
  Zap,
  Globe,
  Lock,
  Wifi
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import { apiService } from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 1247,
      activeSessions: 89,
      systemHealth: 98,
      monthlyRevenue: 12450,
      newUsersToday: 23,
      serverLoad: 67
    },
    recentActivities: [
      { id: 1, type: 'user_registered', user: 'Sarah Johnson', time: '5 min ago', details: 'New teacher account created' },
      { id: 2, type: 'system_update', user: 'System', time: '15 min ago', details: 'Database optimization completed' },
      { id: 3, type: 'payment_received', user: 'Mike Chen', time: '30 min ago', details: 'Premium subscription activated' },
      { id: 4, type: 'security_alert', user: 'Security Bot', time: '1 hour ago', details: 'Suspicious login attempt blocked' }
    ]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch system health data
        const systemHealth = await apiService.system.health();

        // Fetch analytics overview
        const analytics = await apiService.analytics.getOverview();

        // Update dashboard data with real information
        setDashboardData(prev => ({
          ...prev,
          stats: {
            totalUsers: analytics.total_students || 1247,
            activeSessions: 89, // This could be tracked separately
            systemHealth: systemHealth.status === 'healthy' ? 98 : 85,
            monthlyRevenue: 12450, // This could be fetched from payments
            newUsersToday: 23, // This could be calculated from user registrations
            serverLoad: 67 // This could be from system monitoring
          },
          recentActivities: [
            { id: 1, type: 'user_registered', user: 'New User', time: '5 min ago', details: 'Account created successfully' },
            { id: 2, type: 'system_update', user: 'System', time: '15 min ago', details: 'Database optimization completed' },
            { id: 3, type: 'payment_received', user: 'Premium User', time: '30 min ago', details: 'Subscription activated' },
            { id: 4, type: 'security_alert', user: 'Security', time: '1 hour ago', details: 'Login attempt monitored' }
          ]
        }));
      } catch (error) {
        console.error('Failed to fetch admin dashboard data:', error);
        // Keep default data if API fails
      }
    };

    fetchDashboardData();

    // Simulate real-time data updates
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          activeSessions: prev.stats.activeSessions + Math.floor(Math.random() * 5) - 2
        }
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Users', value: dashboardData.stats.totalUsers.toLocaleString(), color: 'blue', icon: Users, change: '+127 this month', trend: '+12%' },
    { label: 'Active Sessions', value: dashboardData.stats.activeSessions, color: 'green', icon: Activity, change: '+12 online now', trend: '+8%' },
    { label: 'System Health', value: `${dashboardData.stats.systemHealth}%`, color: 'purple', icon: Server, change: 'All systems operational', trend: '+2%' },
    { label: 'Monthly Revenue', value: `$${dashboardData.stats.monthlyRevenue.toLocaleString()}`, color: 'orange', icon: DollarSign, change: '+23% vs last month', trend: '+23%' },
    { label: 'New Users Today', value: dashboardData.stats.newUsersToday, color: 'indigo', icon: UserCheck, change: 'Today\'s signups', trend: '+15%' },
    { label: 'Server Load', value: `${dashboardData.stats.serverLoad}%`, color: 'red', icon: Zap, change: 'Current load', trend: '-5%' }
  ];

  const recentUsers = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@school.edu', role: 'teacher', status: 'active', joined: '2024-08-30' },
    { id: 2, name: 'Mike Chen', email: 'mike.chen@student.edu', role: 'student', status: 'active', joined: '2024-08-29' },
    { id: 3, name: 'Dr. Emily Davis', email: 'emily@university.edu', role: 'teacher', status: 'pending', joined: '2024-08-28' },
    { id: 4, name: 'Alex Rodriguez', email: 'alex@school.edu', role: 'student', status: 'active', joined: '2024-08-27' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', message: 'High server load detected', time: '5 minutes ago', status: 'investigating' },
    { id: 2, type: 'info', message: 'Scheduled maintenance completed', time: '2 hours ago', status: 'resolved' },
    { id: 3, type: 'success', message: 'New feature deployed successfully', time: '1 day ago', status: 'completed' },
    { id: 4, type: 'error', message: 'Payment gateway timeout', time: '2 days ago', status: 'resolved' }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Add, edit, or remove user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings and features',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Analytics & Reports',
      description: 'View detailed platform analytics',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Security Center',
      description: 'Monitor security and access logs',
      icon: Shield,
      href: '/admin/security',
      color: 'bg-red-500',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Activity;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'success': return 'text-green-600 bg-green-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent">
                Admin Dashboard - {user?.first_name || 'Admin'}! 🛡️
              </h1>
              <p className="mt-3 text-gray-600 text-lg">
                Manage platform, users, and system settings
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.trend}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.a
                key={index}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-slate-600 text-sm font-medium group-hover:text-slate-700">
                  Access
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Real-time Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-slate-600" />
              Real-time Activity
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardData.recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'user_registered' ? 'bg-green-100' :
                    activity.type === 'system_update' ? 'bg-blue-100' :
                    activity.type === 'payment_received' ? 'bg-purple-100' : 'bg-red-100'
                  }`}>
                    {activity.type === 'user_registered' ? <UserCheck className="w-4 h-4 text-green-600" /> :
                     activity.type === 'system_update' ? <Settings className="w-4 h-4 text-blue-600" /> :
                     activity.type === 'payment_received' ? <DollarSign className="w-4 h-4 text-purple-600" /> :
                     <Shield className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                    <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Users */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-slate-600" />
                Recent Users
              </h3>
              <button className="text-slate-600 hover:text-slate-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">Joined: {user.joined}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'teacher' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-slate-600" />
                System Alerts
              </h3>
              <button className="text-slate-600 hover:text-slate-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {systemAlerts.map((alert) => {
                const IconComponent = getAlertIcon(alert.type);
                return (
                  <div key={alert.id} className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${getAlertColor(alert.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{alert.message}</h4>
                      <p className="text-xs text-gray-500">{alert.time}</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'resolved' || alert.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Platform Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Platform Performance</h3>
              <p className="text-slate-100 mb-4">All systems running smoothly with excellent uptime!</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Server className="w-5 h-5 mr-2" />
                  <span>99.9% Uptime</span>
                </div>
                <div className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  <span>2.3TB Data Processed</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>+15% Growth</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SidebarLayout>
  );
};

export default AdminDashboard;
