import axios from 'axios';
import { Product } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect to login on 401 errors during auth verification
    const isVerifyRequest = error.config?.url?.includes('/auth/verify');
    
    if (error.response?.status === 401 && !isVerifyRequest) {
      // Handle unauthorized access - only redirect if not a verification request
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export { api };

// Helper function to determine if a URL is a Cloudinary URL
export const isCloudinaryUrl = (url: string) => {
  return url && (url.includes('cloudinary.com') || url.startsWith('https://res.cloudinary.com'));
};

// Helper function to get the correct image URL
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/placeholder.svg';
  
  // If it's already a Cloudinary URL, return as is
  if (isCloudinaryUrl(imagePath)) {
    return imagePath;
  }
  
  // If it's another full URL (starts with http or https), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // For local paths, ensure they start with the correct base URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Convert Windows-style backslashes to forward slashes
  const normalizedPath = imagePath.replace(/\\/g, '/');
  
  // For local paths, ensure they start with a slash
  const finalPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
  return `${baseUrl}${finalPath}`;
};

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category: string) => {
  try {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    if (!query.trim()) {
      return [];
    }
    const response = await api.get(`/products/search?query=${encodeURIComponent(query.trim())}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products. Please try again later.');
  }
}; 