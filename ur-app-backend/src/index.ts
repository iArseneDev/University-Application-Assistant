import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authRoutes } from './routes/auth.routes';
import { studentRoutes } from './routes/student.routes';
import { studentsRoutes } from './routes/students.routes';
import { programsRoutes } from './routes/programs.routes';
import { resultsRoutes } from './routes/results.routes';
import { blogsRoutes } from './routes/blogs.routes';
import { usersRoutes } from './routes/users.routes';
import { applicationsRoutes } from './routes/applications.routes';
import { adminRoutes } from './routes/admin.routes';
import { collegesRoutes } from './routes/college.routes';
import { paymentsRoutes } from './routes/payments.routes';
import { subjectsRoutes } from './routes/subjects.routes';
import { universitiesRoutes } from './routes/universities.routes';
import { initDB } from './config/db';
import { execute, queryOne } from './config/db';
import { hashPassword } from './helpers/password';
import type { D1Database, ExecutionContext } from '@cloudflare/workers-types';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  BLOB_READ_WRITE_TOKEN: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  FRONTEND_ORIGIN?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', logger());
app.use('*', cors({
  origin: (origin, c) => origin === (c.env.FRONTEND_ORIGIN || 'http://localhost:3000') ? origin : '',
  credentials: true,
}));
app.use('*', async (c, next) => {
  c.header('Content-Type', 'application/json');
  await next();
});

app.get('/', (c) => c.json({ success: true, message: 'University API' }));

app.route('/api/auth', authRoutes);
app.route('/api/student', studentRoutes);
app.route('/api/programs', programsRoutes);
app.route('/api/results', resultsRoutes);
app.route('/api/applications', applicationsRoutes);
app.route('/api/colleges', collegesRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/subjects', subjectsRoutes);
app.route('/api/universities', universitiesRoutes);
app.route('/api/blogs', blogsRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/students', studentsRoutes);
app.route('/api/payments', paymentsRoutes);
// Seed an initial admin when deployment secrets are configured.
let adminSeedPromise: Promise<void> | undefined;
let adminSeeded = false;
async function seedAdmin(env: Bindings) {
  if (adminSeeded || !env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) return;
  const normalizedEmail = env.ADMIN_EMAIL.trim().toLowerCase();
  const existing = await queryOne('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
  if (!existing) {
    const hashed = await hashPassword(env.ADMIN_PASSWORD);
    const adminId = crypto.randomUUID();
    await execute(
      `INSERT INTO users (id, email, password_hash, role, is_verified) VALUES (?, ?, ?, 'ADMIN', 1)
       ON CONFLICT(email) DO NOTHING`,
      [adminId, normalizedEmail, hashed]
    );
    console.log('Admin user created');
  }
  adminSeeded = true;
}

export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
      return new Response('Server configuration is incomplete', { status: 500 });
    }
    initDB(env);
    if (!adminSeedPromise) {
      adminSeedPromise = seedAdmin(env).catch((error) => {
        adminSeedPromise = undefined;
        throw error;
      });
    }
    await adminSeedPromise;
    return app.fetch(request, env, ctx);
  }
};
