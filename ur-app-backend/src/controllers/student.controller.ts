import { Context } from 'hono';
import { createStudentProfile, getStudentProfile, updateStudentProfile } from '../services/student.service';
import { sendSuccess, sendError } from '../helpers/response';

export const createProfile = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();
    const profile = await createStudentProfile(userId, data);
    return sendSuccess(c, profile, 'Student profile created', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const getProfile = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const profile = await getStudentProfile(userId);
    return sendSuccess(c, profile, 'Profile retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 404);
  }
};

export const updateProfile = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();
    const updated = await updateStudentProfile(userId, data);
    return sendSuccess(c, updated, 'Profile updated');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};