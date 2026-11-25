'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  published_at: number;
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs?published=true');
        setBlogs(res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div className="text-center p-8">Loading news...</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Latest News & Updates</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(blog => (
          <Link key={blog.id} href={`/blog/${blog.id}`} className="bg-white rounded shadow hover:shadow-lg transition">
            {blog.image_url && <img src={blog.image_url} alt={blog.title} className="w-full h-48 object-cover rounded-t" />}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
              <p className="text-gray-500 text-sm">{new Date(blog.published_at * 1000).toLocaleDateString()}</p>
              <p className="text-gray-600 mt-2 line-clamp-3">{blog.content.replace(/<[^>]*>/g, '').slice(0, 150)}...</p>
            </div>
          </Link>
        ))}
      </div>
      {blogs.length === 0 && <p className="text-center text-gray-500">No blog posts yet.</p>}
    </div>
  );
}