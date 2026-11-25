// src/routes/universities.routes.ts
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  listUniversities,
  getUniversity,
  addUniversity,
  editUniversity,
  removeUniversity
} from '../controllers/university.controller';

const universitiesRoutes = new Hono();

// Protect all routes
universitiesRoutes.use('*', authMiddleware);

universitiesRoutes.get('/', listUniversities);
universitiesRoutes.get('/:id', getUniversity);
universitiesRoutes.post('/', addUniversity);
universitiesRoutes.put('/:id', editUniversity);
universitiesRoutes.delete('/:id', removeUniversity);

export { universitiesRoutes };