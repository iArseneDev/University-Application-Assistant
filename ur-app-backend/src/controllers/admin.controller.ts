import { Context } from 'hono';
import { getAllStudents, getStudentFullDetails } from '../services/admin.service';
import { sendSuccess, sendError } from '../helpers/response';

export const listStudents = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const students = await getAllStudents();
    return sendSuccess(c, students, 'Students retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const getStudentDetails = async (c: Context) => {
  const role = c.get('userRole');
  if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
  const id = c.req.param('id')!;
  const data = await getStudentFullDetails(id);
  if (!data) return sendError(c, 'Student not found', 404);
  return sendSuccess(c, data, 'Student details retrieved');
};