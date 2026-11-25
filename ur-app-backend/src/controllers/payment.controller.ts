import { Context } from 'hono';
import { queryOne } from '../config/db';
import { createPayment, getStudentPayments, getAllPayments, updatePaymentStatus, hasUnusedApprovedPayment } from '../services/payment.service';
import { sendSuccess, sendError } from '../helpers/response';

export const initiatePayment = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
    if (!student) return sendError(c, 'Student profile not found', 404);
    const { transaction_id, payer_name, phone_number } = await c.req.json();
    if (typeof transaction_id !== 'string' || transaction_id.trim().length < 3 || transaction_id.trim().length > 100) {
      return sendError(c, 'A valid transaction ID is required', 400);
    }
    if (typeof phone_number !== 'string' || !/^\+?[0-9\s()-]{8,20}$/.test(phone_number.trim())) {
      return sendError(c, 'A valid phone number is required', 400);
    }
    if (payer_name !== undefined && payer_name !== null && (typeof payer_name !== 'string' || payer_name.length > 120)) {
      return sendError(c, 'Payer name must be 120 characters or fewer', 400);
    }
    const payment = await createPayment(student.id, transaction_id.trim(), payer_name?.trim() || null, phone_number.trim());
    return sendSuccess(c, payment, 'Payment recorded, pending approval', 201);
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) return sendError(c, 'Transaction ID already exists', 400);
    return sendError(c, error.message, 400);
  }
};

export const listStudentPayments = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
    if (!student) return sendError(c, 'Student profile not found', 404);
    const payments = await getStudentPayments(student.id);
    return sendSuccess(c, payments, 'Payments retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const listAllPayments = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const status = c.req.query('status');
    const search = c.req.query('search');
    const payments = await getAllPayments({ status, search });
    return sendSuccess(c, payments, 'Payments retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const approvePayment = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    const { status } = await c.req.json();
    if (!['APPROVED', 'REJECTED'].includes(status)) return sendError(c, 'Invalid status', 400);
    const payment = await updatePaymentStatus(id, status);
    if (!payment) return sendError(c, 'Payment not found', 404);
    return sendSuccess(c, payment, `Payment ${status.toLowerCase()}`);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const checkApplicationAccess = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
    if (!student) return sendSuccess(c, { canApply: false, reason: 'Profile incomplete' });
    const hasUnused = await hasUnusedApprovedPayment(student.id);
    return sendSuccess(c, { canApply: hasUnused });
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};
