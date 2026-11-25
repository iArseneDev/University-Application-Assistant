import { query, queryOne, execute, generateUUID } from '../config/db';

export const getAllColleges = async () => {
  return await query(`
    SELECT c.*, u.name as university_name
    FROM colleges c
    JOIN universities u ON c.university_id = u.id
    ORDER BY u.name, c.name
  `);
};

export const getCollegeById = async (id: string) => {
  return await queryOne('SELECT * FROM colleges WHERE id = ?', [id]);
};

export const createCollege = async (name: string, universityId: string) => {
  const id = generateUUID();
  await execute(
    'INSERT INTO colleges (id, name, university_id) VALUES (?, ?, ?)',
    [id, name, universityId]
  );
  return getCollegeById(id);
};

export const updateCollege = async (id: string, name: string) => {
  await execute('UPDATE colleges SET name = ? WHERE id = ?', [name, id]);
  return getCollegeById(id);
};

export const deleteCollege = async (id: string) => {
  await execute('DELETE FROM colleges WHERE id = ?', [id]);
};