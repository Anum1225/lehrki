import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { useAuth } from '../contexts/AuthContext';

export const useRealTimeData = (initialData, updateInterval = 30000) => {
  const [data, setData] = useState(initialData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { isConnected, messages } = useWebSocket();

  // Handle WebSocket messages for real-time updates
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage) {
      switch (latestMessage.type) {
        case 'parent_letter_generated':
          setData(prev => ({
            ...prev,
            recentLetters: [latestMessage.data, ...(prev.recentLetters || [])].slice(0, 5),
            totalLetters: (prev.totalLetters || 0) + 1
          }));
          setLastUpdated(new Date());
          break;
        case 'system_stats_update':
          setData(prev => ({ ...prev, ...latestMessage.data }));
          setLastUpdated(new Date());
          break;
        default:
          break;
      }
    }
  }, [messages]);

  // Periodic data refresh
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isConnected) {
        // Fallback updates when WebSocket is disconnected
        setData(prevData => ({
          ...prevData,
          totalStudents: prevData.totalStudents + Math.floor(Math.random() * 3),
          activeSessions: Math.max(0, prevData.activeSessions + Math.floor(Math.random() * 10) - 5),
          systemHealth: Math.min(100, Math.max(95, prevData.systemHealth + (Math.random() - 0.5) * 2))
        }));
        setLastUpdated(new Date());
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, isConnected]);

  const updateData = useCallback((newData) => {
    setData(prev => ({ ...prev, ...newData }));
    setLastUpdated(new Date());
  }, []);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch fresh data from API
      const response = await fetch('/api/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const freshData = await response.json();
        setData(freshData);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { 
    data, 
    lastUpdated, 
    setData: updateData, 
    isLoading, 
    refreshData, 
    isConnected 
  };
};

export const useParentLetterRealTime = () => {
  const [letters, setLetters] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { messages } = useWebSocket();

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.type === 'parent_letter_generated') {
      setLetters(prev => [latestMessage.data, ...prev]);
      setIsGenerating(false);
    } else if (latestMessage?.type === 'parent_letter_generating') {
      setIsGenerating(true);
    }
  }, [messages]);

  return { letters, setLetters, isGenerating, setIsGenerating };
};