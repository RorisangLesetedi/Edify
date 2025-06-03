import Link from 'next/link';
import Button from '../ui/Button';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-black tracking-wider text-white font-inter">
              EDIFY
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="secondary" size="small" className="bg-white text-blue-600 hover:bg-blue-50">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary" size="small" className="bg-purple-600 text-white hover:bg-purple-700 border-none">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 