import { Configuration } from '@azure/msal-browser';

const validateAuthConfig = () => {
  const required = ['VITE_AZURE_CLIENT_ID', 'VITE_AZURE_TENANT_ID'];
  const missing = required.filter(key => !import.meta.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

validateAuthConfig();

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${tenantId}`, // Tenant-specific endpoint
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
    validateAuthority: true
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
    secureCookies: true
  },
  system: {
    allowNativeBroker: false,
    windowHashTimeout: 9000,
    iframeHashTimeout: 9000,
    loadFrameTimeout: 9000,
    loggerOptions: {
      logLevel: 3,
      piiLoggingEnabled: false
    }
  }
};