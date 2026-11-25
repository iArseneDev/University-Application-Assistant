import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { addResult, listResults } from '../controllers/result.controller';

const resultsRoutes = new Hono();
resultsRoutes.use('*', authMiddleware);

resultsRoutes.post('/', addResult);
resultsRoutes.get('/', listResults);

export { resultsRoutes };