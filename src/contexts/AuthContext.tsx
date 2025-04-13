import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/auth/verify');
          setUser(response.data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        // Clear auth state on verification failure
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await api.post('/auth/login', { username, password });
      const { user: userData, token } = response.data;
      
      // Store user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      const fieldErrors = err.response?.data?.errors || {};
      setError(errorMessage);
      throw new Error(JSON.stringify({ message: errorMessage, errors: fieldErrors }));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    username: string;
    email: string;
    password: string;
    name: string;
    phone: string;
  }) => {
    try {
      setIsLoading(true);
      console.log('Registering user with data:', JSON.stringify(data, null, 2));
      const response = await api.post('/auth/register', data);
      console.log('Registration response:', response.data);
      const { user: userData, token } = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      setError('');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Registration error response:', err.response?.data);
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError('');
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        error, 
        login, 
        register, 
        logout,
        isAuthenticated,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 