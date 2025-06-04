import { useState } from 'react';
import Link from 'next/link';

type SignInFormProps = {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
};

export default function SignInForm({ onSubmit }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">📧</span>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-3 pl-12 pr-4 bg-gray-100 border border-transparent rounded-xl text-base outline-none focus:ring-0 focus:outline-none placeholder-gray-400 text-gray-800"
        />
      </div>

      <div className="relative w-full">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">•••</span>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full py-3 pl-12 pr-4 bg-gray-100 border border-transparent rounded-xl text-base outline-none focus:ring-0 focus:outline-none placeholder-gray-400 text-gray-800"
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3 text-sm font-medium text-red-800">{error}</div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#8E37E6] px-4 py-3 text-base font-semibold text-white shadow-md hover:bg-purple-700 focus:outline-none focus:ring-0 disabled:opacity-50 transition-all duration-300 uppercase tracking-wider mt-6"
      >
        {loading ? 'Logging in...' : 'LOGIN'}
      </button>

      <div className="text-center text-sm mt-8">
        <span className="text-gray-500">Don't have an account?</span>{' '}
        <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 relative pb-px after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
          Register
        </Link>
      </div>
    </form>
  );
} 