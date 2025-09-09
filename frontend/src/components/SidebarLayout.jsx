import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import ChatBot from './ChatBot';

const SidebarLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content */}
      <motion.div
        initial={{ marginLeft: isCollapsed ? 80 : 280 }}
        animate={{ marginLeft: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-1 flex flex-col"
      >
        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </motion.div>
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default SidebarLayout;
