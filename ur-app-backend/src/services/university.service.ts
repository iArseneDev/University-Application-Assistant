import { query, queryOne, execute, generateUUID } from '../config/db';

export const getAllUniversities = async () => {
  return await query('SELECT * FROM universities ORDER BY name');
};

export const getUniversityById = async (id: string) => {
  return await queryOne('SELECT * FROM universities WHERE id = ?', [id]);
};

export const createUniversity = async (name: string) => {
  const id = generateUUID();
  await execute('INSERT INTO universities (id, name) VALUES (?, ?)', [id, name]);
  return getUniversityById(id);
};

export const updateUniversity = async (id: string, name: string) => {
  await execute('UPDATE universities SET name = ? WHERE id = ?', [name, id]);
  return getUniversityById(id);
};

export const deleteUniversity = async (id: string) => {
  // First check if any colleges reference it
  const colleges = await query('SELECT id FROM colleges WHERE university_id = ?', [id]);
  if (colleges.length > 0) {
    throw new Error('Cannot delete university with existing colleges');
  }
  await execute('DELETE FROM universities WHERE id = ?', [id]);
};