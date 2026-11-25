// components/student/ProfileForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const profileSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  gender: z.enum(['MALE', 'FEMALE']),
  date_of_birth: z.string(),
  nationality: z.string().min(1),
  national_id: z.string().min(1),
  phone_number: z.string().min(1),
  alternative_phone: z.string().optional(),
  province: z.string().min(1),
  district: z.string().min(1),
  sector: z.string().min(1),
  cell: z.string().min(1),
  village: z.string().min(1),
  school_name: z.string().min(1),
  school_type: z.string().min(1),
  combination: z.string().min(1),
  year_of_completion: z.coerce.number().min(1900).max(2030),
  index_number: z.string().min(1),
  total_points: z.coerce.number().min(0),
  division: z.string().optional(),
  application_year: z.coerce.number().min(2000).max(2030),
  entry_mode: z.string().min(1),
  sponsorship_type: z.enum(['GOVERNMENT', 'PRIVATE', 'SELF']),
  disability_status: z.boolean().optional(),
  disability_details: z.string().optional(),
  guardian_name: z.string().min(1),
  guardian_relationship: z.string().min(1),
  guardian_phone: z.string().min(1),
  guardian_email: z.string().email().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      disability_status: false,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/student/profile');
        const data = res.data.data;
        setProfileExists(true);
        Object.keys(data).forEach((key) => {
          if (key in profileSchema.shape) {
            setValue(key as any, data[key]);
          }
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          setProfileExists(false);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    const payload = {
      ...data,
      disability_status: data.disability_status ? 1 : 0,
    };

    try {
      if (profileExists) {
        await api.put('/student/profile', payload);
        alert('Profile updated successfully');
      } else {
        await api.post('/student/profile', payload);
        alert('Profile created successfully');
        setProfileExists(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  if (loading) return <div className="text-center p-8">Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="First Name" {...register('first_name')} error={errors.first_name?.message} />
        <Input label="Last Name" {...register('last_name')} error={errors.last_name?.message} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select {...register('gender')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
        </div>

        <Input label="Date of Birth" type="date" {...register('date_of_birth')} error={errors.date_of_birth?.message} />
        <Input label="Nationality" {...register('nationality')} error={errors.nationality?.message} />
        <Input label="National ID" {...register('national_id')} error={errors.national_id?.message} />
        <Input label="Phone Number" {...register('phone_number')} error={errors.phone_number?.message} />
        <Input label="Alternative Phone" {...register('alternative_phone')} error={errors.alternative_phone?.message} />
        <Input label="Province" {...register('province')} error={errors.province?.message} />
        <Input label="District" {...register('district')} error={errors.district?.message} />
        <Input label="Sector" {...register('sector')} error={errors.sector?.message} />
        <Input label="Cell" {...register('cell')} error={errors.cell?.message} />
        <Input label="Village" {...register('village')} error={errors.village?.message} />
        <Input label="School Name" {...register('school_name')} error={errors.school_name?.message} />
        <Input label="School Type" {...register('school_type')} error={errors.school_type?.message} />
        <Input label="Combination (e.g., PCM, MCB)" {...register('combination')} error={errors.combination?.message} />
        <Input label="Year of Completion" type="number" {...register('year_of_completion')} error={errors.year_of_completion?.message} />
        <Input label="Index Number" {...register('index_number')} error={errors.index_number?.message} />
        <Input label="Total Points" type="number" {...register('total_points')} error={errors.total_points?.message} />
        <Input label="Division (e.g., I, II, III)" {...register('division')} error={errors.division?.message} />
        <Input label="Application Year" type="number" {...register('application_year')} error={errors.application_year?.message} />
        <Input label="Entry Mode (e.g., DIRECT, MATURE, O'LEVEL)" {...register('entry_mode')} error={errors.entry_mode?.message} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sponsorship Type</label>
          <select {...register('sponsorship_type')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="GOVERNMENT">Government</option>
            <option value="PRIVATE">Private</option>
            <option value="SELF">Self</option>
          </select>
          {errors.sponsorship_type && <p className="mt-1 text-sm text-red-600">{errors.sponsorship_type.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register('disability_status')} className="w-4 h-4 text-blue-600" />
          <label className="text-sm font-medium text-gray-700">Has Disability</label>
        </div>
        <Input label="Disability Details" {...register('disability_details')} error={errors.disability_details?.message} />

        <Input label="Guardian Name" {...register('guardian_name')} error={errors.guardian_name?.message} />
        <Input label="Guardian Relationship" {...register('guardian_relationship')} error={errors.guardian_relationship?.message} />
        <Input label="Guardian Phone" {...register('guardian_phone')} error={errors.guardian_phone?.message} />
        <Input label="Guardian Email" type="email" {...register('guardian_email')} error={errors.guardian_email?.message} />
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        {profileExists ? 'Update Profile' : 'Create Profile'}
      </Button>
    </form>
  );
}