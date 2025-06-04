'use client';

import { createClient } from '@/lib/supabase/client';
import SignInForm from '@/components/auth/SignInForm';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/supabase/config';

export default function SignInPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignIn = async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Redirect based on user role after successful sign-in
    if (data?.user?.id) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        // Optionally handle the error more gracefully for the user
        return;
      }

      switch (profileData?.role) {
        case UserRole.ADMIN:
          router.push('/dashboard/admin');
          break;
        case UserRole.TUTOR:
          router.push('/dashboard/tutor');
          break;
        case UserRole.STUDENT:
          router.push('/dashboard/student');
          break;
        case UserRole.PARENT:
          router.push('/dashboard/parent');
          break;
        default:
          router.push('/dashboard'); // Fallback to general dashboard
          break;
      }
    }
  };

  return <SignInForm onSubmit={handleSignIn} />;
} 