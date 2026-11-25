import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { initiatePayment, listStudentPayments, listAllPayments, approvePayment, checkApplicationAccess } from '../controllers/payment.controller';

const paymentsRoutes = new Hono();
paymentsRoutes.use('*', authMiddleware);

paymentsRoutes.post('/', initiatePayment);
paymentsRoutes.get('/my', listStudentPayments);
paymentsRoutes.get('/check', checkApplicationAccess);
paymentsRoutes.get('/all', listAllPayments);
paymentsRoutes.patch('/:id', approvePayment);

export { paymentsRoutes };