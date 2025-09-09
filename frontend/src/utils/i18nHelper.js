// Utility functions for internationalization
import { useTranslation } from 'react-i18next';

// Hook to get translation function
export const useI18n = () => {
  const { t, i18n } = useTranslation();
  
  return {
    t,
    changeLanguage: i18n.changeLanguage,
    currentLanguage: i18n.language
  };
};

// Common translation keys mapping
export const commonKeys = {
  // Actions
  'Save': 'save',
  'Cancel': 'cancel',
  'Edit': 'edit',
  'Delete': 'delete',
  'Create': 'create',
  'Search': 'search',
  'Filter': 'filter',
  'Export': 'export',
  'Import': 'import',
  'Submit': 'submit',
  'Close': 'close',
  'Open': 'open',
  'View': 'view',
  'Download': 'download',
  'Upload': 'upload',
  
  // Common UI
  'Loading...': 'loading',
  'Welcome': 'welcome',
  'Dashboard': 'dashboard',
  'Profile': 'profile',
  'Settings': 'settings',
  'Help': 'help',
  'About': 'about',
  'Contact': 'contact',
  'Home': 'home',
  'Back': 'back',
  'Next': 'next',
  'Previous': 'previous',
  'Continue': 'continue',
  
  // Forms
  'Email': 'email',
  'Password': 'password',
  'Name': 'name',
  'First Name': 'firstName',
  'Last Name': 'lastName',
  'Phone': 'phone',
  'Address': 'address',
  'Message': 'message',
  'Subject': 'subject',
  'Description': 'description',
  'Title': 'title',
  
  // Status
  'Success': 'success',
  'Error': 'error',
  'Warning': 'warning',
  'Info': 'info',
  'Active': 'active',
  'Inactive': 'inactive',
  'Pending': 'pending',
  'Completed': 'completed',
  'Failed': 'failed',
  
  // Time
  'Today': 'today',
  'Yesterday': 'yesterday',
  'Tomorrow': 'tomorrow',
  'This Week': 'thisWeek',
  'Last Week': 'lastWeek',
  'This Month': 'thisMonth',
  'Last Month': 'lastMonth',
  'This Year': 'thisYear',
  'Last Year': 'lastYear'
};

// Function to get translation key for common text
export const getTranslationKey = (text) => {
  return commonKeys[text] || text.toLowerCase().replace(/\s+/g, '');
};

// Function to wrap text with translation
export const wrapWithTranslation = (text) => {
  const key = getTranslationKey(text);
  return `{t('${key}')}`;
};