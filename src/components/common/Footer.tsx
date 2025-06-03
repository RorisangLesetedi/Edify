'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Footer Links */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
          <Link href="/privacy" className="text-lg text-gray-600 hover:text-blue-600">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-lg text-gray-600 hover:text-blue-600">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-lg text-gray-600 hover:text-blue-600">
            Contact Us
          </Link>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Link href="#" className="hover:opacity-80">
            <Image 
              src="/images/img_vector_0.svg" 
              alt="Social media icon" 
              width={24} 
              height={24}
            />
          </Link>
          <Link href="#" className="hover:opacity-80">
            <Image 
              src="/images/img_vector_0_gray_600.svg" 
              alt="Social media icon" 
              width={24} 
              height={24}
            />
          </Link>
          <Link href="#" className="hover:opacity-80">
            <Image 
              src="/images/img_vector_0_gray_600_24x24.svg" 
              alt="Social media icon" 
              width={24} 
              height={24}
            />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-lg text-gray-600">
            © 2025 Edify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;