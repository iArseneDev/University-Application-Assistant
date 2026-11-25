import { Context } from 'hono';
import { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../services/blog.service';
import { sendSuccess, sendError } from '../helpers/response';

export const listBlogs = async (c: Context) => {
  try {
    const onlyPublished = c.req.query('published') === 'true';
    const blogs = await getAllBlogs(onlyPublished);
    return sendSuccess(c, blogs, 'Blogs retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const getBlog = async (c: Context) => {
  try {
    const id = c.req.param('id')!;
    const onlyPublished = c.req.query('published') === 'true';
    const blog = await getBlogById(id, onlyPublished);
    if (!blog) return sendError(c, 'Blog not found', 404);
    return sendSuccess(c, blog, 'Blog retrieved');
  } catch (error: any) {
    return sendError(c, error.message, 500);
  }
};

export const addBlog = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const data = await c.req.json();
    if (!data.title || !data.content) return sendError(c, 'Title and content required', 400);
    const authorId = c.get('userId');
    const blog = await createBlog(data, authorId);
    return sendSuccess(c, blog, 'Blog created', 201);
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const editBlog = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    const data = await c.req.json();
    const blog = await updateBlog(id, data);
    return sendSuccess(c, blog, 'Blog updated');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};

export const removeBlog = async (c: Context) => {
  try {
    const role = c.get('userRole');
    if (role !== 'ADMIN') return sendError(c, 'Forbidden', 403);
    const id = c.req.param('id')!;
    await deleteBlog(id);
    return sendSuccess(c, null, 'Blog deleted');
  } catch (error: any) {
    return sendError(c, error.message, 400);
  }
};