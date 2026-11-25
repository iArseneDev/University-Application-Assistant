import { Context } from 'hono';
import { registerUser, loginUser } from '../services/auth.service';
import { sendSuccess, sendError } from '../helpers/response';
import { queryOne } from '../config/db';
import { setCookie, deleteCookie } from 'hono/cookie';

const SESSION_COOKIE = 'ur_session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const setSession = (c: Context, token: string) => setCookie(c, SESSION_COOKIE, token, {
  httpOnly: true,
  secure: new URL(c.req.url).protocol === 'https:',
  sameSite: 'Lax',
  path: '/',
  maxAge: SESSION_SECONDS,
});

export const register = async (c: Context) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return sendError(c, 'Email and password required', 400);
    if (password.length < 8) return sendError(c, 'Password must be at least 8 characters', 400);

    if (password.length > 128) return sendError(c, 'Password is too long', 400);
    const { user, token } = await registerUser(email, password, c.env.JWT_SECRET);
    setSession(c, token);
    return sendSuccess(c, { user }, 'Registration successful', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const login = async (c: Context) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) return sendError(c, 'Email and password required', 400);

    const { user, token } = await loginUser(email, password, c.env.JWT_SECRET);
    setSession(c, token);
    return sendSuccess(c, { user }, 'Login successful');
  } catch (error: any) {
    return sendError(c, error.message, 401);
  }
};

export const logout = (c: Context) => {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
  return sendSuccess(c, null, 'Logged out');
};

export const getMe = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const user = await queryOne('SELECT id, email, role FROM users WHERE id = ?', [userId]);
    if (!user) return sendError(c, 'User not found', 404);
    return sendSuccess(c, user, 'User retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};
