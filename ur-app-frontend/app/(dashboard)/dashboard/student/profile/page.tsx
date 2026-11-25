// app/dashboard/student/profile/page.tsx
'use client';

import ProfileForm from '@/components/student/ProfileForm';

export default function StudentProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <ProfileForm />
    </div>
  );
}