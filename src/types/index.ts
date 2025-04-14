export interface User {
  id: string;
  _id?: string;
  username: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  profile_picture?: string;
  user_type: 'buyer' | 'seller';
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  images: string[];
  seller: User;
  status: 'available' | 'sold' | 'pending';
  createdAt: string;
  updatedAt: string;
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
  product: Product | Partial<Product> | string;
  buyer: User;
  seller: User;
  messages: Message[];
  created_at: string;
  updated_at: string;
} 