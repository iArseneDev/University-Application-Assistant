'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import FormattedText from '@/components/ui/FormattedText';

interface Blog {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  video_url?: string;
  published_at: number;
  author_email: string;
}

export default function BlogDetailClient({ id }: { id: string }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}?published=true`);
        setBlog(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!blog) return;
      try {
        const res = await api.get('/blogs?published=true');
        const allBlogs = res.data.data || [];
        const filtered = allBlogs.filter((b: Blog) => b.id !== blog.id);
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setRelated(shuffled.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    if (blog) fetchRelated();
  }, [blog]);

  const getYouTubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!blog) return <div className="text-center p-8">Blog not found</div>;

  const videoId = blog.video_url ? getYouTubeEmbed(blog.video_url) : null;

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="text-gray-500 mb-6">
        {new Date(blog.published_at * 1000).toLocaleDateString()} • By {blog.author_email}
      </div>
      {blog.image_url && (
        <img src={blog.image_url} alt={blog.title} className="w-full rounded-lg mb-6" />
      )}
      <FormattedText text={blog.content} />
      {videoId && (
        <div className="aspect-video my-8">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((post) => (
              <a key={post.id} href={`/blog/${post.id}`} className="flex gap-4 bg-white rounded-lg shadow hover:shadow-md transition">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-24 h-24 object-cover rounded-l" />
                )}
                <div className="p-3">
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.published_at * 1000).toLocaleDateString()}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}