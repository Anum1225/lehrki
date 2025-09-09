// Security configuration and utilities

// Content Security Policy headers
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' ws: wss:",
    "frame-ancestors 'none'"
  ].join('; ')
};

// Input sanitization utility
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Log sanitization utility
export const sanitizeForLog = (data) => {
  if (typeof data === 'object') {
    try {
      return JSON.stringify(data, (key, value) => {
        // Remove sensitive fields from logs
        if (['password', 'token', 'secret', 'key'].includes(key.toLowerCase())) {
          return '[REDACTED]';
        }
        return value;
      });
    } catch (error) {
      return '[OBJECT_STRINGIFY_ERROR]';
    }
  }
  
  if (typeof data === 'string') {
    // Remove potential log injection patterns
    return data
      .replace(/[\r\n]/g, ' ')
      .replace(/\x00/g, '')
      .substring(0, 1000); // Limit log length
  }
  
  return String(data);
};

// Environment validation
export const validateEnvironment = () => {
  // Demo environment variables are no longer required since demo functionality was removed
  const optionalEnvVars = [
    'REACT_APP_DEMO_ADMIN_PASSWORD',
    'REACT_APP_DEMO_TEACHER_PASSWORD',
    'REACT_APP_DEMO_STUDENT_PASSWORD'
  ];

  // Check for any critical environment variables that might be needed
  const criticalEnvVars = [
    // Add any critical environment variables here if needed in the future
  ];

  const missing = criticalEnvVars.filter(envVar => !import.meta.env[envVar]);

  if (missing.length > 0) {
    console.warn('Missing critical environment variables:', missing);
    return false;
  }

  return true;
};

// CSRF token utilities
export const getCSRFToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
};

export const setCSRFToken = (token) => {
  let meta = document.querySelector('meta[name="csrf-token"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'csrf-token';
    document.head.appendChild(meta);
  }
  meta.content = token;
};

// Rate limiting utility (client-side)
class RateLimiter {
  constructor(maxRequests = 100, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}

export const apiRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute