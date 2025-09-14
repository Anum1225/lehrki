import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import QuizCreator from './pages/QuizCreator';
import AssessmentCenter from './pages/AssessmentCenter';
import CommunityForum from './pages/CommunityForum';
import Analytics from './pages/Analytics';
import AIServices from './pages/AIServices';

import Login from './pages/Login';
import Register from './pages/Register';
import ParentLetterGenerator from './pages/ParentLetterGenerator';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import LiveChatWidget from './components/LiveChatWidget';


// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { MembershipProvider } from './contexts/MembershipContext';
import './i18n';
import './styles/globals.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <MembershipProvider>
                <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/teacher-dashboard" 
                element={
                  <ProtectedRoute>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin-dashboard"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/student-dashboard" 
                element={
                  <ProtectedRoute>
                    <StudentDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quiz-creator" 
                element={
                  <ProtectedRoute>
                    <QuizCreator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/assessment" 
                element={
                  <ProtectedRoute>
                    <AssessmentCenter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute>
                    <CommunityForum />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute requiredFeature="advanced_analytics">
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ai-services"
                element={
                  <ProtectedRoute requiredFeature="ai_quiz_generation">
                    <AIServices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parent-letters"
                element={
                  <ProtectedRoute requiredFeature="parent_letter_generation">
                    <ParentLetterGenerator />
                  </ProtectedRoute>
                }
              />
              <Route path="/pro" element={<Pricing />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <LiveChatWidget />
            <ChatBot />
            <Toaster position="top-right" />
          </div>
                </Router>
              </MembershipProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;