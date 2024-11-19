import xss from 'xss';
import { rateLimit } from './rateLimit';

// Security configuration
export const securityConfig = {
  apiRateLimit: parseInt(import.meta.env.VITE_API_RATE_LIMIT || '100'),
  apiRateWindow: parseInt(import.meta.env.VITE_API_RATE_WINDOW || '60000'),
  sessionDuration: parseInt(import.meta.env.VITE_SESSION_DURATION || '3600000'),
  authCookieName: import.meta.env.VITE_AUTH_COOKIE_NAME || '__Host-auth-token',
  cspNonce: import.meta.env.VITE_CSP_NONCE || 'random-nonce-123'
};

// Input sanitization
export function sanitizeInput(input: string): string {
  return xss(input.trim());
}

// Error handling
export function handleError(error: any): { message: string; code?: string } {
  console.error('Error details:', {
    error,
    message: error.message,
    stack: error.stack
  });

  return {
    message: 'An error occurred. Please try again later.',
    code: error.code
  };
}

// Role-based access control
export function checkPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'Project_Workflow_Operations_Managers': 3,
    'Project_Workflow_Project_Managers': 2,
    'default_role': 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

// Session management
export function validateSession(token: string): boolean {
  try {
    // Add session validation logic here
    return true;
  } catch (error) {
    console.error('Session validation error:', error);
    return false;
  }
}

// Security headers
export const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'nonce-${securityConfig.cspNonce}';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https://ui-avatars.com https://*.supabase.co;
    connect-src 'self' https://*.supabase.co https://*.microsoft.com https://login.microsoftonline.com;
    frame-src https://login.microsoftonline.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};