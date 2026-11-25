// app/dashboard/admin/applications/page.tsx
'use client';

import ApplicationTable from '@/components/admin/ApplicationTable';

export default function AdminApplicationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Applications</h1>
      <ApplicationTable />
    </div>
  );
}