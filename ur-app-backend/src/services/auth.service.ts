import { queryOne, execute, generateUUID } from '../config/db';
import { hashPassword, comparePassword } from '../helpers/password';
import { signToken } from '../helpers/jwt';

export const registerUser = async (email: string, password: string, envSecret: string) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('A valid email address is required');
  if (password.length < 8) throw new Error('Password must be at least 8 characters');
  const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) throw new Error('User already exists with this email');

  const hashedPassword = await hashPassword(password);
  const userId = generateUUID();

  await execute(
    `INSERT INTO users (id, email, password_hash, role, is_verified) VALUES (?, ?, ?, 'STUDENT', 0)`,
    [userId, email, hashedPassword]
  );

  const token = await signToken(userId, email, 'STUDENT', envSecret);
  return { user: { id: userId, email, role: 'STUDENT' }, token };
};

export const loginUser = async (email: string, password: string, envSecret: string) => {
  const user = await queryOne('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
  if (!user) throw new Error('Invalid email or password');

  const isValid = await comparePassword(password, user.password_hash);
  if (!isValid) throw new Error('Invalid email or password');

  const token = await signToken(user.id, user.email, user.role, envSecret);
  return { user: { id: user.id, email: user.email, role: user.role }, token };
};
