import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Loader } from 'lucide-react';

const LearningPathGenerator = ({ onResult, className = "" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    subject: '',
    current_level: 'beginner',
    target_level: 'intermediate',
    timeframe: '4 weeks'
  });

  const handleGenerate = async () => {
    if (!data.subject.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/learning-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...data,
          language: localStorage.getItem('i18nextLng') || 'en'
        })
      });

      const result = await response.json();
      onResult?.(result);
    } catch (error) {
      console.error('Learning path generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <MapPin className="w-5 h-5 text-green-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('learningPathGenerator')}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subject')}
          </label>
          <input
            type="text"
            value={data.subject}
            onChange={(e) => setData(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            placeholder={t('subjectPlaceholder')}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('currentLevel')}
            </label>
            <select
              value={data.current_level}
              onChange={(e) => setData(prev => ({ ...prev, current_level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="beginner">{t('beginner')}</option>
              <option value="intermediate">{t('intermediate')}</option>
              <option value="advanced">{t('advanced')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('targetLevel')}
            </label>
            <select
              value={data.target_level}
              onChange={(e) => setData(prev => ({ ...prev, target_level: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="intermediate">{t('intermediate')}</option>
              <option value="advanced">{t('advanced')}</option>
              <option value="expert">{t('expert')}</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('timeframe')}
          </label>
          <select
            value={data.timeframe}
            onChange={(e) => setData(prev => ({ ...prev, timeframe: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="2 weeks">{t('twoWeeks')}</option>
            <option value="4 weeks">{t('fourWeeks')}</option>
            <option value="8 weeks">{t('eightWeeks')}</option>
            <option value="12 weeks">{t('twelveWeeks')}</option>
          </select>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={loading || !data.subject.trim()}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {t('generating')}
            </>
          ) : (
            t('createLearningPath')
          )}
        </button>
      </div>
    </div>
  );
};

export default LearningPathGenerator;