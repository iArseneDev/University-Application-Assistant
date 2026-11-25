import { execute, query, queryOne, generateUUID } from '../config/db';

export const saveStudentResult = async (userId: string, subjectId: string, grade: string, points: number) => {
  // Get the actual student profile ID from the user ID
  const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (!student) {
    throw new Error('Student profile not found. Please complete your profile first.');
  }
  const studentId = student.id;

  // Verify that the subject exists
  const subject = await queryOne('SELECT id FROM subjects WHERE id = ?', [subjectId]);
  if (!subject) {
    throw new Error('Invalid subject ID. The subject does not exist.');
  }

  // Check if a result already exists for this student+subject
  const existing = await queryOne(
    'SELECT id FROM student_results WHERE student_id = ? AND subject_id = ?',
    [studentId, subjectId]
  );

  if (existing) {
    await execute(
      'UPDATE student_results SET grade = ?, points = ? WHERE student_id = ? AND subject_id = ?',
      [grade, points, studentId, subjectId]
    );
  } else {
    const id = generateUUID();
    await execute(
      `INSERT INTO student_results (id, student_id, subject_id, grade, points)
       VALUES (?, ?, ?, ?, ?)`,
      [id, studentId, subjectId, grade, points]
    );
  }

  return { subject_id: subjectId, grade, points };
};

export const getStudentResults = async (userId: string) => {
  const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (!student) return [];

  const results = await query(
    `
      SELECT sr.*, s.name as subject_name, s.code
      FROM student_results sr
      JOIN subjects s ON sr.subject_id = s.id
      WHERE sr.student_id = ?
      ORDER BY s.name
    `,
    [student.id]
  );
  return results;
};