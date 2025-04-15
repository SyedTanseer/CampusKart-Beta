import express = require('express');
import { Request, Response, RouterType } from 'express';
import User, { IUser } from '../models/User';
import { authenticateToken } from '../middleware/auth';
import { profileUpload } from '../config/cloudinary';
import cloudinary from '../config/cloudinary';
import { NextFunction } from 'express';

const router: RouterType = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { name, email, phone, bio } = req.body;
    
    // Update only provided fields
    const updateData: Partial<IUser> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Update profile picture with Cloudinary URL (for direct frontend uploads)
router.put('/profile-picture', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  // Check if this is a direct URL upload (skip multer)
  if (req.body && req.body.profile_picture_url) {
    return next();
  }
  // Otherwise use multer middleware for file uploads
  return profileUpload.single('profile_picture')(req, res, next);
}, async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if this is a direct Cloudinary upload or a file upload
    if (req.body.profile_picture_url) {
      // Direct Cloudinary upload - the URL is provided directly
      const profilePictureUrl = req.body.profile_picture_url;
      
      console.log('Received direct Cloudinary upload URL:', profilePictureUrl);
      
      // Validate the URL (basic check)
      if (!profilePictureUrl.includes('cloudinary.com')) {
        return res.status(400).json({ message: 'Invalid Cloudinary URL' });
      }
      
      // Get the user to check if they have an existing profile picture
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete old profile picture from Cloudinary if it exists
      if (user.profile_picture && user.profile_picture.includes('cloudinary')) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = user.profile_picture.split('/').pop()?.split('.')[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`campuskart/profiles/${publicId}`);
            console.log(`Deleted old profile picture from Cloudinary: ${publicId}`);
          }
        } catch (err) {
          console.error('Error deleting old profile picture from Cloudinary:', err);
        }
      }

      // Update user profile picture with the provided URL
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { profile_picture: profilePictureUrl } },
        { new: true }
      ).select('-password');

      return res.json({
        message: 'Profile picture updated successfully',
        user: updatedUser
      });
    } else if (req.file) {
      // Regular file upload via multer/cloudinary middleware
      // Get the user to check if they have an existing profile picture
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete old profile picture from Cloudinary if it exists
      if (user.profile_picture && user.profile_picture.includes('cloudinary')) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = user.profile_picture.split('/').pop()?.split('.')[0];
          if (publicId) {
            await cloudinary.uploader.destroy(`campuskart/profiles/${publicId}`);
            console.log(`Deleted old profile picture from Cloudinary: ${publicId}`);
          }
        } catch (err) {
          console.error('Error deleting old profile picture from Cloudinary:', err);
        }
      }

      // Get Cloudinary URL from the uploaded file
      const profilePictureUrl = (req.file as any).path;

      // Update user profile picture
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { profile_picture: profilePictureUrl } },
        { new: true }
      ).select('-password');

      return res.json({
        message: 'Profile picture updated successfully',
        user: updatedUser
      });
    } else {
      return res.status(400).json({ message: 'No image file or Cloudinary URL provided' });
    }
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture' });
  }
});

export default router; 