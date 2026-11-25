import { Context } from 'hono';
import { saveStudentResult, getStudentResults } from '../services/result.service';
import { sendSuccess, sendError } from '../helpers/response';

export const addResult = async (c: Context) => {
  try {
    const studentId = c.get('userId'); // from auth middleware (student's own ID)
    const { subject_id, grade, points } = await c.req.json();
    if (!subject_id || !grade || points === undefined) {
      return sendError(c, 'Missing required fields: subject_id, grade, points', 400);
    }
    if (typeof subject_id !== 'string' || typeof grade !== 'string' || grade.trim().length > 8 ||
        !Number.isInteger(points) || points < 0 || points > 100) {
      return sendError(c, 'Result values are invalid', 400);
    }
    const result = await saveStudentResult(studentId, subject_id, grade.trim().toUpperCase(), points);
    return sendSuccess(c, result, 'Result saved', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const listResults = async (c: Context) => {
  try {
    const studentId = c.get('userId');
    const results = await getStudentResults(studentId);
    return sendSuccess(c, results, 'Results retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};
