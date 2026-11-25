import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware';
import { listBlogs, getBlog, addBlog, editBlog, removeBlog } from '../controllers/blog.controller';

const blogsRoutes = new Hono();

// Public routes (some are protected)
blogsRoutes.get('/', listBlogs);
blogsRoutes.get('/:id', getBlog);

// Admin only
blogsRoutes.use('/admin/*', authMiddleware);
blogsRoutes.post('/admin', addBlog);
blogsRoutes.put('/admin/:id', editBlog);
blogsRoutes.delete('/admin/:id', removeBlog);

export { blogsRoutes };