import { Router, Request, Response, RouterType } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router: RouterType = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    console.log('Registration request received:', { body: req.body });
    
    const { username, password, email, name, phone } = req.body;

    // Basic validation
    if (!username || !password || !email || !name || !phone) {
      console.log('Missing required fields:', { username, email, name, phone });
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: {
          ...(!username && { username: 'Username is required' }),
          ...(!password && { password: 'Password is required' }),
          ...(!email && { email: 'Email is required' }),
          ...(!name && { name: 'Name is required' }),
          ...(!phone && { phone: 'Phone number is required' })
        }
      });
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phone)) {
      console.log('Invalid phone number format:', { phone });
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
      console.log('User already exists:', { username, email });
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
    console.log('Password hashed successfully');

    // Create user
    console.log('Attempting to create user with data:', {
      username,
      email,
      name,
      phone,
      user_type: 'normal'
    });

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      name,
      phone,
      user_type: 'normal'
    });

    console.log('User created successfully:', { userId: user._id });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profile_picture: user.profile_picture,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error('Registration error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
      errors: error.errors
    });
    
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
      error: error.message,
      details: error.stack
    });
  }
});

// Login route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Missing credentials',
        errors: {
          ...(!username && { username: 'Username is required' }),
          ...(!password && { password: 'Password is required' })
        }
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        errors: {
          username: 'Username not found'
        }
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        errors: {
          password: 'Incorrect password'
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone || '',
        bio: user.bio || '',
        profile_picture: user.profile_picture || '',
        user_type: user.user_type,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      error: error.message 
    });
  }
});

// Get current user route
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
        user_type: user.user_type,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      message: 'Invalid token',
      error: error.message 
    });
  }
});

export default router; 