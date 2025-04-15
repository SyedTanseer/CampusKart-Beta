import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface User {
  id: number;
  email: string;
  name: string;
  college: string;
  phone?: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, college: string, phone?: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data.user);
    } catch (err) {
      console.error('Error fetching user data:', err);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    college: string,
    phone?: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.post('/auth/register', { 
        email, password, name, college, phone 
      });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
} 