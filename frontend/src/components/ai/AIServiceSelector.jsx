import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, MapPin, GraduationCap } from 'lucide-react';

const AIServiceSelector = ({ activeService, onServiceChange, className = "" }) => {
  const { t } = useTranslation();

  const services = [
    {
      id: 'summarizer',
      title: t('contentSummarizer'),
      description: t('contentSummarizerDesc'),
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'learning-path',
      title: t('learningPathGenerator'),
      description: t('learningPathGeneratorDesc'),
      icon: MapPin,
      color: 'green'
    },
    {
      id: 'grading',
      title: t('automatedGrading'),
      description: t('automatedGradingDesc'),
      icon: GraduationCap,
      color: 'purple'
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700' 
        : 'bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10',
      green: isActive 
        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700' 
        : 'bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/10',
      purple: isActive 
        ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-700' 
        : 'bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/10'
    };
    return colors[color];
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('availableServices')}
      </h2>
      <div className="space-y-2">
        {services.map((service) => {
          const Icon = service.icon;
          const isActive = activeService === service.id;
          
          return (
            <button
              key={service.id}
              onClick={() => onServiceChange(service.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${getColorClasses(service.color, isActive)}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${
                  service.color === 'blue' ? 'text-blue-600' :
                  service.color === 'green' ? 'text-green-600' :
                  'text-purple-600'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                    {service.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {service.description}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AIServiceSelector;