import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, BookOpen, Clock, Award, Download, Calendar } from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const stats = [
    {
      name: 'Total Students',
      value: '1,234',
      change: '+12.5%',
      changeType: 'increase',
      icon: Users,
      color: 'blue'
    },
    {
      name: 'Quizzes Created',
      value: '89',
      change: '+23.1%',
      changeType: 'increase',
      icon: BookOpen,
      color: 'green'
    },
    {
      name: 'Average Score',
      value: '84.2%',
      change: '+2.4%',
      changeType: 'increase',
      icon: Award,
      color: 'purple'
    },
    {
      name: 'Study Time',
      value: '2.4h',
      change: '+8.7%',
      changeType: 'increase',
      icon: Clock,
      color: 'orange'
    }
  ];

  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Quiz Completion Rate',
        data: [85, 89, 87, 92],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2
      },
      {
        label: 'Average Score',
        data: [78, 82, 84, 86],
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2
      }
    ]
  };

  const subjectPerformance = [
    { subject: 'Mathematics', avgScore: 87, students: 45, improvement: '+5%' },
    { subject: 'Science', avgScore: 82, students: 38, improvement: '+3%' },
    { subject: 'English', avgScore: 89, students: 52, improvement: '+7%' },
    { subject: 'History', avgScore: 78, students: 29, improvement: '+2%' },
    { subject: 'Geography', avgScore: 85, students: 33, improvement: '+4%' }
  ];

  const topPerformers = [
    { name: 'Alice Johnson', score: 96, quizzes: 12, rank: 1 },
    { name: 'Bob Smith', score: 94, quizzes: 15, rank: 2 },
    { name: 'Carol Davis', score: 92, quizzes: 11, rank: 3 },
    { name: 'David Wilson', score: 90, quizzes: 13, rank: 4 },
    { name: 'Emma Brown', score: 88, quizzes: 14, rank: 5 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Track performance and gain insights</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="btn-primary flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center mr-4`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
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

          {/* Charts and Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Performance Trends</h3>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Last 4 weeks</span>
                </div>
              </div>
              
              {/* Placeholder for chart - would integrate with Chart.js */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Performance chart would be rendered here</p>
                  <p className="text-sm text-gray-400">Integration with Chart.js for interactive visualizations</p>
                </div>
              </div>
            </motion.div>

            {/* Subject Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Subject Performance</h3>
              <div className="space-y-4">
                {subjectPerformance.map((subject, index) => (
                  <div key={subject.subject} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-600 font-medium">{subject.improvement}</span>
                          <span className="text-sm text-gray-500">{subject.avgScore}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${subject.avgScore}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{subject.students} students</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Top Performers and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Performers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h3>
              <div className="space-y-4">
                {topPerformers.map((student) => (
                  <div key={student.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        student.rank <= 3 
                          ? 'bg-yellow-100 text-yellow-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="text-sm font-bold">#{student.rank}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.quizzes} quizzes completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{student.score}%</p>
                      <p className="text-xs text-gray-500">avg score</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-primary-500 to-purple-600 p-6 rounded-xl text-white"
            >
              <h3 className="text-lg font-semibold mb-4">AI-Powered Insights</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">📈 Trending Up</h4>
                  <p className="text-sm opacity-90">
                    Mathematics scores have improved by 15% this month. Students are responding well to the new quiz format.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">🎯 Recommendation</h4>
                  <p className="text-sm opacity-90">
                    Consider creating more advanced quizzes for top performers to maintain engagement.
                  </p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">⚠️ Attention Needed</h4>
                  <p className="text-sm opacity-90">
                    5 students haven't completed any quizzes this week. Consider sending reminder notifications.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;