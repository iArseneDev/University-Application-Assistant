'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  status: 'DRAFT' | 'PUBLISHED';
  author_email: string;
  published_at?: number;
}

// Strip HTML tags to keep only plain text
const stripHtml = (html: string): string => {
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '', image_url: '', video_url: '', status: 'DRAFT' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/blogs');
      setBlogs(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert('Title is required');
    if (!form.content.trim()) return alert('Content is required');
    try {
      const payload = {
        ...form,
        content: stripHtml(form.content),  // ← convert to plain text
      };
      if (editingId) {
        await api.put(`/blogs/admin/${editingId}`, payload);
      } else {
        await api.post('/blogs/admin', payload);
      }
      setForm({ title: '', content: '', image_url: '', video_url: '', status: 'DRAFT' });
      setEditingId(null);
      fetchBlogs();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save blog');
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Delete this blog?')) return;
    try {
      await api.delete(`/blogs/admin/${id}`);
      fetchBlogs();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const editBlog = (blog: Blog) => {
    setForm({
      title: blog.title,
      content: blog.content,
      image_url: blog.image_url || '',
      video_url: blog.video_url || '',
      status: blog.status,
    });
    setEditingId(blog.id);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Blog Posts</h1>
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl mb-4">{editingId ? 'Edit' : 'Create'} Blog</h2>
        <div className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea
            placeholder="Content (plain text only – any HTML will be stripped)"
            rows={8}
            className="w-full border p-2 rounded"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <p className="text-xs text-gray-500">Use plain text: line breaks become paragraphs. Start lines with "- " or "1. " to create lists.</p>
          <Input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <Input placeholder="YouTube Video URL (optional)" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
          <select className="border p-2 rounded w-full" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Publish</option>
          </select>
          <div className="flex gap-2">
            <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Create'}</Button>
            {editingId && <Button variant="secondary" onClick={() => { setEditingId(null); setForm({ title: '', content: '', image_url: '', video_url: '', status: 'DRAFT' }); }}>Cancel</Button>}
          </div>
        </div>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100"><tr><th>Title</th><th>Status</th><th>Author</th><th>Published</th><th>Actions</th></tr></thead>
          <tbody>
            {blogs.map(blog => (
              <tr key={blog.id} className="border-b">
                <td className="px-4 py-2">{blog.title}</td>
                <td className="px-4 py-2">{blog.status}</td>
                <td className="px-4 py-2">{blog.author_email}</td>
                <td className="px-4 py-2">{blog.published_at ? new Date(blog.published_at * 1000).toLocaleDateString() : '-'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => editBlog(blog)} className="text-blue-600">Edit</button>
                  <button onClick={() => deleteBlog(blog.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}