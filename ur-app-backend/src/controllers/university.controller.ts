// src/controllers/university.controller.ts
import { Context } from 'hono';
import {
  getAllUniversities,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity
} from '../services/university.service';
import { sendSuccess, sendError } from '../helpers/response';

export const listUniversities = async (c: Context) => {
  try {
    const universities = await getAllUniversities();
    return sendSuccess(c, universities, 'Universities retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const getUniversity = async (c: Context) => {
  try {
    const id = c.req.param('id')!;
    const university = await getUniversityById(id);
    if (!university) return sendError(c, 'University not found', 404);
    return sendSuccess(c, university, 'University retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const addUniversity = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const { name } = await c.req.json();
    if (!name) return sendError(c, 'University name required', 400);
    const university = await createUniversity(name);
    return sendSuccess(c, university, 'University created', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const editUniversity = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    const { name } = await c.req.json();
    if (!name) return sendError(c, 'University name required', 400);
    const university = await updateUniversity(id, name);
    return sendSuccess(c, university, 'University updated');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const removeUniversity = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    await deleteUniversity(id);
    return sendSuccess(c, null, 'University deleted');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};