'use client';

import { useRouter } from 'next/navigation';
import SignUpForm from '@/components/auth/SignUpForm';
import { supabase } from '@/lib/supabase/config';
import type { UserRole } from '@/lib/supabase/config';

export default function SignUpPage() {
  const router = useRouter();

  const handleSignUp = async ({
    email,
    password,
    fullName,
    role,
  }: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Create profile in profiles table
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: data.user?.id,
        email,
        full_name: fullName,
        role,
      },
    ]);

    if (profileError) {
      throw profileError;
    }

    // Redirect based on role
    switch (role) {
      case 'student':
        router.push('/onboarding/student');
        break;
      case 'tutor':
        router.push('/onboarding/tutor');
        break;
      case 'parent':
        router.push('/onboarding/parent');
        break;
      default:
        router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUpForm onSubmit={handleSignUp} />
        </div>
      </div>
    </div>
  );
} 