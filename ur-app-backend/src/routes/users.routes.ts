import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';

const usersRoutes = new Hono();
usersRoutes.use('*', authMiddleware);

export { usersRoutes };