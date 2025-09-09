import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import ContentSummarizer from './ContentSummarizer';
import LearningPathGenerator from './LearningPathGenerator';
import AutomatedGrading from './AutomatedGrading';
import AIResultsPanel from './AIResultsPanel';
import StudyScheduler from './StudyScheduler';
import PerformancePredictor from './PerformancePredictor';
import AdaptiveQuestionGenerator from './AdaptiveQuestionGenerator';

const AIWidget = ({ defaultService = 'summarizer', className = "" }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeService, setActiveService] = useState(defaultService);
  const [results, setResults] = useState({});

  const handleResult = (result, type) => {
    setResults(prev => ({ ...prev, [type]: result }));
  };

  const services = [
    { id: 'summarizer', name: t('contentSummarizer'), icon: '📄' },
    { id: 'learning-path', name: t('learningPathGenerator'), icon: '🛤️' },
    { id: 'grading', name: t('automatedGrading'), icon: '📝' },
    { id: 'scheduler', name: t('studyScheduler'), icon: '📅' },
    { id: 'predictor', name: t('performancePredictor'), icon: '📈' },
    { id: 'adaptive', name: t('adaptiveQuestions'), icon: '🧠' }
  ];

  const renderService = () => {
    const getResultType = () => {
      switch (activeService) {
        case 'summarizer': return 'summary';
        case 'learning-path': return 'learningPath';
        case 'grading': return 'grading';
        case 'scheduler': return 'schedule';
        case 'predictor': return 'prediction';
        case 'adaptive': return 'adaptiveQuestions';
        default: return activeService;
      }
    };
    
    const props = { onResult: (result) => handleResult(result, getResultType()), className: "border-0 shadow-none p-0" };
    
    switch (activeService) {
      case 'summarizer': return <ContentSummarizer {...props} />;
      case 'learning-path': return <LearningPathGenerator {...props} />;
      case 'grading': return <AutomatedGrading {...props} />;
      case 'scheduler': return <StudyScheduler {...props} />;
      case 'predictor': return <PerformancePredictor {...props} />;
      case 'adaptive': return <AdaptiveQuestionGenerator {...props} />;
      default: return null;
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all z-50 ${className}`}
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} transition-all ${className}`}>
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-900 dark:text-white">{t('aiServices')}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex flex-col h-[calc(100%-4rem)]">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {services.map(service => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.id)}
                className={`flex-1 p-2 text-xs font-medium transition-colors ${
                  activeService === service.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="mr-1">{service.icon}</span>
                {service.name}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4">
                {renderService()}
              </div>
              
              {Object.keys(results).length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                  <AIResultsPanel 
                    results={results} 
                    activeService={activeService} 
                    className="border-0 shadow-none p-0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWidget;