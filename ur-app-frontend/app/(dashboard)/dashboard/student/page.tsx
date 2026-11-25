'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function StudentOverview() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await api.get('/student/profile');
        setProfile(profileRes.data.data);
        const appsRes = await api.get('/applications');
        setApplications(appsRes.data.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          router.push('/dashboard/student/profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!profile) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Welcome, {profile.first_name || profile.email}</h2>
          <p className="text-gray-600">Application Status: {profile.status || 'DRAFT'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Applications</h2>
          <p className="text-gray-600">Total submitted: {applications.length}</p>
          <p className="text-gray-600">Pending: {applications.filter((a: any) => a.status === 'SUBMITTED').length}</p>
        </div>
      </div>
    </div>
  );
}