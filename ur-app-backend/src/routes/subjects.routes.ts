import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { listSubjects, getSubject, addSubject, editSubject, removeSubject } from '../controllers/subject.controller';

const subjectsRoutes = new Hono();
subjectsRoutes.use('*', authMiddleware);
subjectsRoutes.get('/', listSubjects);
subjectsRoutes.get('/:id', getSubject);
subjectsRoutes.post('/', addSubject);
subjectsRoutes.put('/:id', editSubject);
subjectsRoutes.delete('/:id', removeSubject);

export { subjectsRoutes };