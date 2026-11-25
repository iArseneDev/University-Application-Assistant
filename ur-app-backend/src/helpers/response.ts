import { Context } from 'hono';

export const sendSuccess = (c: Context, data: any, message = 'Success', status = 200) => {
  return c.json({ success: true, message, data }, status as any);
};

export const sendError = (c: Context, message: string, status = 400, error?: any) => {
  if (error) console.error(message, error);
  else console.error(message);
  return c.json({ success: false, message }, status as any);
};