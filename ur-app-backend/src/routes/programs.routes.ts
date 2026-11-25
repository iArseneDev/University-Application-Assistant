import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { listPrograms, getProgram, addProgram, editProgram, removeProgram } from '../controllers/program.controller';

const programsRoutes = new Hono();

// All program routes require authentication
programsRoutes.use('*', authMiddleware);

programsRoutes.get('/', listPrograms);
programsRoutes.get('/:id', getProgram);
programsRoutes.post('/', addProgram);      // controller enforces admin role
programsRoutes.put('/:id', editProgram);   // controller enforces admin role
programsRoutes.delete('/:id', removeProgram); // controller enforces admin role

export { programsRoutes };
