// app/register/page.tsx
'use client';

import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
          <RegisterForm />

          {/* Links */}
          <div className="mt-6 text-center text-sm space-y-2">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Login
              </Link>
            </p>
            <Link
              href="/"
              className="inline-block text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}