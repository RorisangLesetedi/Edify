import { useState } from 'react';
import { UserRole } from '@/lib/supabase/config';
import Link from 'next/link';

type SignUpFormProps = {
  onSubmit: (data: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }) => Promise<void>;
};

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({ email, password, fullName, role });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Full Name Input */}
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">👤</span>
        <input
          id="fullName"
          type="text"
          placeholder="Enter your full name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl text-base outline-none focus:ring-0 placeholder-gray-400 text-gray-800"
        />
      </div>

      {/* Email Input */}
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">📧</span>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl text-base outline-none focus:ring-0 placeholder-gray-400 text-gray-800"
        />
      </div>

      {/* Password Input */}
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">•••</span>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-3 pl-12 pr-4 bg-gray-50 border border-transparent rounded-xl text-base outline-none focus:ring-0 placeholder-gray-400 text-gray-800"
        />
      </div>

      {/* Role Selection */}
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">👤</span>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full py-3 pl-12 pr-10 bg-gray-50 border border-transparent rounded-xl text-base outline-none focus:ring-0 appearance-none text-gray-500"
        >
          <option value="">Select a role</option>
          <option value={UserRole.STUDENT}>Student</option>
          <option value={UserRole.TUTOR}>Tutor</option>
          <option value={UserRole.PARENT}>Parent</option>
        </select>
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">▼</span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3 text-sm font-medium text-red-800">{error}</div>
          </div>
        </div>
      )}

      {/* Sign Up Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#8E37E6] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring-0 disabled:opacity-50 transition-all duration-300 uppercase tracking-wider mt-6"
      >
        {loading ? 'Creating account...' : 'SIGN UP'}
      </button>

      {/* Login Link */}
      <div className="text-center text-sm mt-8">
        <span className="text-gray-500">Already have an account?</span>{' '}
        <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500 relative pb-px after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
          Login
        </Link>
      </div>
    </form>
  );
} 