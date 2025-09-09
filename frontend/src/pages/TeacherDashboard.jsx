import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import { apiService } from '../services/api';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Plus, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  GraduationCap,
  Target,
  Bell,
  FileText,
  Settings,
  Download,
  Eye,
  Edit3,
  Trash2,
  Star,
  MessageSquare,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

const TeacherDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalClasses: 8,
      totalStudents: 247,
      quizzesCreated: 45,
      avgScore: 87.5,
      monthlyGrowth: 12.5,
      activeAssignments: 15
    },
    recentClasses: [
      { id: 1, name: 'Advanced Mathematics', students: 32, lastActivity: '2 hours ago', progress: 85 },
      { id: 2, name: 'Physics Fundamentals', students: 28, lastActivity: '4 hours ago', progress: 92 },
      { id: 3, name: 'Chemistry Lab', students: 25, lastActivity: '1 day ago', progress: 78 },
      { id: 4, name: 'Biology Basics', students: 30, lastActivity: '2 days ago', progress: 88 }
    ],
    recentQuizzes: [
      { id: 1, title: 'Calculus Integration', class: 'Advanced Mathematics', submissions: 28, avgScore: 85, status: 'active' },
      { id: 2, title: 'Newton\'s Laws', class: 'Physics Fundamentals', submissions: 25, avgScore: 92, status: 'completed' },
      { id: 3, title: 'Chemical Bonds', class: 'Chemistry Lab', submissions: 22, avgScore: 78, status: 'active' },
      { id: 4, title: 'Cell Structure', class: 'Biology Basics', submissions: 30, avgScore: 88, status: 'grading' }
    ],
    notifications: [
      { id: 1, type: 'assignment', message: '15 new quiz submissions to review', time: '30 min ago' },
      { id: 2, type: 'student', message: 'Sarah Johnson needs help with Physics', time: '1 hour ago' },
      { id: 3, type: 'system', message: 'Monthly report is ready for download', time: '2 hours ago' }
    ]
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real dashboard stats from backend
        const dashboardStats = await apiService.dashboard.getStats();

        // Fetch quizzes data
        const quizzesResponse = await apiService.quizzes.getAll();
        const quizzes = quizzesResponse.data || [];

        // Fetch parent letters
        const parentLettersResponse = await apiService.parentLetters.getAll();
        const parentLetters = parentLettersResponse.data || [];

        // Update dashboard data with real information
        setDashboardData(prev => ({
          ...prev,
          stats: {
            totalClasses: Array.isArray(quizzes) ? quizzes.length : 0,
            totalStudents: 150, // This could be calculated from user data
            quizzesCreated: Array.isArray(quizzes) ? quizzes.length : 0,
            avgScore: 87.5, // This could be calculated from quiz attempts
            monthlyGrowth: 12.5,
            activeAssignments: Array.isArray(quizzes) ? quizzes.length : 0
          },
          recentClasses: Array.isArray(quizzes) ? quizzes.slice(0, 4).map((quiz, index) => ({
            id: quiz.id,
            name: quiz.title,
            students: 25 + index * 5, // Mock student count
            lastActivity: '2 hours ago',
            progress: 80 + index * 5
          })) : [],
          recentQuizzes: Array.isArray(quizzes) ? quizzes.slice(0, 4).map((quiz, index) => ({
            id: quiz.id,
            title: quiz.title,
            class: quiz.topic || 'General',
            submissions: 20 + index * 3,
            avgScore: 85 + index * 2,
            status: index === 0 ? 'active' : index === 1 ? 'completed' : 'grading'
          })) : [],
          notifications: [
            { id: 1, type: 'assignment', message: `${Array.isArray(quizzes) ? quizzes.length : 0} quiz submissions to review`, time: '30 min ago' },
            { id: 2, type: 'student', message: 'New student enrolled in your class', time: '1 hour ago' },
            { id: 3, type: 'system', message: 'Monthly analytics report available', time: '2 hours ago' }
          ]
        }));
      } catch (error) {
        console.error('Failed to fetch teacher dashboard data:', error);
        // Keep default data if API fails
      }
    };
    fetchDashboardData();
  }, []);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { name: 'Classes', value: dashboardData.stats.totalClasses, icon: BookOpen, change: '+2', changeType: 'positive', description: 'Active Classes' },
    { name: 'Students', value: dashboardData.stats.totalStudents, icon: Users, change: `+${dashboardData.stats.monthlyGrowth}%`, changeType: 'positive', description: 'Total Enrolled' },
    { name: 'Quizzes Created', value: dashboardData.stats.quizzesCreated, icon: BarChart3, change: '+8', changeType: 'positive', description: 'This Month' },
    { name: 'Avg Score', value: `${dashboardData.stats.avgScore}%`, icon: Award, change: '+3.2%', changeType: 'positive', description: 'Class Average' },
    { name: 'Active Assignments', value: dashboardData.stats.activeAssignments, icon: FileText, change: '+5', changeType: 'positive', description: 'Pending Review' },
    { name: 'Monthly Growth', value: `${dashboardData.stats.monthlyGrowth}%`, icon: TrendingUp, change: '+2.1%', changeType: 'positive', description: 'Student Engagement' }
  ];

  const recentClasses = [
    { id: 1, name: 'Mathematics 101', students: 28, nextClass: '2024-09-01 10:00', status: 'active' },
    { id: 2, name: 'Algebra Advanced', students: 22, nextClass: '2024-09-01 14:00', status: 'active' },
    { id: 3, name: 'Geometry Basics', students: 25, nextClass: '2024-09-02 09:00', status: 'scheduled' },
    { id: 4, name: 'Calculus Prep', students: 18, nextClass: '2024-09-02 11:00', status: 'scheduled' }
  ];

  const recentQuizzes = [
    { id: 1, title: 'Algebra Quiz #3', class: 'Mathematics 101', responses: 25, avgScore: 87, status: 'completed' },
    { id: 2, title: 'Geometry Test', class: 'Geometry Basics', responses: 22, avgScore: 82, status: 'active' },
    { id: 3, title: 'Calculus Practice', class: 'Calculus Prep', responses: 15, avgScore: 79, status: 'draft' }
  ];

  const quickActions = [
    {
      title: 'Create New Quiz',
      description: 'Build interactive quizzes with AI assistance',
      icon: BookOpen,
      href: '/quiz-creator',
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Grade Assessments',
      description: 'Review and grade student submissions',
      icon: FileText,
      href: '/assessment',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Parent Letters',
      description: 'Generate personalized parent communications',
      icon: MessageCircle,
      href: '/parent-letters',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'View Analytics',
      description: 'Track student performance and progress',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.first_name || 'Teacher'}! 👨‍🏫
              </h1>
              <p className="mt-3 text-gray-600 text-lg">
                Manage your classes, create content, and track student progress
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                  stat.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.a
                key={index}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="block p-4 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center mb-2">
                  <action.icon className="w-5 h-5 text-gray-600 mr-2" />
                  <h3 className="text-base font-medium text-gray-900">{action.title}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">{action.description}</p>
                <div className="text-gray-500 hover:text-gray-700 text-sm transition-colors">
                  Get started →
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* My Classes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <GraduationCap className="h-6 w-6 mr-2 text-indigo-600" />
                My Classes
              </h2>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-2 py-1 transition-colors">
                <Plus className="h-4 w-4" />
                <span>New Class</span>
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.recentClasses.map((classItem, index) => (
                <motion.div 
                  key={classItem.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{classItem.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {classItem.students} students
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {classItem.lastActivity}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">{classItem.progress}%</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${classItem.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notifications Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Bell className="h-6 w-6 mr-2 text-orange-600" />
                Notifications
              </h2>
              <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                {dashboardData.notifications.length}
              </span>
            </div>
            <div className="space-y-4">
              {dashboardData.notifications.map((notification, index) => (
                <motion.div 
                  key={notification.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-400 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'assignment' ? 'bg-orange-100' :
                      notification.type === 'student' ? 'bg-emerald-100' : 'bg-indigo-100'
                    }`}>
                      {notification.type === 'assignment' ? <FileText className="h-4 w-4 text-orange-600" /> :
                       notification.type === 'student' ? <MessageSquare className="h-4 w-4 text-emerald-600" /> :
                       <Settings className="h-4 w-4 text-indigo-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Teaching Performance</h3>
              <p className="text-primary-100 mb-4">Your students are performing excellently this month!</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span>4.8/5 Student Rating</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>+12% Improvement</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center">
                <Award className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SidebarLayout>
  );
};

export default TeacherDashboard;
