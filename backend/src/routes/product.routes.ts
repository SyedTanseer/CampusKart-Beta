import express = require('express');
import { Request, Response, RouterType } from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/Product';
import { authMiddleware } from '../middleware/auth';

const router: RouterType = express.Router();

// Get all products
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const products = await Product.find()
      .populate('seller', 'name email phone profilePicture created_at')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name email phone profilePicture created_at');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product
router.post(
  '/',
  authMiddleware,
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('category').notEmpty().trim(),
    body('condition').isIn(['new', 'like new', 'good', 'fair', 'poor']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is authenticated
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const product = await Product.create({
        ...req.body,
        seller: req.user._id // Set the seller to the current authenticated user
      });

      // Populate the seller information before sending response
      await product.populate('seller', 'name email phone profilePicture created_at');
      
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update product
router.put(
  '/:id',
  authMiddleware,
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().trim(),
    body('condition').optional().isIn(['new', 'like new', 'good', 'fair', 'poor']),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user is authenticated
      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if the current user is the seller
      if (product.seller.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this product' });
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      ).populate('seller', 'name email phone profilePicture created_at');

      res.json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete product
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the current user is the seller
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 