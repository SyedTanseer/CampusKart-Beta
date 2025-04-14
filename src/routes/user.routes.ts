import { Router, Request, Response, RouterType } from 'express';
import { login, register, updateProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
    }
  }
});

const router: RouterType = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Profile routes
router.put(
  '/profile',
  authMiddleware,
  upload.single('profile_picture'),
  updateProfile
);

export default router; 