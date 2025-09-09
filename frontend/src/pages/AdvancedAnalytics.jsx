import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import SidebarLayout from '../components/SidebarLayout';

const AdvancedAnalytics = () => {
  const [insights, setInsights] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch ML insights
      const insightsResponse = await fetch('/api/analytics/ml-insights', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const insightsData = await insightsResponse.json();
      setInsights(insightsData);

      // Fetch predictions
      const predictionsResponse = await fetch('/api/analytics/predictions', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const predictionsData = await predictionsResponse.json();
      setPredictions(predictionsData);

      // Fetch study plan
      const studyPlanResponse = await fetch('/api/ai/study-plan', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const studyPlanData = await studyPlanResponse.json();
      setStudyPlan(studyPlanData);

    } catch (error) {
      addNotification({ title: 'Failed to load analytics data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateIntelligentFeedback = async (quizResults) => {
    try {
      const response = await fetch('/api/ai/intelligent-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(quizResults)
      });
      
      const feedback = await response.json();
      addNotification({ title: 'Intelligent feedback generated!', type: 'success' });
      return feedback;
    } catch (error) {
      addNotification({ title: 'Failed to generate feedback', type: 'error' });
    }
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Advanced Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered insights and personalized recommendations
            </p>
          </div>
          
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>

        {/* Performance Overview */}
        {insights?.overall_performance && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Performance Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {insights.overall_performance.average_score.toFixed(1)}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">Average Score</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  insights.overall_performance.trend === 'improving' ? 'text-green-600' :
                  insights.overall_performance.trend === 'declining' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {insights.overall_performance.trend}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Performance Trend</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {insights.overall_performance.predictions?.[0]?.toFixed(1) || 'N/A'}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">Next Predicted Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Subject Analysis */}
        {insights?.subject_analysis && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Subject Performance Analysis
            </h2>
            <div className="space-y-4">
              {Object.entries(insights.subject_analysis).map(([subject, analysis]) => (
                <div key={subject} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{subject}</h3>
                    <span className={`px-2 py-1 rounded text-sm ${
                      analysis.performance_level === 'excellent' ? 'bg-green-100 text-green-800' :
                      analysis.performance_level === 'good' ? 'bg-blue-100 text-blue-800' :
                      analysis.performance_level === 'average' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {analysis.performance_level}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Average: </span>
                      <span className="font-semibold">{analysis.average_score.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Consistency: </span>
                      <span className="font-semibold">{(analysis.consistency * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Trend: </span>
                      <span className={`font-semibold ${
                        analysis.trend === 'improving' ? 'text-green-600' :
                        analysis.trend === 'declining' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {analysis.trend}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <strong>Recommendation:</strong> {analysis.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Predictions */}
        {predictions && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              AI Predictions & Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Recommended Quiz Difficulty
                </h3>
                <div className="text-2xl font-bold text-blue-600 capitalize">
                  {predictions.next_quiz_difficulty}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Based on your recent performance patterns
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Study Materials
                </h3>
                <div className="space-y-2">
                  {predictions.study_materials?.slice(0, 3).map((material, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {material.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Personalized Study Plan */}
        {studyPlan?.study_plan && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              AI-Generated Study Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(studyPlan.study_plan).map(([week, plan]) => (
                <div key={week} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white capitalize mb-2">
                    {week.replace('_', ' ')}
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Focus:</strong> {plan.focus}
                  </div>
                  <div className="space-y-1">
                    {plan.daily_tasks?.map((task, index) => (
                      <div key={index} className="text-xs text-gray-500 dark:text-gray-400">
                        • {task}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {insights?.recommendations && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Personalized Recommendations
            </h2>
            <div className="space-y-2">
              {insights.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className="text-gray-700 dark:text-gray-300">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default AdvancedAnalytics;