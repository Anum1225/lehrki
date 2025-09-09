import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.warn('Backend server is not available, using demo mode');
      // Return a mock response for demo purposes
      return Promise.resolve({ data: { demo: true, message: 'Demo mode active' } });
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  auth: {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    me: () => api.get('/auth/me'),
    updateProfile: (userData) => api.patch('/auth/me', userData),
  },
  quizzes: {
    getAll: () => api.get('/quizzes'),
    create: (quizData) => api.post('/quizzes', quizData),
    generate: (requestData) => api.post('/quizzes/generate', requestData),
    getAdaptive: (requestData) => api.post('/ai/adaptive-quiz', requestData),
  },
  parentLetters: {
    getAll: () => api.get('/parent-letters'),
    create: (letterData) => api.post('/parent-letters', letterData),
  },
  analytics: {
    getOverview: () => api.get('/analytics/overview'),
    getMlInsights: () => api.get('/analytics/ml-insights'),
    getPredictions: () => api.get('/analytics/predictions'),
  },
  ai: {
    getStudyPlan: () => api.get('/ai/study-plan'),
    getIntelligentFeedback: (quizResults) => api.post('/ai/intelligent-feedback', quizResults),
  },
  dashboard: {
    getStats: () => api.get('/dashboard/stats'),
  },
  tokens: {
    getBalance: () => api.get('/tokens/balance'),
    getHistory: (page = 1) => api.get(`/tokens/history?page=${page}`),
  },
  payments: {
    createCheckoutSession: (planData) => api.post('/payments/create-checkout-session', planData),
  },
  subscriptions: {
    getCurrent: () => api.get('/tokens/balance'), // Use existing endpoint that includes subscription info
  },
  feedback: {
    submit: (feedbackData) => api.post('/feedback', feedbackData),
  },
  system: {
    health: () => api.get('/system/health'),
    testAll: () => api.get('/system/test-all'),
  },
  chat: {
    send: (chatData) => api.post('/chat', chatData),
  },
};

export default api;