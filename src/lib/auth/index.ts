import { PublicClientApplication } from '@azure/msal-browser';
import { supabase } from '../supabase';
import { handleError } from '../security';
import { NonceManager } from './nonceManager';
import { SessionManager } from './sessionManager';
import { TokenManager } from './tokenManager';

const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;

// Configure MSAL specifically for single-tenant
const msalConfig = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`, // Tenant-specific endpoint
    redirectUri: window.location.origin,
    navigateToLoginRequestUrl: true,
    postLogoutRedirectUri: window.location.origin,
    validateAuthority: true
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
    secureCookies: true
  }
};

const msalInstance = new PublicClientApplication(msalConfig);

export async function handleLogin() {
  try {
    const nonce = NonceManager.generateNonce();
    
    const loginConfig = {
      scopes: ['User.Read', 'profile', 'openid', 'email'],
      prompt: 'select_account',
      nonce,
      authority: `https://login.microsoftonline.com/${tenantId}`, // Ensure tenant-specific login
      extraQueryParameters: {
        domain_hint: tenantId // Force specific tenant
      }
    };

    const result = await msalInstance.loginPopup(loginConfig);
    
    if (!result.account) {
      throw new Error('No account information received');
    }

    const { data: session, error: supabaseError } = await supabase.auth.signInWithIdToken({
      provider: 'azure',
      token: result.idToken,
      nonce: result.idTokenClaims?.nonce
    });

    if (supabaseError) throw supabaseError;

    if (session?.access_token && session?.refresh_token) {
      TokenManager.storeTokens(
        session.access_token,
        session.refresh_token,
        session.expires_in || 3600
      );
      SessionManager.initSession(session.user.id);
    }

    return { session, error: null };
  } catch (error) {
    console.error('Login failed:', error);
    return { session: null, error: handleError(error) };
  }
}

export async function handleLogout() {
  try {
    SessionManager.clearSession();
    TokenManager.clearTokens();
    NonceManager.clearNonces();

    await Promise.all([
      supabase.auth.signOut(),
      msalInstance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
        authority: `https://login.microsoftonline.com/${tenantId}` // Ensure tenant-specific logout
      })
    ]);
  } catch (error) {
    console.error('Logout failed:', error);
    throw handleError(error);
  }
}