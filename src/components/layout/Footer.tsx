import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/edify-logo.png"
                alt="Edify Logo"
                width={120}
                height={40}
              />
            </Link>
            <p className="text-gray-600 mb-6">
              Transforming education through personalized tutoring and innovative learning solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/tutors" className="text-gray-600 hover:text-blue-600">
                  Find Tutors
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-600">
                Email: support@edify.com
              </li>
              <li className="text-gray-600">
                Phone: +267 123 4567
              </li>
              <li className="text-gray-600">
                Address: Gaborone, Botswana
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Edify. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 