import express = require('express');
import { Request, Response, NextFunction, RouterType } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database';
import ensureDirectoriesExist from './utils/ensureDirectories';
import authRoutes from './routes/auth';
import productRoutes from './routes/product';
import chatRoutes from './routes/chat';
import userRoutesStandard from './routes/user';
import userRoutesCloudinary from './routes/user.cloudinary';
import testRoutes from './routes/test';

// Load environment variables
dotenv.config();

// Determine which user routes to use based on environment
const userRoutes = process.env.NODE_ENV === 'production' ? userRoutesCloudinary : userRoutesStandard;
console.log(`Using ${process.env.NODE_ENV === 'production' ? 'Cloudinary' : 'standard'} user routes`);

// Create directories needed for file storage in development mode
ensureDirectoriesExist();

const app = express();
const httpServer = createServer(app as any);

// CORS configuration
const corsOptions = {
  origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          'https://campuskart-beta.vercel.app', 
          'https://campuskart.vercel.app', 
          'https://campuskart-beta.onrender.com',
          'https://campuskart-backend-qw5z.onrender.com' // Allow backend to call itself
        ]
      : ['http://localhost:3000', 'http://localhost:5000']; // Allow backend-to-backend in dev
      
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Always allow the backend URL to call itself for testing
    if (origin.includes('campuskart-backend-qw5z.onrender.com')) {
      console.log(`CORS: Allowing backend self-call from ${origin}`);
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      console.log(`CORS: Allowing origin ${origin}`);
      callback(null, true);
    } else {
      console.error(`Origin ${origin} not allowed by CORS`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new Server(httpServer, {
  cors: corsOptions,
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Only serve static files locally in development mode
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
  app.use('/uploads/profiles', express.static('uploads/profiles'));
  console.log('Static file serving enabled for local development');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/test', testRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle new messages
  socket.on('new_message', async (data) => {
    try {
      const { chatId, message } = data;
      
      // Join the chat room if not already joined
      if (!socket.rooms.has(chatId)) {
        socket.join(chatId);
      }
      
      // Broadcast the message to all users in the chat room except the sender
      socket.to(chatId).emit('message_received', {
        chatId,
        message
      });
      
      // Also send the message back to the sender to confirm
      socket.emit('message_received', {
        chatId,
        message
      });
    } catch (error) {
      console.error('Error broadcasting message:', error);
    }
  });

  // Handle joining a chat room
  socket.on('join_chat', (chatId) => {
    try {
      socket.join(chatId);
    } catch (error) {
      console.error('Error joining chat room:', error);
    }
  });

  // Handle leaving a chat room
  socket.on('leave_chat', (chatId) => {
    try {
      socket.leave(chatId);
    } catch (error) {
      console.error('Error leaving chat room:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
connectDB();

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 