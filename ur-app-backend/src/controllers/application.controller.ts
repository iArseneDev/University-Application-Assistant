import { Context } from 'hono';
import { createApplicationBatch, getStudentApplications, getAllApplications, updateApplicationStatus } from '../services/application.service';
import { getUnusedApprovedPaymentId } from '../services/payment.service';
import { queryOne } from '../config/db';
import { sendSuccess, sendError } from '../helpers/response';

export const submitApplicationBatch = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { programs } = await c.req.json(); // expects { programs: [{ program_id, priority }] }
    if (!programs || !Array.isArray(programs) || programs.length === 0) {
      return sendError(c, 'Programs array required with at least one choice', 400);
    }

    const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
    if (!student) return sendError(c, 'Student profile not found', 400);

    const paymentId = await getUnusedApprovedPaymentId(student.id);
    if (!paymentId) {
      return sendError(c, 'No approved payment available. Please make a payment first.', 400);
    }

    const apps = await createApplicationBatch(userId, programs, paymentId);
    return sendSuccess(c, apps, 'Application batch created', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};


export const listStudentApplications = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const apps = await getStudentApplications(userId);
    return sendSuccess(c, apps, 'Applications retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const listAllApplications = async (c: Context) => {
  try {
    // Role check: only admin
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const apps = await getAllApplications();
    return sendSuccess(c, apps, 'All applications retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const updateStatus = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    const { status } = await c.req.json();
    if (!status) return sendError(c, 'Status required', 400);
    const updated = await updateApplicationStatus(id, status);
    if (!updated) return sendError(c, 'Application not found', 404);
    return sendSuccess(c, updated, 'Application status updated');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};
