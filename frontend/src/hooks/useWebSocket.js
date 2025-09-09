import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { sanitizeForLog } from '../config/security';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = useCallback(() => {
    if (!user?.id) return;

    const wsUrl = `ws://localhost:8000/ws/${user.id}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
        
        // Handle different message types
        switch (message.type) {
          case 'quiz_completed':
            addNotification({ title: message.data.message, type: 'success' });
            break;
          case 'new_message':
            addNotification({ title: `New message from ${message.data.sender}`, type: 'info' });
            break;
          case 'system_notification':
            addNotification({ title: message.data.message, type: message.data.type });
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', sanitizeForLog(error));
      }
    };

    ws.current.onclose = (event) => {
      setIsConnected(false);
      console.log('WebSocket disconnected:', event.code, event.reason);

      // Attempt to reconnect if not a normal closure
      if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        const delay = 1000 * Math.pow(2, reconnectAttempts.current);
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
        setTimeout(() => {
          connect();
        }, delay);
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', sanitizeForLog(error));
    };
  }, [user?.id, addNotification]);

  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const joinRoom = useCallback((roomId) => {
    sendMessage({ type: 'join_room', room_id: roomId });
  }, [sendMessage]);

  const leaveRoom = useCallback((roomId) => {
    sendMessage({ type: 'leave_room', room_id: roomId });
  }, [sendMessage]);

  const sendChatMessage = useCallback((roomId, message, senderName) => {
    sendMessage({
      type: 'chat_message',
      room_id: roomId,
      message,
      sender_name: senderName
    });
  }, [sendMessage]);

  useEffect(() => {
    connect();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    messages,
    sendMessage,
    joinRoom,
    leaveRoom,
    sendChatMessage
  };
};