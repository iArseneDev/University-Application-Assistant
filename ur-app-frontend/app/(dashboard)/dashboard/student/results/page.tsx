'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ResultsForm from '@/components/student/ResultsForm';

export default function StudentResultsPage() {
  const router = useRouter();
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        await api.get('/student/profile');
        setHasProfile(true);
      } catch (error: any) {
        if (error.response?.status === 404) {
          router.push('/dashboard/student/profile');
        }
      } finally {
        setLoading(false);
      }
    };
    checkProfile();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!hasProfile) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Results</h1>
      <ResultsForm />
    </div>
  );
}