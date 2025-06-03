'use client';

import { useRouter } from 'next/navigation';
import SignInForm from '@/components/auth/SignInForm';
import { supabase } from '@/lib/supabase/config';

export default function SignInPage() {
  const router = useRouter();

  const handleSignIn = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    // Redirect based on role
    if (profile?.role) {
      switch (profile.role) {
        case 'admin':
          router.push('/dashboard/admin');
          break;
        case 'tutor':
          router.push('/dashboard/tutor');
          break;
        case 'student':
          router.push('/dashboard/student');
          break;
        case 'parent':
          router.push('/dashboard/parent');
          break;
        default:
          router.push('/dashboard');
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignInForm onSubmit={handleSignIn} />
        </div>
      </div>
    </div>
  );
} 