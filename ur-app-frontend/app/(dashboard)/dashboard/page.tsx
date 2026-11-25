// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    api.get('/auth/me').then((res) => {
      router.replace(res.data?.data?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/student');
    }).catch(() => router.replace('/login'));
  }, [router]);

  return null;
}
