'use client';

import { createClient } from '@/lib/supabase/client';
import SignUpForm from '@/components/auth/SignUpForm';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/supabase/config';

export default function SignUpPage() {
  const supabase = createClient();
  const router = useRouter();

  const handleSignUp = async ({ email, password, fullName, role }: {
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
          role: role,
        },
      },
    });

    if (error) {
      throw error;
    }

    // Redirect to a confirmation page or dashboard after successful sign-up
    if (data?.user?.id) {
      // For now, redirect to sign-in, or a success message
      router.push('/auth/signin');
    }
  };

  return <SignUpForm onSubmit={handleSignUp} />;
} 