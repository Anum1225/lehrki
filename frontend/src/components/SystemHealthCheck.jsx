import { useEffect } from 'react';
import { apiService } from '../services/api';
import { sanitizeForLog } from '../config/security';

const SystemHealthCheck = () => {
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      const response = await apiService.system.health();
      console.log('System Health Check:', response.data);
    } catch (error) {
      console.error('System Health Check Failed:', sanitizeForLog(error.message));
    }
  };

  return null; // No UI rendering
};

export default SystemHealthCheck;