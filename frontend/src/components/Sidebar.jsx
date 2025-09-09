import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import LiveChat from './LiveChat';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Activity,
  Shield,
  Database,
  GraduationCap,
  PlusCircle,
  Target,
  FileText,
  Calendar,
  Award,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();
  const { t } = useTranslation();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const getNavigationItems = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', icon: Home, href: '/admin-dashboard' },
        { name: 'Admin Panel', icon: Shield, href: '/admin' },
        { name: 'Quiz Creator', icon: BookOpen, href: '/quiz-creator' },
        { name: 'Assessment', icon: BarChart3, href: '/assessment' },
        { name: 'Community', icon: MessageSquare, href: '/community' },
        { name: 'Analytics', icon: TrendingUp, href: '/analytics' },
        { name: 'Advanced Analytics', icon: Activity, href: '/advanced-analytics' },
        { name: 'Profile', icon: Users, href: '/profile' },
        { name: 'Pricing', icon: CreditCard, href: '/pricing' }
      ];
    }

    if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', icon: Home, href: '/teacher-dashboard' },
        { name: 'Quiz Creator', icon: BookOpen, href: '/quiz-creator' },
        { name: 'Assessment', icon: BarChart3, href: '/assessment' },
        { name: 'Parent Letters', icon: FileText, href: '/parent-letters' },
        { name: 'Community', icon: MessageSquare, href: '/community' },
        { name: 'Analytics', icon: TrendingUp, href: '/analytics' },
        { name: 'Advanced Analytics', icon: Activity, href: '/advanced-analytics' },
        { name: 'Profile', icon: Users, href: '/profile' }
      ];
    }

    // Student role
    return [
      { name: 'Dashboard', icon: Home, href: '/student-dashboard' },
      { name: 'Assessment', icon: BarChart3, href: '/assessment' },
      { name: 'Community', icon: MessageSquare, href: '/community' },
      { name: 'Analytics', icon: TrendingUp, href: '/analytics' },
      { name: 'Profile', icon: Users, href: '/profile' },
      { name: 'Pricing', icon: CreditCard, href: '/pricing' }
    ];
  };

  const getDashboardRoute = () => {
    if (user?.role === 'admin') return '/admin-dashboard';
    if (user?.role === 'teacher') return '/teacher-dashboard';
    if (user?.role === 'student') return '/student-dashboard';
    return '/dashboard';
  };

  const navigationItems = getNavigationItems();

  const isActive = (href) => {
    return location.pathname === href;
  };

  const filteredNavigationItems = navigationItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSignOut = () => {
    logout();
    addNotification({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been successfully signed out'
    });
  };

  const getThemeColors = () => {
    switch (user?.role) {
      case 'admin':
        return {
          primary: 'from-slate-600 to-slate-800',
          accent: 'bg-slate-100 text-slate-800',
          hover: 'hover:bg-slate-100',
          active: 'bg-slate-200 text-slate-900'
        };
      case 'teacher':
        return {
          primary: 'from-blue-600 to-purple-600',
          accent: 'bg-blue-100 text-blue-800',
          hover: 'hover:bg-blue-50',
          active: 'bg-blue-100 text-blue-900'
        };
      case 'student':
        return {
          primary: 'from-indigo-600 to-purple-600',
          accent: 'bg-indigo-100 text-indigo-800',
          hover: 'hover:bg-indigo-50',
          active: 'bg-indigo-100 text-indigo-900'
        };
      default:
        return {
          primary: 'from-blue-600 to-purple-600',
          accent: 'bg-blue-100 text-blue-800',
          hover: 'hover:bg-blue-50',
          active: 'bg-blue-100 text-blue-900'
        };
    }
  };

  const theme = getThemeColors();

  return (
    <motion.div
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full bg-white shadow-xl border-r border-gray-200 z-40"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${theme.primary} rounded-lg flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">D</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">LehrKI</h1>
                    <p className="text-xs text-gray-500 capitalize">{user?.role || 'User'} Portal</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 border-b border-gray-200"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('search') + '...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavigationItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? theme.active
                    : `text-gray-700 ${theme.hover}`
                }`}
              >
                <item.icon className={`h-5 w-5 ${
                  isActive(item.href) ? 'text-current' : 'text-gray-500 group-hover:text-gray-700'
                }`} />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute right-0 w-1 h-8 bg-gradient-to-b ${theme.primary} rounded-l-full`}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center space-x-3 p-3 rounded-lg ${theme.accent}`}>
            <div className={`w-10 h-10 bg-gradient-to-r ${theme.primary} rounded-full flex items-center justify-center`}>
              <span className="text-white font-semibold text-sm">
                {user?.first_name?.charAt(0) || 'U'}
              </span>
            </div>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-600 truncate capitalize">
                    {user?.role || 'User'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={handleSignOut}
              className={`p-2 rounded-lg transition-colors ${theme.hover} group`}
              title={t('logout')}
            >
              <LogOut className="h-4 w-4 text-gray-600 group-hover:text-red-600" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Live Chat */}
      <LiveChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        roomId="general" 
      />
      

    </motion.div>
  );
};

export default Sidebar;
