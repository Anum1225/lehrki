import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, BookOpen, Users, Clock, Award, Eye, Edit, Trash2, TrendingUp, FileText, CheckCircle, AlertCircle, Brain } from 'lucide-react';
import SidebarLayout from '../components/SidebarLayout';
import FeedbackModal from '../components/FeedbackModal';
import { useNotifications } from '../contexts/NotificationContext';

const AssessmentCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  const handleFeedbackSubmit = async (feedback) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(feedback)
      });
      
      if (response.ok) {
        addNotification({
          type: 'success',
          title: 'Feedback Sent',
          message: 'Thank you for your feedback!'
        });
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Feedback Failed',
        message: 'Failed to submit feedback. Please try again.'
      });
    }
  };

  const assessments = [
    {
      id: 1,
      title: "Mathematics Quiz - Algebra",
      students: 28,
      avgScore: 85,
      completed: 25,
      pending: 3,
      date: "2024-08-29",
      status: "active"
    },
    {
      id: 2,
      title: "Science Assessment - Biology",
      students: 32,
      avgScore: 78,
      completed: 32,
      pending: 0,
      date: "2024-08-27",
      status: "completed"
    }
  ];

  const studentResults = [
    {
      id: 1,
      name: "Alice Johnson",
      score: 92,
      timeSpent: "15 mins",
      status: "completed",
      feedback: "Excellent work! Strong understanding of algebraic concepts."
    },
    {
      id: 2,
      name: "Bob Smith",
      score: 78,
      timeSpent: "18 mins",
      status: "completed",
      feedback: "Good effort. Consider reviewing quadratic equations."
    },
    {
      id: 3,
      name: "Carol Davis",
      score: 0,
      timeSpent: "0 mins",
      status: "pending",
      feedback: "Assessment not yet started."
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'assessments', label: 'Assessments', icon: FileText },
    { id: 'students', label: 'Student Results', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Brain }
  ];

  return (
    <SidebarLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center mb-8">
            <Brain className="w-8 h-8 text-primary-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Assessment Center</h1>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-blue-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-blue-600">12</p>
                          <p className="text-sm text-blue-800">Total Assessments</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-green-600">89%</p>
                          <p className="text-sm text-green-800">Avg Completion Rate</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-purple-600">82%</p>
                          <p className="text-sm text-purple-800">Avg Score</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="w-8 h-8 text-orange-600 mr-3" />
                        <div>
                          <p className="text-2xl font-bold text-orange-600">16m</p>
                          <p className="text-sm text-orange-800">Avg Time</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-primary-500 to-purple-600 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
                    <p className="mb-4">Get automated feedback and personalized recommendations for each student based on their performance patterns.</p>
                    <button 
                      className="bg-white text-primary-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        const reportContent = `AI Assessment Report\n\nGenerated: ${new Date().toLocaleDateString()}\n\nTotal Assessments: 12\nAverage Completion Rate: 89%\nAverage Score: 82%\nAverage Time: 16 minutes\n\nKey Insights:\n- Students perform best in morning sessions\n- Interactive questions show 15% higher engagement\n- Personalized feedback improves retention by 23%`;
                        const blob = new Blob([reportContent], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `AI_Assessment_Report_${new Date().toISOString().split('T')[0]}.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                        addNotification({
                          type: 'success',
                          title: 'Report Generated',
                          message: 'AI assessment report has been downloaded successfully'
                        });
                      }}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              )}

              {/* Assessments Tab */}
              {activeTab === 'assessments' && (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{assessment.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assessment.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {assessment.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Students</p>
                          <p className="font-semibold">{assessment.students}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg Score</p>
                          <p className="font-semibold">{assessment.avgScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Completed</p>
                          <p className="font-semibold">{assessment.completed}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Pending</p>
                          <p className="font-semibold">{assessment.pending}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date</p>
                          <p className="font-semibold">{assessment.date}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        <button 
                          className="btn-primary text-sm"
                          onClick={() => {
                            addNotification({
                              type: 'info',
                              title: 'Assessment Details',
                              message: `Viewing details for ${assessment.title}`
                            });
                            setActiveTab('students');
                          }}
                        >
                          View Details
                        </button>
                        <button 
                          onClick={() => {
                            const reportData = {
                              title: assessment.title,
                              students: assessment.students,
                              avgScore: assessment.avgScore,
                              completed: assessment.completed,
                              date: assessment.date
                            };
                            const content = `Assessment Report: ${assessment.title}\n\nStudents: ${assessment.students}\nAverage Score: ${assessment.avgScore}%\nCompleted: ${assessment.completed}\nDate: ${assessment.date}`;
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `${assessment.title.replace(/\s+/g, '_')}_report.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="btn-secondary text-sm"
                        >
                          Download Report
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Student Results Tab */}
              {activeTab === 'students' && (
                <div className="space-y-4">
                  {studentResults.map((student) => (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-semibold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              {student.timeSpent}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          {student.status === 'completed' ? (
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">{student.score}%</div>
                              <div className="text-sm text-gray-500">Score</div>
                            </div>
                          ) : (
                            <div className="flex items-center text-orange-600">
                              <AlertCircle className="w-5 h-5 mr-1" />
                              <span className="text-sm font-medium">Pending</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">AI Feedback</h4>
                        <p className="text-sm text-gray-700">{student.feedback}</p>
                      </div>
                      
                      {student.status === 'completed' && (
                        <div className="mt-4 flex gap-2">
                          <button 
                            className="btn-primary text-sm"
                            onClick={() => {
                              addNotification({
                                type: 'success',
                                title: 'Analysis Generated',
                                message: `Detailed analysis for ${student.name} has been generated`
                              });
                            }}
                          >
                            Detailed Analysis
                          </button>
                          <button 
                            onClick={() => setFeedbackModalOpen(true)}
                            className="btn-secondary text-sm"
                          >
                            Send Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                    <p className="text-gray-600 mb-4">
                      Detailed performance analytics, learning pattern insights, and predictive assessments coming soon.
                    </p>
                    <button className="btn-primary">Request Early Access</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
        </div>
      </div>
      
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </SidebarLayout>
  );
};

export default AssessmentCenter;