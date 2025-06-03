'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const handleGetStarted = () => {
    // Navigate to assessment or signup
    console.log('Get Started clicked');
  };

  return (
    <section className="relative h-96 overflow-hidden rounded-xl mx-4 mt-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/img_fluxdevawarmandvibrantphotoofanenthusiasticafricant0_1.png"
          alt="Students learning together"
          fill
          className="object-cover rounded-xl"
        />
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 rounded-xl"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-8">
        <h1 className="text-4xl font-black text-white leading-tight mb-4 max-w-4xl">
          Find the Right Tutor for Your Child —Tailored Help for PSLE to A-Levels
        </h1>
        
        <p className="text-sm text-white mb-8 max-w-2xl">
          Get a free assessment, choose the tutor you want, and only pay for what your child needs
        </p>
        
        <Button 
          variant="primary" 
          size="medium"
          onClick={handleGetStarted}
        >
          Get Started Now
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;