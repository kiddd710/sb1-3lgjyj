import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../lib/auth';
import { useAuthStore } from '../stores/authStore';
import { LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Handle auth callback
    const handleAuthCallback = async () => {
      const verifier = sessionStorage.getItem('pkce_verifier');
      if (verifier) {
        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(verifier);
        if (session && !error) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('azure_id', session.user.id)
            .single();

          if (!userError && userData) {
            setAuth(userData);
            navigate('/dashboard');
          }
        }
        sessionStorage.removeItem('pkce_verifier');
      }
    };

    handleAuthCallback();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('azure_id', session.user.id)
          .single();

        if (!error && userData) {
          setAuth(userData);
          navigate('/dashboard');
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate, setAuth]);

  const login = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const { error } = await handleLogin();
      if (error) throw error;
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <LogIn className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Project Tracker
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in with your organization account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Microsoft'}
          </button>
        </div>
      </div>
    </div>
  );
}