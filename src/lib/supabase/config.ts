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
}NEXT_PUBLIC_SUPABASE_URL=https://bssrztkywmshegftequa.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzc3J6dGt5d21zaGVnZnRlcXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2Mjc4ODYsImV4cCI6MjA2NDIwMzg4Nn0.xpMj0Z91zA6j3NalShVT8dXvUltY1sxp9z-5LXfRqR4

// Database types
export type Profile = {
  id: string;
  created_at: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
}; 