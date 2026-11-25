import { Context } from 'hono';
import { getAllSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } from '../services/subject.service';
import { sendSuccess, sendError } from '../helpers/response';

export const listSubjects = async (c: Context) => {
  try {
    const subjects = await getAllSubjects();
    return sendSuccess(c, subjects, 'Subjects retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const getSubject = async (c: Context) => {
  try {
    const id = c.req.param('id')!;
    const subject = await getSubjectById(id);
    if (!subject) return sendError(c, 'Subject not found', 404);
    return sendSuccess(c, subject, 'Subject retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const addSubject = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const { name, code } = await c.req.json();
    if (!name || !code) return sendError(c, 'Name and code required', 400);
    const subject = await createSubject(name, code);
    return sendSuccess(c, subject, 'Subject created', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const editSubject = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    const { name, code } = await c.req.json();
    if (!name || !code) return sendError(c, 'Name and code required', 400);
    const subject = await updateSubject(id, name, code);
    return sendSuccess(c, subject, 'Subject updated');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const removeSubject = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    await deleteSubject(id);
    return sendSuccess(c, null, 'Subject deleted');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};