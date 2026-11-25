export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: 'STUDENT' | 'ADMIN';
  is_verified: number;
  created_at: number;
  updated_at: number;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  other_names?: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth: string;
  nationality: string;
  national_id: string;
  phone_number: string;
  alternative_phone?: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  school_name: string;
  school_type: string;
  combination: string;
  year_of_completion: number;
  index_number: string;
  total_points: number;
  division?: string;
  application_year: number;
  entry_mode: string;
  sponsorship_type: 'GOVERNMENT' | 'PRIVATE' | 'SELF';
  disability_status: number;
  disability_details?: string;
  guardian_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  guardian_email?: string;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface StudentCreateInput {
  first_name: string;
  last_name: string;
  other_names?: string;
  gender: 'MALE' | 'FEMALE';
  date_of_birth: string;
  nationality: string;
  national_id: string;
  phone_number: string;
  alternative_phone?: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  school_name: string;
  school_type: string;
  combination: string;
  year_of_completion: number;
  index_number: string;
  total_points: number;
  division?: string;
  application_year: number;
  entry_mode: string;
  sponsorship_type: 'GOVERNMENT' | 'PRIVATE' | 'SELF';
  disability_status?: number;
  disability_details?: string;
  guardian_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  guardian_email?: string;
}

export interface StudentUpdateInput {
  first_name?: string;
  last_name?: string;
  other_names?: string;
  gender?: 'MALE' | 'FEMALE';
  date_of_birth?: string;
  nationality?: string;
  national_id?: string;
  phone_number?: string;
  alternative_phone?: string;
  province?: string;
  district?: string;
  sector?: string;
  cell?: string;
  village?: string;
  school_name?: string;
  school_type?: string;
  combination?: string;
  year_of_completion?: number;
  index_number?: string;
  total_points?: number;
  division?: string;
  application_year?: number;
  entry_mode?: string;
  sponsorship_type?: 'GOVERNMENT' | 'PRIVATE' | 'SELF';
  disability_status?: number;
  disability_details?: string;
  guardian_name?: string;
  guardian_relationship?: string;
  guardian_phone?: string;
  guardian_email?: string;
}