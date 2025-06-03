'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 border border-blue-600 h-22 flex items-center justify-between px-10 py-1">
      <div className="flex items-center">
        <h1 className="text-6xl font-extrabold text-white leading-tight">
          Edify
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <Link href="/login">
          <Button variant="secondary" size="medium">
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="primary" size="medium">
            Sign Up
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;