import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { listStudents } from '../controllers/admin.controller';

const studentsRoutes = new Hono();
studentsRoutes.use('*', authMiddleware);
studentsRoutes.get('/', listStudents);

export { studentsRoutes };