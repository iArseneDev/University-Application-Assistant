// components/forms/RegisterForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validators';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type RegisterFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post('/auth/register', {
        email: data.email,
        password: data.password,
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••"
        {...register('password')}
        error={errors.password?.message}
      />
      <Input
        label="Confirm Password"
        type="password"
        placeholder="••••••"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />
      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Create Account
      </Button>
    </form>
  );
}
