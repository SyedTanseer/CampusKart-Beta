import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Op } from 'sequelize';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register route
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, email, name, phone } = req.body;

    // Basic validation
    if (!username || !password || !email || !name) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: {
          ...(!username && { username: 'Username is required' }),
          ...(!password && { password: 'Password is required' }),
          ...(!email && { email: 'Email is required' }),
          ...(!name && { name: 'Name is required' })
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { 
        [Op.or]: [
          { username },
          { email }
        ]
      } 
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
      password: hashedPassword,
      email,
      name,
      phone: phone || null, // Handle empty phone number
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profile_picture: user.profile_picture,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.reduce((acc: any, err: any) => {
        acc[err.path] = err.message;
        return acc;
      }, {});
      
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({ 
      message: 'Error registering user',
      error: error.message 
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
    const user = await User.findOne({ where: { username } });
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
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profile_picture: user.profile_picture,
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

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        phone: user.phone,
        profile_picture: user.profile_picture,
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