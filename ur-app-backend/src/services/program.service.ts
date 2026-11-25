// src/services/program.service.ts
import { query, queryOne, execute, generateUUID } from '../config/db';

export const getAllPrograms = async () => {
  // Use query() which returns an array, not queryOne()
  const programs = await query(`
    SELECT p.*, c.name as college_name, u.name as university_name
    FROM programs p
    JOIN colleges c ON p.college_id = c.id
    JOIN universities u ON c.university_id = u.id
    ORDER BY u.name, c.name, p.name
  `);
  return programs; // now returns an array
};

export const getProgramById = async (id: string) => {
  const program = await queryOne('SELECT * FROM programs WHERE id = ?', [id]);
  return program;
};

export const createProgram = async (data: any) => {
  if (!data.name) throw new Error('Program name is required');
  if (!data.college_id) throw new Error('College ID is required. Please select a college.');

  const college = await queryOne('SELECT id FROM colleges WHERE id = ?', [data.college_id]);
  if (!college) throw new Error('Selected college does not exist');

  const id = generateUUID();
  const name = data.name;
  const code = data.code || '';
  const durationYears = data.duration_years ? Number(data.duration_years) : null;
  const description = data.description || null;

  await execute(
    `INSERT INTO programs (id, name, code, duration_years, description, college_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, name, code, durationYears, description, data.college_id]
  );
  return getProgramById(id);
};

export const updateProgram = async (id: string, data: any) => {
  const updates = [];
  const values = [];
  if (data.name !== undefined) { updates.push('name = ?'); values.push(data.name); }
  if (data.code !== undefined) { updates.push('code = ?'); values.push(data.code); }
  if (data.duration_years !== undefined) { updates.push('duration_years = ?'); values.push(data.duration_years); }
  if (data.description !== undefined) { updates.push('description = ?'); values.push(data.description); }
  if (data.college_id !== undefined) { updates.push('college_id = ?'); values.push(data.college_id); }
  if (updates.length === 0) return getProgramById(id);
  values.push(id);
  await execute(`UPDATE programs SET ${updates.join(', ')} WHERE id = ?`, values);
  return getProgramById(id);
};

export const deleteProgram = async (id: string) => {
  await execute('DELETE FROM programs WHERE id = ?', [id]);
};