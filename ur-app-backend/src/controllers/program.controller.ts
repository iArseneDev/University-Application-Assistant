import { Context } from 'hono';
import { getAllPrograms, getProgramById, createProgram, updateProgram, deleteProgram } from '../services/program.service';
import { sendSuccess, sendError } from '../helpers/response';

export const listPrograms = async (c: Context) => {
  try {
    const programs = await getAllPrograms();
    return sendSuccess(c, programs, 'Programs retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const getProgram = async (c: Context) => {
  try {
    const id = c.req.param('id')!;
    const program = await getProgramById(id);
    if (!program) return sendError(c, 'Program not found', 404);
    return sendSuccess(c, program, 'Program retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const addProgram = async (c: Context) => {
  try {
    if (c.get('userRole') !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const data = await c.req.json();
    const program = await createProgram(data);
    return sendSuccess(c, program, 'Program created', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const editProgram = async (c: Context) => {
  try {
    if (c.get('userRole') !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    const data = await c.req.json();
    const program = await updateProgram(id, data);
    return sendSuccess(c, program, 'Program updated');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const removeProgram = async (c: Context) => {
  try {
    if (c.get('userRole') !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    await deleteProgram(id);
    return sendSuccess(c, null, 'Program deleted');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};
