import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Loader } from 'lucide-react';

const AutomatedGrading = ({ onResult, className = "" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    assignment: '',
    answer: '',
    rubric: {
      content: { max: 50, description: 'Content quality and accuracy' },
      organization: { max: 30, description: 'Structure and organization' },
      grammar: { max: 20, description: 'Grammar and language use' }
    }
  });

  const handleGrade = async () => {
    if (!data.assignment.trim() || !data.answer.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/automated-grading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          assignment: data.assignment,
          answer: data.answer,
          rubric: data.rubric,
          language: localStorage.getItem('i18nextLng') || 'en'
        })
      });

      const result = await response.json();
      onResult?.(result);
    } catch (error) {
      console.error('Automated grading failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <GraduationCap className="w-5 h-5 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('automatedGrading')}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('assignmentDescription')}
          </label>
          <textarea
            value={data.assignment}
            onChange={(e) => setData(prev => ({ ...prev, assignment: e.target.value }))}
            className="w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder={t('assignmentPlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('studentAnswer')}
          </label>
          <textarea
            value={data.answer}
            onChange={(e) => setData(prev => ({ ...prev, answer: e.target.value }))}
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder={t('studentAnswerPlaceholder')}
          />
        </div>
        
        <button
          onClick={handleGrade}
          disabled={loading || !data.assignment.trim() || !data.answer.trim()}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {t('grading')}
            </>
          ) : (
            t('gradeAssignment')
          )}
        </button>
      </div>
    </div>
  );
};

export default AutomatedGrading;