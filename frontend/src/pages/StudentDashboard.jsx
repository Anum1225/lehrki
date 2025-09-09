import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Users,
  BarChart3,
  Brain,
  TrendingUp,
  Award,
  Clock,
  Plus,
  ArrowRight,
  FileText,
  MessageCircle,
  Calendar,
  CheckCircle,
  Star,
  Target,
  Zap,
  Play,
  Download,
  Eye,
  Trophy,
  GraduationCap,
  Bell,
  Search,
  Filter,
  MoreVertical,
  RefreshCw,
  PenTool,
  Bookmark,
  Timer
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SidebarLayout from '../components/SidebarLayout';
import { apiService } from '../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      enrolledCourses: 8,
      completedQuizzes: 24,
      averageScore: 92,
      studyTime: 47,
      weeklyGoals: 5,
      completedGoals: 4
    },
    studyStreak: 7,
    upcomingDeadlines: [
      { id: 1, title: 'Math Assignment', course: 'Advanced Mathematics', dueDate: '2024-09-02', priority: 'high' },
      { id: 2, title: 'Physics Lab Report', course: 'Physics Fundamentals', dueDate: '2024-09-03', priority: 'medium' },
      { id: 3, title: 'Chemistry Quiz', course: 'Chemistry Lab', dueDate: '2024-09-01', priority: 'high' }
    ],
    recentActivities: [
      { id: 1, type: 'quiz_completed', title: 'Completed Chemistry Quiz', score: 95, time: '2 hours ago' },
      { id: 2, type: 'lesson_watched', title: 'Watched Physics Lecture', progress: 100, time: '4 hours ago' },
      { id: 3, type: 'assignment_submitted', title: 'Submitted Math Homework', status: 'pending', time: '1 day ago' }
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
            enrolledCourses: parentLetters.length,
            completedQuizzes: Array.isArray(quizzes) ? quizzes.length : 0,
            averageScore: 85, // This could be calculated from quiz attempts
            studyTime: 25, // This could be tracked separately
            weeklyGoals: 5,
            completedGoals: 3
          },
          studyStreak: 5, // This could be calculated from user activity
          upcomingDeadlines: [], // This could be fetched from assignments/quizzes
          recentActivities: [
            ...(Array.isArray(quizzes) ? quizzes.slice(0, 2).map(q => ({
              id: q.id,
              type: 'quiz_completed',
              title: `Completed ${q.title}`,
              score: 85,
              time: '2 hours ago'
            })) : []),
            ...(Array.isArray(parentLetters) ? parentLetters.slice(0, 1).map(l => ({
              id: l.id,
              type: 'letter_generated',
              title: `Generated ${l.title}`,
              time: '1 day ago'
            })) : [])
          ]
        }));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep default data if API fails
      }
    };

    fetchDashboardData();

    // Simulate real-time updates for study progress
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          studyTime: prev.stats.studyTime + Math.floor(Math.random() * 2)
        }
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: 'Total Quizzes', value: dashboardData.stats.completedQuizzes, color: 'blue', icon: BookOpen, change: 'Created by you', trend: '+15%' },
    { label: 'Parent Letters', value: dashboardData.stats.enrolledCourses, color: 'green', icon: FileText, change: 'Generated', trend: '+25%' },
    { label: 'Average Score', value: `${dashboardData.stats.averageScore}%`, color: 'purple', icon: Award, change: 'Performance', trend: '+5%' },
    { label: 'Study Time', value: `${dashboardData.stats.studyTime}h`, color: 'orange', icon: Clock, change: 'This week', trend: '+35%' },
    { label: 'Weekly Goals', value: `${dashboardData.stats.completedGoals}/${dashboardData.stats.weeklyGoals}`, color: 'indigo', icon: Target, change: 'Goals completed', trend: '+80%' },
    { label: 'Study Streak', value: `${dashboardData.studyStreak} days`, color: 'green', icon: Zap, change: 'Current streak', trend: '+100%' }
  ];

  const recentCourses = [
    { id: 1, name: 'Advanced Mathematics', progress: 85, nextLesson: 'Calculus Integration', dueDate: '2024-09-02', instructor: 'Dr. Smith' },
    { id: 2, name: 'Physics Fundamentals', progress: 72, nextLesson: 'Quantum Mechanics', dueDate: '2024-09-03', instructor: 'Prof. Johnson' },
    { id: 3, name: 'Chemistry Lab', progress: 91, nextLesson: 'Organic Compounds', dueDate: '2024-09-01', instructor: 'Dr. Wilson' },
    { id: 4, name: 'Biology Basics', progress: 68, nextLesson: 'Cell Structure', dueDate: '2024-09-04', instructor: 'Ms. Davis' }
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Math Problem Set #5', course: 'Advanced Mathematics', dueDate: '2024-09-02', priority: 'high', type: 'assignment' },
    { id: 2, title: 'Physics Lab Report', course: 'Physics Fundamentals', dueDate: '2024-09-03', priority: 'medium', type: 'report' },
    { id: 3, title: 'Chemistry Quiz', course: 'Chemistry Lab', dueDate: '2024-09-01', priority: 'high', type: 'quiz' },
    { id: 4, title: 'Biology Essay', course: 'Biology Basics', dueDate: '2024-09-05', priority: 'low', type: 'essay' }
  ];

  const achievements = [
    { id: 1, title: 'Perfect Score', description: 'Scored 100% on Chemistry Quiz', icon: Star, color: 'yellow' },
    { id: 2, title: 'Study Streak', description: '7 days consecutive study', icon: Zap, color: 'blue' },
    { id: 3, title: 'Quick Learner', description: 'Completed 5 lessons this week', icon: Brain, color: 'purple' },
    { id: 4, title: 'Top Performer', description: 'Top 10% in Mathematics', icon: Trophy, color: 'orange' }
  ];

  const quickActions = [
    {
      title: 'Take Quiz',
      description: 'Practice with available quizzes',
      icon: Play,
      href: '/quiz-creator',
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Study Materials',
      description: 'Access course resources and notes',
      icon: BookOpen,
      href: '/assessment',
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Join Discussion',
      description: 'Connect with classmates and teachers',
      icon: MessageCircle,
      href: '/community',
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'View Progress',
      description: 'Track your learning analytics',
      icon: BarChart3,
      href: '/analytics',
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600'
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <SidebarLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-200 shadow-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.first_name || 'Student'}! 🎓
              </h1>
              <p className="mt-3 text-gray-600 text-lg">
                Track your learning progress and access study materials
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
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
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
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
                  Start now →
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Timer className="w-5 h-5 mr-2 text-indigo-600" />
              Recent Activity
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'quiz_completed' ? 'bg-green-100' :
                    activity.type === 'lesson_watched' ? 'bg-blue-100' : 'bg-purple-100'
                  }`}>
                    {activity.type === 'quiz_completed' ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                     activity.type === 'lesson_watched' ? <Play className="w-4 h-4 text-blue-600" /> :
                     <PenTool className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    {activity.score && <p className="text-xs text-green-600 mt-1">Score: {activity.score}%</p>}
                    {activity.progress && <p className="text-xs text-blue-600 mt-1">Progress: {activity.progress}%</p>}
                    {activity.status && <p className="text-xs text-purple-600 mt-1">Status: {activity.status}</p>}
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-600" />
              Upcoming Deadlines
            </h3>
            <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded-full">
              {dashboardData.upcomingDeadlines.length} pending
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dashboardData.upcomingDeadlines.map((deadline, index) => (
              <motion.div
                key={deadline.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border-l-4 border-orange-400 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{deadline.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{deadline.course}</p>
                    <p className="text-xs text-gray-500 mt-1">Due: {deadline.dueDate}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    deadline.priority === 'high' ? 'bg-red-100 text-red-700' :
                    deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {deadline.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* My Courses */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-gray-600" />
                My Courses
              </h3>
              <button className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{course.name}</h4>
                    <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Next: {course.nextLesson}</span>
                    <span>Due: {course.dueDate}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Instructor: {course.instructor}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Assignments */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Upcoming Assignments
              </h3>
              <button className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                    <p className="text-sm text-gray-600">{assignment.course}</p>
                    <p className="text-xs text-gray-500">Due: {assignment.dueDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {assignment.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 text-center"
              >
                <div className={`w-12 h-12 bg-${achievement.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <achievement.icon className={`w-6 h-6 text-${achievement.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-8 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Learning Progress</h3>
              <p className="text-indigo-100 mb-4">You're doing great! Keep up the excellent work!</p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  <span>8/10 Goals Achieved</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>+15% This Month</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  <span>Top 5% Student</span>
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

export default StudentDashboard;
