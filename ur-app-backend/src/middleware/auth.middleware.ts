import { Context, Next } from 'hono';
import { verifyToken } from '../helpers/jwt';
import { sendError } from '../helpers/response';
import { getCookie } from 'hono/cookie';

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : getCookie(c, 'ur_session');
    if (!token) {
      return sendError(c, 'Unauthorized: No token provided', 401);
    }

    const secret = c.env.JWT_SECRET;
    const decoded = await verifyToken(token, secret);

    if (!decoded || !decoded.userId) {
      return sendError(c, 'Unauthorized: Invalid token', 401);
    }

    c.set('userId', decoded.userId);
    c.set('userEmail', decoded.email);
    c.set('userRole', decoded.role);

    return await next();
  } catch (error) {
    return sendError(c, 'Unauthorized: Invalid or expired token', 401);
  }
};
