import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, Target, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api';

const PerformancePredictor = ({ onResult, className = "" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    currentGrade: '',
    studyHours: 5,
    previousScores: '',
    strengths: '',
    weaknesses: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const studentData = {
        current_grade: formData.currentGrade,
        study_hours_per_week: formData.studyHours,
        previous_scores: formData.previousScores.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)),
        strengths: formData.strengths.split(',').map(s => s.trim()).filter(s => s),
        weaknesses: formData.weaknesses.split(',').map(s => s.trim()).filter(s => s)
      };

      const response = await api.post('/ai/performance-prediction', {
        student_data: studentData,
        subject: formData.subject,
        language: 'en'
      });

      onResult?.(response.data);
    } catch (error) {
      console.error('Error predicting performance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('performancePredictor')}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('targetSubject')}
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder={t('enterSubject')}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('currentGrade')}
          </label>
          <select
            value={formData.currentGrade}
            onChange={(e) => setFormData(prev => ({ ...prev, currentGrade: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">{t('selectGrade')}</option>
            <option value="A">A (90-100%)</option>
            <option value="B">B (80-89%)</option>
            <option value="C">C (70-79%)</option>
            <option value="D">D (60-69%)</option>
            <option value="F">F (Below 60%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('studyHoursPerWeek')}
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={formData.studyHours}
            onChange={(e) => setFormData(prev => ({ ...prev, studyHours: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('previousScores')} ({t('commaSeparated')})
          </label>
          <input
            type="text"
            value={formData.previousScores}
            onChange={(e) => setFormData(prev => ({ ...prev, previousScores: e.target.value }))}
            placeholder="85, 78, 92, 88"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('strengths')} ({t('commaSeparated')})
            </label>
            <input
              type="text"
              value={formData.strengths}
              onChange={(e) => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
              placeholder={t('problemSolving')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('weaknesses')} ({t('commaSeparated')})
            </label>
            <input
              type="text"
              value={formData.weaknesses}
              onChange={(e) => setFormData(prev => ({ ...prev, weaknesses: e.target.value }))}
              placeholder={t('timeManagement')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.subject || !formData.currentGrade}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('analyzing')}</span>
            </>
          ) : (
            <>
              <Target className="w-4 h-4" />
              <span>{t('predictPerformance')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default PerformancePredictor;