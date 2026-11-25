import { Context } from 'hono';
import { getAllColleges, createCollege, updateCollege, deleteCollege } from '../services/college.service';
import { sendSuccess, sendError } from '../helpers/response';

export const listColleges = async (c: Context) => {
  try {
    const colleges = await getAllColleges();
    return sendSuccess(c, colleges, 'Colleges retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const addCollege = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const { name, university_id } = await c.req.json();
    if (!name || !university_id) return sendError(c, 'Name and university_id required', 400);
    const college = await createCollege(name, university_id);
    return sendSuccess(c, college, 'College created', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const editCollege = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    const { name } = await c.req.json();
    if (!name) return sendError(c, 'Name required', 400);
    const college = await updateCollege(id, name);
    return sendSuccess(c, college, 'College updated');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const removeCollege = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    await deleteCollege(id);
    return sendSuccess(c, null, 'College deleted');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};