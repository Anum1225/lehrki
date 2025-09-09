import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, X, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LiveChat from './LiveChat';

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Live Chat Toggle Button - positioned above ChatBot */}
      <motion.div
        className="fixed bottom-28 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          </motion.div>
          
          {/* Online indicator */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
          </div>
        </motion.button>
        
        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-2 rounded-xl text-sm whitespace-nowrap shadow-lg"
          >
            Live Chat
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-teal-600 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Live Chat Window */}
      <LiveChat 
        roomId="general" 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
};

export default LiveChatWidget;