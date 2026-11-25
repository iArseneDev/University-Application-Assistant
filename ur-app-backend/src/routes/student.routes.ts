import { Hono } from 'hono';
import { createProfile, getProfile, updateProfile } from '../controllers/student.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const studentRoutes = new Hono();
studentRoutes.use('*', authMiddleware);
studentRoutes.post('/profile', createProfile);
studentRoutes.get('/profile', getProfile);
studentRoutes.put('/profile', updateProfile);
export { studentRoutes };