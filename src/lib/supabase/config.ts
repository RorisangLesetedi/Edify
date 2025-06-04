import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  TUTOR = 'tutor',
  STUDENT = 'student',
  PARENT = 'parent',
}

// Database types
export type Profile = {
  id: string;
  created_at: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
}; 