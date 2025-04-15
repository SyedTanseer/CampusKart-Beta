import express = require('express');
import { Request, Response, RouterType } from 'express';
import { FileFilterCallback } from 'multer';
import Product from '../models/Product';
import { IProduct } from '../types';
import { authenticateToken } from '../middleware/auth';
import { productUpload } from '../config/cloudinary';
import cloudinary from '../config/cloudinary';

const router: RouterType = express.Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Fetching all products...');
    const products = await Product.find().populate('seller', 'name email phone profile_picture created_at');
    console.log('Found products:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Search products
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Create a case-insensitive search pattern
    const searchRegex = new RegExp(query as string, 'i');
    
    // Search across multiple fields
    const products = await Product.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { name: searchRegex }
      ]
    })
    .populate('seller', 'name email phone profile_picture')
    .sort({ createdAt: -1 }); // Sort by newest first

    console.log(`Found ${products.length} products matching search query: ${query}`);
    res.json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
});

// Get products by category
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    console.log('Fetching products for category:', req.params.category);
    const products = await Product.find({ category: req.params.category }).populate('seller', 'name email phone profile_picture');
    console.log('Found products:', products);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Error fetching products by category' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email phone profile_picture created_at');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create new product with Cloudinary
router.post('/', authenticateToken, productUpload.array('images', 5), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, price, category, condition } = req.body;
    
    // Get the Cloudinary URLs from the uploaded files
    const images = (req.files as any[]).map(file => file.path);

    const product = await Product.create({
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
      images,
      seller: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update product with Cloudinary
router.put('/:id', authenticateToken, productUpload.array('images', 5), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, price, category, condition } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Allow admin/developer users to update any product
    const isAdminOrDeveloper = req.user.user_type === 'admin' || req.user.user_type === 'developer';
    if (!isAdminOrDeveloper && !product.seller.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    // Delete old images from Cloudinary if new ones are uploaded
    if (req.files && (req.files as any[]).length > 0) {
      for (const image of product.images) {
        if (image.includes('cloudinary')) {
          try {
            // Extract public_id from Cloudinary URL
            const publicId = image.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`campuskart/products/${publicId}`);
            }
          } catch (err) {
            console.error(`Error deleting image from Cloudinary:`, err);
          }
        }
      }
    }

    const updateData: Partial<IProduct> = {
      title,
      description,
      price: parseFloat(price),
      category,
      condition,
    };

    if (req.files && (req.files as any[]).length > 0) {
      updateData.images = (req.files as any[]).map(file => file.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete product with Cloudinary
router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Allow admin and developer users to delete any product
    const isAdminOrDeveloper = req.user.user_type === 'admin' || req.user.user_type === 'developer';
    if (!isAdminOrDeveloper && !product.seller.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Delete product images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          if (image.includes('cloudinary')) {
            // Extract public_id from Cloudinary URL
            const publicId = image.split('/').pop()?.split('.')[0];
            if (publicId) {
              await cloudinary.uploader.destroy(`campuskart/products/${publicId}`);
              console.log(`Deleted image from Cloudinary: ${publicId}`);
            }
          }
        } catch (err) {
          console.error(`Error deleting image from Cloudinary:`, err);
          // Continue with other images even if one fails
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router; 