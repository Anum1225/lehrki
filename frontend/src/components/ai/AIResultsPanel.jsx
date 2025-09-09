import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bot } from 'lucide-react';

const AIResultsPanel = ({ results, activeService, className = "" }) => {
  const { t } = useTranslation();

  const renderSummaryResults = (summary) => (
    <div className="space-y-3">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('summary')}</h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">{summary.summary}</p>
      </div>
      {summary.key_points && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{t('keyPoints')}</h3>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            {summary.key_points.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderLearningPathResults = (learningPath) => (
    <div className="space-y-3">
      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">{t('learningPathCreated')}</h3>
        <p className="text-sm text-green-800 dark:text-green-200">
          {t('duration')}: {learningPath.total_duration}
        </p>
      </div>
      {learningPath.learning_path && Object.keys(learningPath.learning_path).length > 0 && (
        <div className="space-y-2">
          {Object.entries(learningPath.learning_path).map(([phase, details]) => (
            <div key={phase} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                {details.title || phase}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {details.duration}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGradingResults = (grading) => (
    <div className="space-y-3">
      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">{t('grade')}</h3>
        <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
          {grading.overall_score}/{grading.max_score}
        </div>
        <div className="text-sm text-purple-700 dark:text-purple-300">
          {grading.grade_letter}
        </div>
      </div>
      {grading.strengths && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="font-medium text-green-900 dark:text-green-100 mb-2 text-sm">{t('strengths')}</h3>
          <ul className="text-xs text-green-800 dark:text-green-200 space-y-1">
            {grading.strengths.map((strength, index) => (
              <li key={index}>• {strength}</li>
            ))}
          </ul>
        </div>
      )}
      {grading.improvements && (
        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <h3 className="font-medium text-orange-900 dark:text-orange-100 mb-2 text-sm">{t('areasForImprovement')}</h3>
          <ul className="text-xs text-orange-800 dark:text-orange-200 space-y-1">
            {grading.improvements.map((improvement, index) => (
              <li key={index}>• {improvement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
      <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p className="text-sm">{t('resultsWillAppear')}</p>
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('results')}
      </h2>
      
      {results?.summary && activeService === 'summarizer' && renderSummaryResults(results.summary)}
      {results?.learningPath && activeService === 'learning-path' && renderLearningPathResults(results.learningPath)}
      {results?.grading && activeService === 'grading' && renderGradingResults(results.grading)}
      
      {!results?.summary && !results?.learningPath && !results?.grading && renderEmptyState()}
    </div>
  );
};

export default AIResultsPanel;