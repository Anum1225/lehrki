import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContentSummarizer from '../components/ai/ContentSummarizer';
import LearningPathGenerator from '../components/ai/LearningPathGenerator';
import AutomatedGrading from '../components/ai/AutomatedGrading';
import AIResultsPanel from '../components/ai/AIResultsPanel';
import AIServiceSelector from '../components/ai/AIServiceSelector';
import StudyScheduler from '../components/ai/StudyScheduler';
import PerformancePredictor from '../components/ai/PerformancePredictor';
import AdaptiveQuestionGenerator from '../components/ai/AdaptiveQuestionGenerator';

const AIServices = () => {
  const { t } = useTranslation();
  const [activeService, setActiveService] = useState('summarizer');
  const [results, setResults] = useState({});

  const handleResult = (result, type) => {
    setResults(prev => ({ ...prev, [type]: result }));
  };

  const renderActiveService = () => {
    switch (activeService) {
      case 'summarizer':
        return <ContentSummarizer onResult={(result) => handleResult(result, 'summary')} />;
      case 'learning-path':
        return <LearningPathGenerator onResult={(result) => handleResult(result, 'learningPath')} />;
      case 'grading':
        return <AutomatedGrading onResult={(result) => handleResult(result, 'grading')} />;
      case 'scheduler':
        return <StudyScheduler onResult={(result) => handleResult(result, 'schedule')} />;
      case 'predictor':
        return <PerformancePredictor onResult={(result) => handleResult(result, 'prediction')} />;
      case 'adaptive':
        return <AdaptiveQuestionGenerator onResult={(result) => handleResult(result, 'adaptiveQuestions')} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('aiServicesTitle')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('aiServicesDescription')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <AIServiceSelector 
            activeService={activeService}
            onServiceChange={setActiveService}
            className="lg:col-span-1"
          />
          
          <div className="lg:col-span-2">
            {renderActiveService()}
          </div>
          
          <AIResultsPanel 
            results={results}
            activeService={activeService}
            className="lg:col-span-1"
          />
        </div>
      </div>
    </div>
  );
};

export default AIServices;