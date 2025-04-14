import express = require('express');
import { Request, Response, NextFunction, RouterType } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import User from '../models/User';

const router: RouterType = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    const uploadDir = 'uploads/profiles';
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Update user profile
router.put('/profile', authenticateToken, upload.single('profile_picture'), async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Profile update request body:', req.body);
    console.log('Profile picture file:', req.file);

    const { name, email, phone, bio } = req.body;
    const updateData: any = {
      name,
      email,
      phone,
      bio,
    };

    // If a new profile picture was uploaded, update the path
    if (req.file) {
      console.log('New profile picture uploaded:', req.file.path);
      
      // Delete old profile picture if it exists
      const user = await User.findById(req.user._id);
      if (user?.profile_picture) {
        try {
          const fullPath = path.resolve(user.profile_picture);
          console.log('Attempting to delete old profile picture:', fullPath);
          
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log('Successfully deleted old profile picture');
          } else {
            console.log('Old profile picture file not found at path:', fullPath);
          }
        } catch (err) {
          console.error('Error deleting old profile picture:', err);
        }
      }
      updateData.profile_picture = req.file.path;
    }

    console.log('Updating user with data:', updateData);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated successfully:', {
      id: updatedUser._id,
      name: updatedUser.name,
      profile_picture: updatedUser.profile_picture
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router; 