import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { listStudents, getStudentDetails } from '../controllers/admin.controller';

const adminRoutes = new Hono();
adminRoutes.use('*', authMiddleware);

adminRoutes.get('/students', listStudents);
adminRoutes.get('/student/:id', getStudentDetails);
// Add more admin endpoints later

export { adminRoutes };