import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Brain, Zap, Settings, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdaptiveQuestionGenerator = ({ onResult, className = "" }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    difficulty: 'medium',
    weakAreas: '',
    strongAreas: '',
    questionCount: 5,
    questionTypes: ['multiple_choice']
  });

  const difficultyLevels = [
    { value: 'easy', label: t('easy'), color: 'text-green-600' },
    { value: 'medium', label: t('medium'), color: 'text-yellow-600' },
    { value: 'hard', label: t('hard'), color: 'text-red-600' }
  ];

  const questionTypeOptions = [
    { value: 'multiple_choice', label: t('multipleChoice') },
    { value: 'true_false', label: t('trueFalse') },
    { value: 'short_answer', label: t('shortAnswer') },
    { value: 'essay', label: t('essay') }
  ];

  const handleQuestionTypeChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      questionTypes: checked 
        ? [...prev.questionTypes, type]
        : prev.questionTypes.filter(t => t !== type)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const performance = {
        weak_areas: formData.weakAreas.split(',').map(s => s.trim()).filter(s => s),
        strong_areas: formData.strongAreas.split(',').map(s => s.trim()).filter(s => s),
        question_types: formData.questionTypes,
        question_count: formData.questionCount
      };

      const response = await api.post('/ai/adaptive-questions', {
        difficulty: formData.difficulty,
        subject: formData.subject,
        performance: performance,
        language: 'en'
      });

      onResult?.(response.data);
    } catch (error) {
      console.error('Error generating adaptive questions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('adaptiveQuestionGenerator')}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subject')}
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
            {t('difficultyLevel')}
          </label>
          <div className="flex space-x-4">
            {difficultyLevels.map(level => (
              <label key={level.value} className="flex items-center">
                <input
                  type="radio"
                  name="difficulty"
                  value={level.value}
                  checked={formData.difficulty === level.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="mr-2"
                />
                <span className={`${level.color} font-medium`}>{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('numberOfQuestions')}
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.questionCount}
            onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('questionTypes')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {questionTypeOptions.map(type => (
              <label key={type.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.questionTypes.includes(type.value)}
                  onChange={(e) => handleQuestionTypeChange(type.value, e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('weakAreas')} ({t('commaSeparated')})
            </label>
            <input
              type="text"
              value={formData.weakAreas}
              onChange={(e) => setFormData(prev => ({ ...prev, weakAreas: e.target.value }))}
              placeholder={t('algebra')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('strongAreas')} ({t('commaSeparated')})
            </label>
            <input
              type="text"
              value={formData.strongAreas}
              onChange={(e) => setFormData(prev => ({ ...prev, strongAreas: e.target.value }))}
              placeholder={t('geometry')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">{t('adaptiveFeature')}</span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {t('adaptiveDescription')}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.subject || formData.questionTypes.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('generating')}</span>
            </>
          ) : (
            <>
              <Settings className="w-4 h-4" />
              <span>{t('generateQuestions')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default AdaptiveQuestionGenerator;