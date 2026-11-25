// types/index.ts
export interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'ADMIN';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}