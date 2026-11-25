import { query, queryOne } from '../config/db';

export const getAllStudents = async () => {
  const students = await query(`
    SELECT s.*, u.email, u.created_at as user_created_at
    FROM students s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `);
  return students;
};

export const getStudentFullDetails = async (studentId: string) => {
  // Get profile
  const profile = await queryOne(`
    SELECT s.*, u.email 
    FROM students s 
    JOIN users u ON s.user_id = u.id 
    WHERE s.id = ?
  `, [studentId]);
  if (!profile) return null;
  
  // Get results
  const results = await query(`
    SELECT sr.*, sub.name as subject_name, sub.code
    FROM student_results sr
    JOIN subjects sub ON sr.subject_id = sub.id
    WHERE sr.student_id = ?
  `, [studentId]);
  
  // Get applications
  const applications = await query(`
    SELECT a.*, p.name as program_name, c.name as college_name
    FROM applications a
    JOIN programs p ON a.program_id = p.id
    JOIN colleges c ON p.college_id = c.id
    WHERE a.student_id = ?
    ORDER BY a.priority
  `, [studentId]);
  
  return { profile, results, applications };
};