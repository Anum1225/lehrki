import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Loader } from 'lucide-react';

const ContentSummarizer = ({ onResult, className = "" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    content: '',
    type: 'brief'
  });

  const handleSummarize = async () => {
    if (!data.content.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/ai/summarize-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: data.content,
          type: data.type,
          language: localStorage.getItem('i18nextLng') || 'en'
        })
      });

      const result = await response.json();
      onResult?.(result);
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <FileText className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('contentSummarizer')}
        </h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('contentToSummarize')}
          </label>
          <textarea
            value={data.content}
            onChange={(e) => setData(prev => ({ ...prev, content: e.target.value }))}
            className="w-full h-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
            placeholder={t('contentPlaceholder')}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('summaryType')}
          </label>
          <select
            value={data.type}
            onChange={(e) => setData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="brief">{t('briefSummary')}</option>
            <option value="detailed">{t('detailedSummary')}</option>
            <option value="bullet_points">{t('bulletPoints')}</option>
            <option value="study_notes">{t('studyNotes')}</option>
          </select>
        </div>
        
        <button
          onClick={handleSummarize}
          disabled={loading || !data.content.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {t('summarizing')}
            </>
          ) : (
            t('generateSummary')
          )}
        </button>
      </div>
    </div>
  );
};

export default ContentSummarizer;