import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  submitApplicationBatch,
  listStudentApplications,
  listAllApplications,
  updateStatus
} from '../controllers/application.controller';

const applicationsRoutes = new Hono();
applicationsRoutes.use('*', authMiddleware);
applicationsRoutes.post('/', submitApplicationBatch);
applicationsRoutes.get('/', listStudentApplications); // student gets own, admin gets all? we separate
applicationsRoutes.get('/all', listAllApplications); // admin endpoint
applicationsRoutes.patch('/:id', updateStatus); // admin only

export { applicationsRoutes };