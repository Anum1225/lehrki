import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getCSRFToken, apiRateLimiter, validateEnvironment } from '../config/security';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Set up axios defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Add CSRF token and rate limiting to requests
axios.interceptors.request.use((config) => {
  // Rate limiting check
  if (!apiRateLimiter.isAllowed()) {
    return Promise.reject(new Error('Rate limit exceeded'));
  }
  
  // Add CSRF token
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
  }
  
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  // Validate environment on initialization
  useEffect(() => {
    validateEnvironment();
  }, []);

  // Demo users data
  const demoUsers = {
    'admin@devchef.com': {
      id: 'admin-demo',
      email: 'admin@devchef.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      language_preference: 'en',
      profile_image_url: null,
      created_at: new Date().toISOString(),
      token_balance: 5000
    },
    'teacher@devchef.com': {
      id: 'teacher-demo',
      email: 'teacher@devchef.com',
      first_name: 'Teacher',
      last_name: 'Demo',
      role: 'teacher',
      language_preference: 'en',
      profile_image_url: null,
      created_at: new Date().toISOString(),
      token_balance: 2000
    },
    'student@devchef.com': {
      id: 'student-demo',
      email: 'student@devchef.com',
      first_name: 'Student',
      last_name: 'Demo',
      role: 'student',
      language_preference: 'en',
      profile_image_url: null,
      created_at: new Date().toISOString(),
      token_balance: 100
    }
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      // Check if it's a demo token
      if (token && token.startsWith('demo-token-')) {
        // Restore demo user from localStorage
        const storedUser = localStorage.getItem('demo-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
        return;
      }
      
      const response = await axios.get('/auth/me');
      // Backend returns UserResponse directly
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {

    const demoUsers = {
      'admin@devchef.com': {
        password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'admin123',
        user: {
          id: 'admin-demo',
          email: 'admin@devchef.com',
          first_name: 'Admin',
          last_name: 'User',
          role: 'admin',
          language_preference: 'en',
          profile_image_url: null,
          created_at: new Date().toISOString(),
          token_balance: 5000
        }
      },
      'teacher@devchef.com': {
        password: import.meta.env.VITE_DEMO_TEACHER_PASSWORD || 'teacher123',
        user: {
          id: 'teacher-demo',
          email: 'teacher@devchef.com',
          first_name: 'Teacher',
          last_name: 'Demo',
          role: 'teacher',
          language_preference: 'en',
          profile_image_url: null,
          created_at: new Date().toISOString(),
          token_balance: 2000
        }
      },
      'student@devchef.com': {
        password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD || 'student123',
        user: {
          id: 'student-demo',
          email: 'student@devchef.com',
          first_name: 'Student',
          last_name: 'Demo',
          role: 'student',
          language_preference: 'en',
          profile_image_url: null,
          created_at: new Date().toISOString(),
          token_balance: 100
        }
      }
    };

    // Check demo credentials first
    const demoCredentials = {
      'admin@devchef.com': import.meta.env.VITE_DEMO_ADMIN_PASSWORD || 'admin123',
      'teacher@devchef.com': import.meta.env.VITE_DEMO_TEACHER_PASSWORD || 'teacher123',
      'student@devchef.com': import.meta.env.VITE_DEMO_STUDENT_PASSWORD || 'student123'
    };
    
    if (demoCredentials[email] && demoCredentials[email] === password) {
      const demoUserData = demoUsers[email];
      const demoToken = `demo-token-${Date.now()}`;
      
      localStorage.setItem('token', demoToken);
      localStorage.setItem('demo-user', JSON.stringify(demoUserData.user));
      setToken(demoToken);
      setUser(demoUserData.user);
      
     // Redirect to role-specific dashboard
      const roleRoutes = {
        'admin': '/admin-dashboard',
        'teacher': '/teacher-dashboard', 
        'student': '/student-dashboard'
      };
    
      toast.success(`Welcome ${demoUserData.user.first_name}! (Demo Mode)`);
      return { success: true, user: demoUserData.user };
    }

    // Fallback to backend API if not demo credentials
    try {
      const response = await axios.post('/auth/login', { email, password });
      // Backend returns { access_token, user }
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      toast.success('Login successful!');
      return { success: true, user: userData };
    } catch (error) {
      console.warn('Backend login failed:', error.message);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (email, password, firstName, lastName, role = 'student') => {
    try {
      const response = await axios.post('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        role
      });
      
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      toast.success('Registration successful!');
      return { success: true, user: userData };
    } catch (error) {
      // Fallback to demo mode if backend is not available
      console.warn('Backend registration failed, using demo mode:', error.message);
      
      const demoUser = {
        id: `demo-${Date.now()}`,
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        language_preference: 'en',
        profile_image_url: null,
        created_at: new Date().toISOString(),
        token_balance: role === 'teacher' ? 1000 : 100
      };
      
      const demoToken = `demo-token-${Date.now()}`;
      
      localStorage.setItem('token', demoToken);
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      setToken(demoToken);
      setUser(demoUser);
      
      toast.success('Registration successful! (Demo Mode)');
      return { success: true, user: demoUser };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('demo-user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateUser = async (userData) => {
    try {
      const response = await axios.patch('/auth/me', userData);
      setUser(response.data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};