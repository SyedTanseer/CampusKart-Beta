import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: Types.ObjectId;
        id: Types.ObjectId;
        email: string;
        name: string;
        user_type?: 'admin' | 'developer' | 'user';
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; user_type?: string };
    req.user = {
      _id: new Types.ObjectId(decoded.id),
      id: new Types.ObjectId(decoded.id),
      email: '',  // These will be populated if needed
      name: '',
      user_type: decoded.user_type as 'admin' | 'developer' | 'user' || 'user'
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
}; 