// src/services/blog.service.ts
import { query, queryOne, execute, generateUUID } from '../config/db';

// Helper to remove HTML/XML tags
const stripHtml = (input: string): string => {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, '');
};

export const getAllBlogs = async (onlyPublished = false) => {
  let sql = `
    SELECT b.*, u.email as author_email
    FROM blogs b
    JOIN users u ON b.author_id = u.id
    ORDER BY b.published_at DESC, b.created_at DESC
  `;
  if (onlyPublished) {
    sql = `
      SELECT b.*, u.email as author_email
      FROM blogs b
      JOIN users u ON b.author_id = u.id
      WHERE b.status = 'PUBLISHED' AND b.published_at <= unixepoch()
      ORDER BY b.published_at DESC
    `;
  }
  return await query(sql);
};

export const getBlogById = async (id: string, onlyPublished = false) => {
  const sql = onlyPublished
    ? `SELECT b.*, u.email as author_email FROM blogs b JOIN users u ON b.author_id = u.id WHERE b.id = ? AND b.status = 'PUBLISHED' AND b.published_at <= unixepoch()`
    : `SELECT b.*, u.email as author_email FROM blogs b JOIN users u ON b.author_id = u.id WHERE b.id = ?`;
  return await queryOne(sql, [id]);
};

export const createBlog = async (data: any, authorId: string) => {
  const id = generateUUID();
  const now = Math.floor(Date.now() / 1000);
  const publishedAt = data.status === 'PUBLISHED' ? now : null;
  await execute(
    `INSERT INTO blogs (id, title, content, image_url, video_url, author_id, status, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      stripHtml(data.title),   // sanitize title
      stripHtml(data.content), // sanitize content
      data.image_url || null,
      data.video_url || null,
      authorId,
      data.status,
      publishedAt
    ]
  );
  return getBlogById(id);
};

export const updateBlog = async (id: string, data: any) => {
  const updates: string[] = [];
  const values: any[] = [];
  if (data.title !== undefined) {
    updates.push('title = ?');
    values.push(stripHtml(data.title));
  }
  if (data.content !== undefined) {
    updates.push('content = ?');
    values.push(stripHtml(data.content));
  }
  if (data.image_url !== undefined) {
    updates.push('image_url = ?');
    values.push(data.image_url);
  }
  if (data.video_url !== undefined) {
    updates.push('video_url = ?');
    values.push(data.video_url);
  }
  if (data.status !== undefined) {
    updates.push('status = ?');
    values.push(data.status);
    if (data.status === 'PUBLISHED') {
      updates.push('published_at = unixepoch()');
    } else {
      updates.push('published_at = NULL');
    }
  }
  updates.push('updated_at = unixepoch()');
  if (updates.length === 0) return getBlogById(id);
  values.push(id);
  await execute(`UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`, values);
  return getBlogById(id);
};

export const deleteBlog = async (id: string) => {
  await execute('DELETE FROM blogs WHERE id = ?', [id]);
};