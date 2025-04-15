import express = require('express');
import { Request, Response, RouterType } from 'express';
import cloudinary from '../config/cloudinary';
import { profileUpload } from '../config/cloudinary';
import multer from 'multer';

const router: RouterType = express.Router();

// Test Cloudinary configuration
router.get('/cloudinary-status', async (req: Request, res: Response) => {
  try {
    // Simple ping to Cloudinary to check connection
    const result = await cloudinary.api.ping();
    res.json({ 
      status: 'success', 
      message: 'Cloudinary connection successful',
      result 
    });
  } catch (error) {
    console.error('Cloudinary connection error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to connect to Cloudinary',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

// Test Cloudinary upload with a simple placeholder image
router.post('/cloudinary-test-upload', profileUpload.single('test_image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        status: 'error', 
        message: 'No file uploaded' 
      });
    }
    
    res.json({ 
      status: 'success', 
      message: 'File uploaded successfully to Cloudinary',
      file: req.file 
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to upload to Cloudinary',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router; 