// app/dashboard/admin/students/page.tsx
'use client';

import StudentTable from '@/components/admin/StudentTable';

export default function AdminStudentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Students</h1>
      <StudentTable />
    </div>
  );
}