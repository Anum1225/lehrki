import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, BookOpen, Loader2 } from 'lucide-react';
import api from '../../services/api';

const StudyScheduler = ({ onResult, className = "" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjects: [''],
    availableHours: 10,
    preferences: {
      preferredTime: 'morning',
      breakDuration: 15,
      studySessionLength: 60
    }
  });

  const addSubject = () => {
    setFormData(prev => ({
      ...prev,
      subjects: [...prev.subjects, '']
    }));
  };

  const updateSubject = (index, value) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.map((subject, i) => i === index ? value : subject)
    }));
  };

  const removeSubject = (index) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const filteredSubjects = formData.subjects.filter(s => s.trim());
      const response = await api.post('/ai/study-schedule', {
        subjects: filteredSubjects,
        available_hours: formData.availableHours,
        preferences: formData.preferences,
        language: 'en'
      });

      onResult?.(response.data);
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('studyScheduler')}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subjects')}
          </label>
          {formData.subjects.map((subject, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={subject}
                onChange={(e) => updateSubject(index, e.target.value)}
                placeholder={t('enterSubject')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {formData.subjects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSubject}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + {t('addSubject')}
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('availableHoursPerWeek')}
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={formData.availableHours}
            onChange={(e) => setFormData(prev => ({ ...prev, availableHours: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('preferences')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.preferences.preferredTime}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, preferredTime: e.target.value }
              }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="morning">{t('morning')}</option>
              <option value="afternoon">{t('afternoon')}</option>
              <option value="evening">{t('evening')}</option>
            </select>
            
            <input
              type="number"
              min="5"
              max="30"
              value={formData.preferences.breakDuration}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, breakDuration: parseInt(e.target.value) }
              }))}
              placeholder={t('breakMinutes')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            
            <input
              type="number"
              min="30"
              max="120"
              value={formData.preferences.studySessionLength}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, studySessionLength: parseInt(e.target.value) }
              }))}
              placeholder={t('sessionMinutes')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.subjects.some(s => s.trim())}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('generating')}</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              <span>{t('generateSchedule')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StudyScheduler;