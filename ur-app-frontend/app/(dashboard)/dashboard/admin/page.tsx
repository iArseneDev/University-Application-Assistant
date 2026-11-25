// app/dashboard/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Stats {
  totalStudents: number;
  totalApplications: number;
  pending: number;    // SUBMITTED
  accepted: number;
  rejected: number;
  draft: number;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalApplications: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    draft: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, appsRes] = await Promise.all([
          api.get('/students'),
          api.get('/applications/all'), // admin endpoint for all applications
        ]);
        const students = studentsRes.data.data || [];
        const applications = appsRes.data.data || [];

        const pending = applications.filter((a: any) => a.status === 'SUBMITTED').length;
        const accepted = applications.filter((a: any) => a.status === 'ACCEPTED').length;
        const rejected = applications.filter((a: any) => a.status === 'REJECTED').length;
        const draft = applications.filter((a: any) => a.status === 'DRAFT').length;

        setStats({
          totalStudents: students.length,
          totalApplications: applications.length,
          pending,
          accepted,
          rejected,
          draft,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Students */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Total Students</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Total Applications</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalApplications}</p>
        </div>

        {/* Pending (SUBMITTED) */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Pending Review</h2>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </div>

        {/* Accepted */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Accepted</h2>
          <p className="text-3xl font-bold mt-2">{stats.accepted}</p>
        </div>

        {/* Rejected */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Rejected</h2>
          <p className="text-3xl font-bold mt-2">{stats.rejected}</p>
        </div>

        {/* Draft */}
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
          <h2 className="text-gray-500 text-sm uppercase tracking-wide">Draft Applications</h2>
          <p className="text-3xl font-bold mt-2">{stats.draft}</p>
        </div>
      </div>

      {/* Optional: quick insights */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Quick Summary</h3>
        <p className="text-gray-600">
          {stats.pending} applications waiting for review. {stats.accepted} students have been accepted so far.
        </p>
      </div>
    </div>
  );
}