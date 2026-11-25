'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  image_url?: string;
  published_at: number;
}

export default function HomePage() {
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs?published=true');
        const allBlogs = res.data.data || [];
        // Filter only blogs with an image URL, take latest 2
        const withImage = allBlogs
          .filter((blog: Blog) => blog.image_url && blog.image_url.trim() !== '')
          .slice(0, 2);
        setLatestBlogs(withImage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div>
      {/* Hero with gradient */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">University Application Assistant</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Streamline your university applications, check eligibility, and track progress all in one place.
          </p>
          <div className="space-x-4">
            <a href="/register" className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Get Started</a>
            <a href="/login" className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">Sign In</a>
          </div>
        </div>
      </section>

      {/* Pricing Block */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 mb-2">Application Fee</p>
              <p className="text-5xl font-bold text-blue-600">5,000 FRW</p>
              <p className="text-gray-500 mt-2">per application batch, with up to 3 program choices</p>
              <div className="mt-6 border-t pt-4">
                <p className="text-sm text-gray-500">✔ Pay by mobile money using the instructions in your dashboard</p>
                <p className="text-sm text-gray-500 mt-1">✔ Application batches are reviewed after receipt approval</p>
                <p className="text-sm text-gray-500 mt-1">✔ Track application decisions in your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Application Gate?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-semibold mb-2">Check Eligibility</h3>
              <p className="text-gray-600">Explore university programs and submit your preferred choices.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">📝</div>
              <h3 className="text-xl font-semibold mb-2">Apply Easily</h3>
              <p className="text-gray-600">Fill once, submit to multiple universities with just a few clicks.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Application</h3>
              <p className="text-gray-600">Real‑time status updates and notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section (only if there are blogs with images) */}
      {latestBlogs.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Latest from Our Blog</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {latestBlogs.map((blog) => (
                <Link href={`/blog/${blog.id}`} key={blog.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                  {blog.image_url && (
                    <img src={blog.image_url} alt={blog.title} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(blog.published_at * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/blog" className="text-blue-600 hover:underline">View all blog posts →</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
