import { query, queryOne, execute, generateUUID } from '../config/db';

export const createPayment = async (studentId: string, transactionId: string, payerName: string | null, phoneNumber: string) => {
  const id = generateUUID();
  const payer = payerName || null;
  await execute(
    `INSERT INTO payments (id, student_id, transaction_id, payer_name, phone_number, amount, status)
     VALUES (?, ?, ?, ?, ?, 5000, 'PENDING')`,
    [id, studentId, transactionId, payer, phoneNumber]
  );
  return getPaymentById(id);
};

export const getPaymentById = async (id: string) => {
  return await queryOne('SELECT * FROM payments WHERE id = ?', [id]);
};

export const getStudentPayments = async (studentId: string) => {
  return await query('SELECT * FROM payments WHERE student_id = ? ORDER BY created_at DESC', [studentId]);
};

export const getAllPayments = async (filters: { status?: string; search?: string }) => {
  let sql = 'SELECT p.*, s.first_name, s.last_name, s.user_id FROM payments p JOIN students s ON p.student_id = s.id';
  const conditions: string[] = [];
  const values: any[] = [];
  if (filters.status) {
    conditions.push('p.status = ?');
    values.push(filters.status);
  }
  if (filters.search) {
    conditions.push('(p.transaction_id LIKE ? OR p.payer_name LIKE ? OR p.phone_number LIKE ?)');
    values.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
  }
  if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY p.created_at DESC';
  return await query(sql, values);
};

export const updatePaymentStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
  const approvedAt = status === 'APPROVED' ? Math.floor(Date.now() / 1000) : null;
  await execute('UPDATE payments SET status = ?, approved_at = ?, updated_at = unixepoch() WHERE id = ?', [status, approvedAt, id]);
  return getPaymentById(id);
};

export const hasUnusedApprovedPayment = async (studentId: string): Promise<boolean> => {
  // Check if there is an approved payment without any applications linked
  const result = await queryOne(
    `SELECT p.id FROM payments p
     LEFT JOIN applications a ON a.payment_id = p.id
     WHERE p.student_id = ? AND p.status = 'APPROVED' AND p.application_claimed = 0 AND a.id IS NULL
     LIMIT 1`,
    [studentId]
  );
  return !!result;
};

export const usePaymentForApplication = async (paymentId: string) => {
  // No need to change payment status; we just ensure it's linked to applications.
  return;
};

export const isPaymentUsed = async (paymentId: string): Promise<boolean> => {
  const apps = await queryOne('SELECT id FROM applications WHERE payment_id = ? LIMIT 1', [paymentId]);
  return !!apps;
};

export const getUnusedApprovedPaymentId = async (studentId: string): Promise<string | null> => {
  const result = await queryOne(
    `SELECT p.id FROM payments p
     LEFT JOIN applications a ON a.payment_id = p.id
     WHERE p.student_id = ? AND p.status = 'APPROVED' AND p.application_claimed = 0 AND a.id IS NULL
     LIMIT 1`,
    [studentId]
  );
  return result?.id || null;
};
