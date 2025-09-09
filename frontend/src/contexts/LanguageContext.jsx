import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const { t } = useTranslation();
  
  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ 
      language: i18n.language, 
      changeLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};