export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  created_at: string;
  phone?: string;
  profile_picture?: string;
  bio?: string;
  user_type?: 'normal' | 'admin' | 'developer';
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like new' | 'good' | 'fair' | 'poor';
  images: string[];
  seller: User;
  created_at: string;
  updated_at: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  receiver: User;
  timestamp: string;
}

export interface Chat {
  _id: string;
  product: Product;
  buyer: User;
  seller: User;
  messages: Message[];
  created_at: string;
  updated_at: string;
} 