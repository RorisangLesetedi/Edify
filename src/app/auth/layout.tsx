import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-0 sm:p-0 lg:p-0">
      <div className="flex bg-white rounded-none shadow-none overflow-hidden w-full h-screen flex-col lg:flex-row">
        {/* Left side - Background image with blue overlay (hidden on small screens) */}
        <div
          className="flex flex-1 bg-cover bg-center relative rounded-tr-3xl rounded-br-3xl"
          style={{ backgroundImage: 'url(/images/login-bg.png)' }}
        >
          <div className="absolute inset-0 bg-blue-800 bg-opacity-70 flex flex-col justify-center items-center p-8 text-white text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">Start Your Journey with Edify</h2>
              <p className="text-lg opacity-90">Connect with qualified tutors for personalized learning experiences.</p>
            </div>
          </div>
        </div>

        {/* Right side - Login/Signup form container */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 w-full">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8 text-center">
              <Link href="/" className="flex justify-center mb-6">
                <Image
                  src="/images/edify-logo.png" 
                  alt="Edify Logo" 
                  width={120} 
                  height={48} 
                  priority
                />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
              <p className="text-gray-600">Please login to access your account.</p>
            </div>
            {children}
            <p className="mt-8 text-center text-sm text-gray-600">
              By continuing, you agree to Edify's{' '}
              <Link href="/terms" className="font-medium text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 