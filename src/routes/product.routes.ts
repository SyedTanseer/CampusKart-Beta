import express from 'express';
import { body, validationResult } from 'express-validator';
import Product from '../models/product.model';
import { IProduct } from '../models/product.model';

const router = express.Router();

// Get all products
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product by ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
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
  [
    body('title').notEmpty().trim(),
    body('description').notEmpty().trim(),
    body('price').isFloat({ min: 0 }),
    body('category').notEmpty().trim(),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.create(req.body);
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
  [
    body('title').optional().trim(),
    body('description').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('category').optional().trim(),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      await product.update(req.body);
      res.json(product);
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete product
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 