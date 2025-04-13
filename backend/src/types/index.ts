import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'like new' | 'good' | 'fair' | 'poor';
  images: string[];
  seller: Types.ObjectId;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  name: string;
  user_type: 'normal' | 'admin' | 'developer';
}

export interface JwtPayload {
  id: Types.ObjectId;
  username: string;
  user_type: 'normal' | 'admin' | 'developer';
} 