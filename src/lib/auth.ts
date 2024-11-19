import { AuthError } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { handleError } from './security';
import { PKCEManager } from './auth/pkce';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function handleLogin() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email profile openid',
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          response_type: 'code',
          response_mode: 'query',
          domain_hint: import.meta.env.VITE_AZURE_TENANT_ID,
          tenant: import.meta.env.VITE_AZURE_TENANT_ID,
        }
      }
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Login failed:', error);
    return { data: null, error: handleError(error) };
  }
}

export async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout failed:', error);
    throw handleError(error);
  }
}