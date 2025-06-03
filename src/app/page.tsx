'use client';

import * as React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/common/HeroSection';
import Button from '@/components/ui/Button';
import Image from 'next/image';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-blue-600 mb-12">
            HOW IT WORKS
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-12">
            {/* Free Assessment */}
            <div className="bg-blue-50 border border-gray-300 rounded-lg p-6 w-full md:w-80 h-40 flex flex-col items-center text-center">
              <Image 
                src="/images/img_notebookpenicon_1.png" 
                alt="Notebook pen icon" 
                width={34} 
                height={34} 
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-blue-600 mb-2">Free Assessment</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We assess your child's<br />
                learning needs to provide<br />
                tailored tutoring.
              </p>
            </div>
            {/* Choose a Tutor */}
            <div className="bg-blue-50 border border-gray-300 rounded-lg p-6 w-full md:w-80 h-40 flex flex-col items-center text-center">
              <Image 
                src="/images/img_findprofessionalmanicon_1.png" 
                alt="Find professional man icon" 
                width={34} 
                height={33} 
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-blue-600 mb-2">Choose a Tutor</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Pick the tutor based on<br />
                subjects, budget, and<br />
                availability.
              </p>
            </div>
            {/* Start Learning */}
            <div className="bg-blue-50 border border-gray-300 rounded-lg p-6 w-full md:w-80 h-40 flex flex-col items-center text-center">
              <Image 
                src="/images/img_rocketlaunchicon_1.png" 
                alt="Rocket launch icon" 
                width={34} 
                height={34} 
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-blue-600 mb-2">Start Learning</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Begin learning with the right<br />
                tutor at your convenience.
              </p>
            </div>
          </div>
          <div className="text-center">
            <Button variant="primary" size="medium">
              Find my Tutor
            </Button>
          </div>
        </div>
      </section>
      {/* Why Choose Edify Section */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-black text-center text-blue-600 mb-6">
            Why Choose Edify?
          </h2>
          <p className="text-lg text-gray-800 text-center mb-12 max-w-4xl mx-auto">
            Edify offers students access to a network of qualified tutors who can provide personalized academic support and help them achieve their learning objectives.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Tailored Learning */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-56 flex flex-col items-center text-center">
              <Image 
                src="/images/img_lightlightbulbicon_1.png" 
                alt="Light bulb icon" 
                width={24} 
                height={23} 
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-blue-600 mb-2">Tailored Learning</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We offer free assessments<br />
                to build personalized<br />
                learning plans for every child.
              </p>
            </div>
            {/* Flexible Pricing */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-56 flex flex-col items-center text-center">
              <Image 
                src="/images/img_moneybagicon_1.png" 
                alt="Money bag icon" 
                width={24} 
                height={24} 
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-blue-600 mb-2">Flexible Pricing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Only pay for what your<br />
                child needs — no rigid<br />
                packages or fixed tuition fees.
              </p>
            </div>
            {/* Access to Top Tutors */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-56 flex flex-col items-center text-center">
              <Image 
                src="/images/img_globelineicon_1.png" 
                alt="Globe line icon" 
                width={24} 
                height={24} 
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-blue-600 mb-2">Access to Top Tutors</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get access to qualified<br />
                tutors across Botswana,<br />
                regardless of location
              </p>
            </div>
            {/* Track Progress */}
            <div className="bg-white border border-gray-300 rounded-lg p-6 h-56 flex flex-col items-center text-center">
              <Image 
                src="/images/img_columncharticon_1.png" 
                alt="Column chart icon" 
                width={24} 
                height={23} 
                className="mb-4"
              />
              <h3 className="text-lg font-bold text-blue-600 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Parents can monitor<br />
                learning milestones and<br />
                improvement in real-time
              </p>
            </div>
          </div>
          <div className="text-center">
            <Button variant="primary" size="large">
              Book a Free Assessment
            </Button>
          </div>
        </div>
      </section>
      {/* Become A Tutor Section */}
      <section className="py-20 bg-blue-600 bg-opacity-90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Become A Tutor
          </h2>
          <p className="text-lg text-white mb-8 max-w-4xl mx-auto">
            Join our platform and start helping students succeed. Flexible hour, competitive rates, and rewarding work
          </p>
          <Button variant="primary" size="medium">
            Sign Up as a Tutor
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;