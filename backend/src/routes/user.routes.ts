import { Router, Request, Response, RouterType } from 'express';
import { login, register, updateProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { profileUpload } from '../config/cloudinary';

// Ensure uploads directory exists for development mode
if (process.env.NODE_ENV !== 'production') {
  const uploadDir = path.join(__dirname, '../../uploads/profiles');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created directory: ${uploadDir}`);
  }
}

// Configure multer for local file uploads (development mode)
const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
    cb(null, 'uploads/profiles/');
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const localUpload = multer({
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

// Choose upload middleware based on environment
const upload = process.env.NODE_ENV === 'production' ? profileUpload : localUpload;

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