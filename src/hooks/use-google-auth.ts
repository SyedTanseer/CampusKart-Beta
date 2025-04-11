import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

interface GoogleUser {
  id: string;
  name: string;
  email: string;
  picture: string;
}

export const useGoogleAuth = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [googleError, setGoogleError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('googleUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('googleUser');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info using the access token
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userData = await response.json();
        const googleUser: GoogleUser = {
          id: userData.sub,
          name: userData.name,
          email: userData.email,
          picture: userData.picture,
        };
        setUser(googleUser);
        localStorage.setItem('googleUser', JSON.stringify(googleUser));
        setGoogleError('');
      } catch (err) {
        console.error('Error fetching user info:', err);
        setGoogleError('Failed to fetch user information. Please try again.');
      }
    },
    onError: () => {
      setGoogleError('Google sign-in failed');
    },
    flow: 'implicit',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  });

  const signOut = () => {
    localStorage.removeItem('googleUser');
    setUser(null);
    setGoogleError('');
  };

  return {
    user,
    isLoading,
    error,
    googleError,
    signIn,
    signOut,
  };
}; 