import { execute, executeBatch, query, queryOne, generateUUID } from '../config/db';

export const createApplicationBatch = async (userId: string, programs: { program_id: string; priority: number }[], paymentId: string) => {
  const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (!student) throw new Error('Student profile not found');

  const payment = await queryOne('SELECT id, status FROM payments WHERE id = ? AND student_id = ?', [paymentId, student.id]);
  if (!payment) throw new Error('Invalid payment');
  if (payment.status !== 'APPROVED') throw new Error('Payment not approved');

  const used = await queryOne('SELECT id FROM applications WHERE payment_id = ? LIMIT 1', [paymentId]);
  if (used) throw new Error('This payment has already been used for an application batch');

  if (!programs.length || programs.length > 3) {
    throw new Error('You must submit between 1 and 3 program choices');
  }
  if (programs.some((p) => !p || typeof p.program_id !== 'string' || !Number.isInteger(p.priority))) {
    throw new Error('Each choice needs a program_id and integer priority');
  }
  if (new Set(programs.map((p) => p.program_id)).size !== programs.length) {
    throw new Error('Program choices must be unique');
  }
  const priorities = programs.map(p => p.priority);
  if (new Set(priorities).size !== priorities.length) {
    throw new Error('Priorities must be unique');
  }
  if (priorities.some(p => p < 1 || p > 3)) {
    throw new Error('Priorities must be between 1 and 3');
  }

  const validPrograms = await query(
    `SELECT id FROM programs WHERE id IN (${programs.map(() => '?').join(',')})`,
    programs.map((p) => p.program_id)
  );
  if (validPrograms.length !== programs.length) throw new Error('One or more selected programs do not exist');

  const inserted = [];
  const statements: Array<{ sql: string; params: any[] }> = [{
    sql: `UPDATE payments SET application_claimed = 1, updated_at = unixepoch()
          WHERE id = ? AND student_id = ? AND status = 'APPROVED' AND application_claimed = 0`,
    params: [paymentId, student.id],
  }];
  for (const { program_id, priority } of programs) {
    const id = generateUUID();
    statements.push({
      sql: `INSERT INTO applications (id, student_id, program_id, priority, payment_id, status)
            VALUES (?, ?, ?, ?, ?, 'SUBMITTED')`,
      params: [id, student.id, program_id, priority, paymentId],
    });
    inserted.push({ id, program_id, priority, status: 'SUBMITTED' });
  }
  const results = await executeBatch(statements);
  if (!results[0]?.meta?.changes) throw new Error('This payment has already been used for an application batch');
  return inserted;
};

export const getStudentApplications = async (userId: string) => {
  const student = await queryOne('SELECT id FROM students WHERE user_id = ?', [userId]);
  if (!student) return [];

  const apps = await query(
    `SELECT a.*, p.name as program_name, c.name as college_name
     FROM applications a
     JOIN programs p ON a.program_id = p.id
     JOIN colleges c ON p.college_id = c.id
     WHERE a.student_id = ?
     ORDER BY a.priority`,
    [student.id]
  );
  return apps;
};

export const getStudentApplicationsWithDetails = async (studentId: string) => {
  return await query(
    `SELECT a.*, p.name as program_name, c.name as college_name
     FROM applications a
     JOIN programs p ON a.program_id = p.id
     JOIN colleges c ON p.college_id = c.id
     WHERE a.student_id = ?
     ORDER BY a.created_at DESC`,
    [studentId]
  );
};

export const getAllApplications = async () => {
  const apps = await query(`
    SELECT a.*, s.first_name, s.last_name, u.email, p.name as program_name
    FROM applications a
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    JOIN programs p ON a.program_id = p.id
    ORDER BY a.created_at DESC
  `);
  return apps;
};

export const getApplicationById = async (id: string) => {
  return await queryOne('SELECT * FROM applications WHERE id = ?', [id]);
};

export const updateApplicationStatus = async (appId: string, status: string) => {
  const allowed = ['DRAFT','SUBMITTED','REVIEWED','ACCEPTED','REJECTED'];
  if (!allowed.includes(status)) throw new Error('Invalid status');
  await execute('UPDATE applications SET status = ? WHERE id = ?', [status, appId]);
  return getApplicationById(appId);
};
