import { D1Database, D1Result } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
  BLOB_READ_WRITE_TOKEN: string;
  JWT_SECRET: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
}

// Global variable to hold env (set in index.ts)
let env: Env;

export const initDB = (e: Env) => {
  env = e;
};

export const query = async (sql: string, params?: any[]): Promise<any[]> => {
  const stmt = env.DB.prepare(sql);
  if (params && params.length) {
    const result = await stmt.bind(...params).all();
    return result.results;
  }
  const result = await stmt.all();
  return result.results;
};

export const queryOne = async (sql: string, params?: any[]): Promise<any | null> => {
  const rows = await query(sql, params);
  return rows.length ? rows[0] : null;
};

export const execute = async (sql: string, params?: any[]): Promise<D1Result> => {
  const stmt = env.DB.prepare(sql);
  if (params && params.length) {
    return await stmt.bind(...params).run();
  }
  return await stmt.run();
};

export const executeBatch = async (statements: Array<{ sql: string; params?: any[] }>) => {
  const prepared = statements.map(({ sql, params = [] }) => {
    const statement = env.DB.prepare(sql);
    return params.length ? statement.bind(...params) : statement;
  });
  return env.DB.batch(prepared);
};

// Helper to generate UUID
export const generateUUID = (): string => {
  return crypto.randomUUID();
};
