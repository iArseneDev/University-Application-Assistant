import { queryOne, execute, generateUUID } from '../config/db';
import { StudentCreateInput, StudentUpdateInput } from '../types';

export const createStudentProfile = async (userId: string, data: StudentCreateInput) => {
  const existing = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (existing) throw new Error('Student profile already exists for this user');

  const id = generateUUID();
  await execute(
    `INSERT INTO students (
      id, user_id, first_name, last_name, other_names, gender, date_of_birth,
      nationality, national_id, phone_number, alternative_phone, province,
      district, sector, cell, village, school_name, school_type, combination,
      year_of_completion, index_number, total_points, division, application_year,
      entry_mode, sponsorship_type, disability_status, disability_details,
      guardian_name, guardian_relationship, guardian_phone, guardian_email, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id, userId,
      data.first_name, data.last_name, data.other_names || null, data.gender, data.date_of_birth,
      data.nationality, data.national_id, data.phone_number, data.alternative_phone || null,
      data.province, data.district, data.sector, data.cell, data.village,
      data.school_name, data.school_type, data.combination, data.year_of_completion,
      data.index_number, data.total_points, data.division || null, data.application_year,
      data.entry_mode, data.sponsorship_type, data.disability_status ?? 0, data.disability_details || null,
      data.guardian_name, data.guardian_relationship, data.guardian_phone, data.guardian_email || null,
      'DRAFT'
    ]
  );
  return await queryOne('SELECT * FROM students WHERE id = ?', [id]);
};

export const getStudentProfile = async (userId: string) => {
  const profile = await queryOne('SELECT * FROM students WHERE user_id = ?', [userId]);
  if (!profile) throw new Error('Student profile not found');
  return profile;
};

export const updateStudentProfile = async (userId: string, data: StudentUpdateInput) => {
  const existing = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (!existing) throw new Error('Student profile not found');

  const updates: string[] = [];
  const values: any[] = [];
  const allowedFields = [
    'first_name', 'last_name', 'other_names', 'gender', 'date_of_birth',
    'nationality', 'national_id', 'phone_number', 'alternative_phone',
    'province', 'district', 'sector', 'cell', 'village', 'school_name',
    'school_type', 'combination', 'year_of_completion', 'index_number',
    'total_points', 'division', 'application_year', 'entry_mode',
    'sponsorship_type', 'disability_status', 'disability_details',
    'guardian_name', 'guardian_relationship', 'guardian_phone', 'guardian_email'
  ];
  for (const field of allowedFields) {
    if (data[field as keyof StudentUpdateInput] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(data[field as keyof StudentUpdateInput]);
    }
  }
  if (updates.length === 0) throw new Error('No valid fields to update');
  updates.push(`updated_at = unixepoch()`);
  values.push(userId);
  const sql = `UPDATE students SET ${updates.join(', ')} WHERE user_id = ?`;
  await execute(sql, values);
  return await queryOne('SELECT * FROM students WHERE user_id = ?', [userId]);
};
