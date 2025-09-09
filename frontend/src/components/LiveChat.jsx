import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { useAuth } from '../contexts/AuthContext';

const LiveChat = ({ roomId = 'general', isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const { user } = useAuth();
  const { isConnected, messages, sendChatMessage, joinRoom, leaveRoom } = useWebSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (isOpen && roomId) {
      joinRoom(roomId);
    }
    
    return () => {
      if (roomId) {
        leaveRoom(roomId);
      }
    };
  }, [isOpen, roomId, joinRoom, leaveRoom]);

  useEffect(() => {
    // Filter messages for this room
    const roomMessages = messages.filter(msg => {
      if (msg.type === 'new_message') {
        // Handle both direct messages and room messages
        return msg.data.room_id === roomId;
      }
      return false;
    });

    if (roomMessages.length > 0) {
      const formattedMessages = roomMessages.map(msg => ({
        id: msg.data.timestamp || Date.now(),
        sender: msg.data.sender || 'Unknown',
        message: msg.data.message || '',
        timestamp: msg.data.timestamp || new Date().toISOString(),
        isOwn: false
      }));

      setChatMessages(prev => {
        // Avoid duplicates
        const existingIds = new Set(prev.map(m => m.id));
        const newMessages = formattedMessages.filter(m => !existingIds.has(m.id));
        return [...prev, ...newMessages];
      });
    }
  }, [messages, roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    const newMessage = {
      id: Date.now(),
      sender: user?.first_name || 'Anonymous',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true
    };

    setChatMessages(prev => [...prev, newMessage]);
    sendChatMessage(roomId, message.trim(), user?.first_name || 'Anonymous');
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-28 right-20 w-80 h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg flex flex-col z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.isOwn
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                {!msg.isOwn && (
                  <div className="font-semibold text-xs mb-1 opacity-75">
                    {msg.sender}
                  </div>
                )}
                <div>{msg.message}</div>
                <div className="text-xs opacity-75 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-gray-600">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={!message.trim() || !isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveChat;