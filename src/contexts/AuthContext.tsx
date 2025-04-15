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
  // Initialize user state from localStorage to avoid flash of unauthenticated state
  const initialUserData = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '{}')
    : null;
    
  const [user, setUser] = useState<User | null>(initialUserData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await api.get('/auth/verify');
            console.log('Auth verification response:', response.data);
            
            // Ensure all fields are present
            const userData = {
              ...response.data.user,
              phone: response.data.user.phone || '',
              bio: response.data.user.bio || ''
            };
            
            // Update local storage with latest user data
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Update state
            setUser(userData);
            setIsAuthenticated(true);
          } catch (verifyError) {
            console.error('Auth verification error:', verifyError);
            
            // Don't immediately clear user state - this allows the app to work offline
            // or when the server is temporarily unavailable
            if (verifyError.response?.status === 401) {
              // Clear auth state only on unauthorized error
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth general error:', err);
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
      
      // Add console log to view the data
      console.log('Login response user data:', userData);
      
      // Make sure all fields are included in the userData object
      const userWithAllFields = {
        ...userData,
        phone: userData.phone || '',
        bio: userData.bio || ''
      };
      
      // Store user data and token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithAllFields));
      
      // Update state
      setUser(userWithAllFields);
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
      
      // Basic validation before API call
      if (!data.phone || data.phone.trim() === '') {
        const error = new Error('Phone number is required');
        // @ts-ignore - adding a custom property to Error
        error.response = { data: { errors: { phone: 'Phone number is required' } } };
        throw error;
      }
      
      if (!/^\d{10}$/.test(data.phone)) {
        const error = new Error('Phone number must be exactly 10 digits');
        // @ts-ignore - adding a custom property to Error
        error.response = { data: { errors: { phone: 'Phone number must be exactly 10 digits' } } };
        throw error;
      }
      
      const response = await api.post('/auth/register', data);
      console.log('Registration response:', response.data);
      const { user: userData, token } = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      setError('');
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.data) {
        console.error('Registration error response:', err.response.data);
        
        // Format validation errors
        if (err.response.data.errors) {
          const errorMessages = Object.values(err.response.data.errors).join(', ');
          setError(errorMessages || 'Registration failed');
        } else {
          setError(err.response.data.message || 'Registration failed');
        }
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
      
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