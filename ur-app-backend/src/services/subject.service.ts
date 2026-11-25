import { query, queryOne, execute, generateUUID } from '../config/db';

export const getAllSubjects = async () => {
  return await query('SELECT * FROM subjects ORDER BY name');
};

export const getSubjectById = async (id: string) => {
  return await queryOne('SELECT * FROM subjects WHERE id = ?', [id]);
};

export const createSubject = async (name: string, code: string) => {
  const id = generateUUID();
  await execute('INSERT INTO subjects (id, name, code) VALUES (?, ?, ?)', [id, name, code]);
  return getSubjectById(id);
};

export const updateSubject = async (id: string, name: string, code: string) => {
  await execute('UPDATE subjects SET name = ?, code = ? WHERE id = ?', [name, code, id]);
  return getSubjectById(id);
};

export const deleteSubject = async (id: string) => {
  await execute('DELETE FROM subjects WHERE id = ?', [id]);
};