import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { listColleges, addCollege, editCollege, removeCollege } from '../controllers/college.controller';

const collegesRoutes = new Hono();
collegesRoutes.use('*', authMiddleware);

collegesRoutes.get('/', listColleges);
collegesRoutes.post('/', addCollege);
collegesRoutes.put('/:id', editCollege);
collegesRoutes.delete('/:id', removeCollege);

export { collegesRoutes };