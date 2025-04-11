import { Router } from 'express';
import { login, register } from '../controllers/user.controller';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

export default router; 