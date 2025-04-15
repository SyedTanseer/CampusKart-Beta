import { Router, Request, Response, RouterType } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router: RouterType = Router();

// Register a new user
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, name, phone } = req.body;

    // Basic validation
    if (!username || !email || !password || !name || !phone) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: {
          ...(!username && { username: 'Username is required' }),
          ...(!email && { email: 'Email is required' }),
          ...(!password && { password: 'Password is required' }),
          ...(!name && { name: 'Name is required' }),
          ...(!phone && { phone: 'Phone number is required' })
        }
      });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ 
        message: 'Invalid phone number format',
        errors: {
          phone: 'Phone number must be exactly 10 digits'
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { username },
        { email }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        errors: {
          ...(existingUser.username === username && { username: 'Username already taken' }),
          ...(existingUser.email === email && { email: 'Email already registered' })
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      name,
      phone,
      user_type: 'normal' // Default user type
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, user_type: user.user_type },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || '',
        user_type: user.user_type
      },
      token,
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.keys(error.errors).reduce((acc: any, key: string) => {
        acc[key] = error.errors[key].message;
        return acc;
      }, {});
      
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: 'Duplicate field error',
        errors: {
          [field]: `${field} already exists`
        }
      });
    }
    
    res.status(500).json({ 
      message: 'Error registering user',
      error: error.message
    });
  }
});

// Login user
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, user_type: user.user_type },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || '',
        user_type: user.user_type
      },
      token,
    });
  } catch (error: any) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Verify token
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || '',
        user_type: user.user_type
      },
    });
  } catch (error: any) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router; 