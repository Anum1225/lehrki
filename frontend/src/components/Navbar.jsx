import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Menu, 
  X, 
  BookOpen, 
  Brain, 
  Users, 
  BarChart3, 
  User,
  LogOut,
  Settings,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const navigation = [
    { name: t('features'), href: '#features', current: false },
    { name: t('pricing'), href: '#pricing', current: false },
    { name: t('about'), href: '#about', current: false },
    { name: t('contact'), href: '#contact', current: false },
  ];

  const getUserNavigation = () => {
    const baseNavigation = [
      { name: t('aiServices'), href: '/ai-services', icon: Sparkles },
      { name: t('quizCreator'), href: '/quiz-creator', icon: BookOpen },
      { name: t('assessmentCenter'), href: '/assessment', icon: BarChart3 },
      { name: t('community'), href: '/community', icon: Users },
      { name: t('analytics'), href: '/analytics', icon: BarChart3 },
    ];

    const dashboardRoute = user?.role === 'admin' ? '/admin-dashboard' 
      : user?.role === 'teacher' ? '/teacher-dashboard'
      : user?.role === 'student' ? '/student-dashboard'
      : '/dashboard';

    return [
      { name: t('dashboard'), href: dashboardRoute, icon: Brain },
      ...baseNavigation
    ];
  };

  const userNavigation = getUserNavigation();

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  LehrKI
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            {!isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-gray-900 px-2 py-1 text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            )}

            {/* Authenticated User Navigation */}
            {isAuthenticated && (
              <div className="hidden md:ml-10 md:flex md:space-x-1">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-gray-700 hover:text-gray-900 px-2 py-1 text-sm font-medium transition-colors flex items-center"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center text-sm p-1 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                    <span className="text-gray-700 font-medium text-sm">
                      {user?.first_name?.[0] || user?.email?.[0] || 'U'}
                    </span>
                  </div>
                </button>

                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      {user?.email}
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('profile')}
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('settings')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('signout')}
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-800 px-2 py-1 text-sm font-medium transition-colors"
                >
                  {t('signin')}
                </Link>
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 px-2 py-1 text-sm font-medium transition-colors"
                >
                  {t('getStarted')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {isAuthenticated ? (
              <>
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('signout')}
                </button>
              </>
            ) : (
              <>
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t('signin')}
                </Link>
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 block px-3 py-2 text-base font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {t('getStarted')}
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;