import { Hono } from 'hono';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const authRoutes = new Hono();
authRoutes.get('/me', authMiddleware, getMe);
authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
export { authRoutes };
