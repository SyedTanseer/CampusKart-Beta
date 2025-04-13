import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../types';

const ProductSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'like new', 'good', 'fair', 'poor'],
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product; 