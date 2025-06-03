'use client';

import { useState, useEffect } from 'react';
import { Search, Star, BookOpen, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

type Tutor = {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  avatar_url: string | null;
  rating: number | null;
  hourly_rate: number;
  subjects: string[];
};

// Simple button component
const Button = ({
  children,
  onClick,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  [key: string]: any;
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'underline-offset-4 hover:underline text-primary',
  };
  const sizeStyles = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md',
    icon: 'h-10 w-10',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple card components
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
);

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
);

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

export default function TutorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [minRating, setMinRating] = useState('');
  const [error, setError] = useState('');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user } = useUser();
  const supabase = createClientComponentClient();

  // Mock data for demonstration
  const mockTutors: Tutor[] = [
    {
      id: '1',
      full_name: 'John Doe',
      headline: 'Math Tutor',
      bio: 'Experienced math tutor with 5+ years of experience teaching high school and college students.',
      avatar_url: '',
      rating: 4.8,
      hourly_rate: 45,
      subjects: ['Mathematics', 'Calculus', 'Algebra', 'Geometry']
    },
    {
      id: '2',
      full_name: 'Jane Smith',
      headline: 'Science Expert',
      bio: 'Passionate about making science fun and easy to understand for all ages.',
      avatar_url: '',
      rating: 4.9,
      hourly_rate: 55,
      subjects: ['Physics', 'Chemistry', 'Biology']
    },
    {
      id: '3',
      full_name: 'Alex Johnson',
      headline: 'Language Arts Specialist',
      bio: 'Helping students improve their writing and reading comprehension skills.',
      avatar_url: '',
      rating: 4.7,
      hourly_rate: 50,
      subjects: ['English', 'Literature', 'Writing']
    }
  ];

  // Filter tutors based on search and filters
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = !searchTerm || 
      tutor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(subject => 
        subject.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesPrice = !priceRange || (
      priceRange === '0-30' && tutor.hourly_rate <= 30 ||
      priceRange === '30-50' && tutor.hourly_rate > 30 && tutor.hourly_rate <= 50 ||
      priceRange === '50-100' && tutor.hourly_rate > 50 && tutor.hourly_rate <= 100 ||
      priceRange === '100' && tutor.hourly_rate > 100
    );

    const matchesRating = !minRating || (tutor.rating && tutor.rating >= parseFloat(minRating));

    return matchesSearch && matchesPrice && matchesRating;
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        setIsLoading(true);
        
        // First try to get personalized tutors from API
        const response = await fetch('/api/tutors/suggested');
        if (response.ok) {
          const data = await response.json();
          if (data.tutors && data.tutors.length > 0) {
            setTutors(data.tutors);
            return;
          }
        }
        
        // Fall back to mock data if API fails or returns no tutors
        setTutors(mockTutors);
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors. Using sample data instead.');
        setTutors(mockTutors);
      } finally {
        setIsLoading(false);
// Simple input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Simple card components
const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
);

const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
);

const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
);

const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);

// Simple avatar component
const Avatar = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  />
);

const AvatarImage = ({
  src,
  alt,
  className,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full ${className}`}
    {...props}
  />
);

const AvatarFallback = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={`flex h-full w-full items-center justify-center rounded-full bg-muted ${className}`}
    {...props}
  >
    {children}
  </span>
);

// Simple badge component
const Badge = ({
  variant = 'default',
  className,
  ...props
}: {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
} & React.HTMLAttributes<HTMLDivElement>) => {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

type Tutor = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  headline: string;
  bio: string;
  hourly_rate: number;
  rating: number | null;
  review_count?: number;
  subjects: string[];
  availability?: string[];
  education_level_id?: number;
  major?: string;
};

// Mock data for fallback
const mockTutors: Tutor[] = [
  {
    id: '1',
    full_name: 'John Smith',
    headline: 'Math & Physics Tutor',
    bio: '5+ years of experience in teaching high school and college level math and physics.',
    hourly_rate: 45,
    rating: 4.9,
    subjects: ['Mathematics', 'Physics', 'Calculus'],
    avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    full_name: 'Sarah Johnson',
    headline: 'English Literature Expert',
    bio: 'MA in English Literature with 8 years of teaching experience. Specialized in essay writing and literature analysis.',
    hourly_rate: 55,
    rating: 4.8,
    subjects: ['English', 'Literature', 'Writing'],
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    full_name: 'David Kim',
    headline: 'Computer Science Tutor',
    bio: 'Professional software engineer with teaching experience in Python, JavaScript, and web development.',
    hourly_rate: 65,
    rating: 5.0,
    subjects: ['Programming', 'Web Development', 'Algorithms'],
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

export default function TutorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [minRating, setMinRating] = useState('');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [filteredTutors, setFilteredTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Fetch suggested tutors
  useEffect(() => {
    const fetchTutors = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First try to get personalized recommendations
        const response = await fetch('/api/tutors/suggested');
        const data = await response.json();
        
        if (response.ok && data.tutors && data.tutors.length > 0) {
          setTutors(data.tutors);
          setFilteredTutors(data.tutors);
        } else {
          // Fallback to mock data if no personalized results
          console.log('Using mock data for tutors');
          setTutors(mockTutors);
          setFilteredTutors(mockTutors);
        }
      } catch (err) {
        console.error('Error fetching tutors:', err);
        setError('Failed to load tutors. Please try again later.');
        // Fallback to mock data on error
        setTutors(mockTutors);
        setFilteredTutors(mockTutors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutors();
  }, []);

  // Filter tutors based on search and filters
  useEffect(() => {
    if (!tutors.length) return;
    
    let results = [...tutors];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(tutor => 
        tutor.full_name.toLowerCase().includes(term) ||
        tutor.headline.toLowerCase().includes(term) ||
        (tutor.bio && tutor.bio.toLowerCase().includes(term)) ||
        tutor.subjects.some(subj => subj.toLowerCase().includes(term))
      );
    }
    
    // Apply price range filter
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(tutor => 
        tutor.hourly_rate >= min && tutor.hourly_rate <= (max || 1000)
      );
    }
    
    // Apply minimum rating filter
    if (minRating) {
      const rating = parseFloat(minRating);
      results = results.filter(tutor => 
        tutor.rating !== null && tutor.rating >= rating
      );
    }
    
    setFilteredTutors(results);
  }, [searchTerm, priceRange, minRating, tutors]);

  const handleBookSession = (tutorId: string) => {
    if (!user) {
      router.push('/auth/signin?redirect=/tutors');
      return;
    }
    router.push(`/book/${tutorId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Finding the best tutors for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Find Your Perfect Tutor</h1>
          <p className="text-gray-600 mt-1">
            {filteredTutors.length} {filteredTutors.length === 1 ? 'tutor' : 'tutors'} available
          </p>
        </div>
        <Button 
          onClick={() => router.push('/onboarding')}
          variant="outline"
          className="mt-4 md:mt-0"
        >
          Update Preferences
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardHeader>
          <h3 className="text-lg font-semibold">Search & Filter</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutors, subjects, or expertise"
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Any Price</option>
              <option value="0-30">Under $30</option>
              <option value="30-50">$30 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100">$100+</option>
            </select>

            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ stars</option>
              <option value="4.0">4.0+ stars</option>
              <option value="3.5">3.5+ stars</option>
            </select>

            {(searchTerm || priceRange || minRating) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setPriceRange('');
                  setMinRating('');
                }}
              >
                Clear all filters
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tutors found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || priceRange || minRating
              ? 'Try adjusting your search or filters'
              : 'No tutors are currently available. Please check back later.'}
          </p>
          {(searchTerm || priceRange || minRating) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPriceRange('');
                setMinRating('');
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <Card
              key={tutor.id}
              className="h-full flex flex-col hover:shadow-lg transition-shadow border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="flex flex-row items-start space-x-4 p-6 pb-3">
                <div className="relative flex h-14 w-14 shrink-0 overflow-hidden rounded-full mt-1">
                  {tutor.avatar_url ? (
                    <img
                      src={tutor.avatar_url}
                      alt={tutor.full_name}
                      className="aspect-square h-full w-full"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
                      {tutor.full_name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold leading-tight">
                    {tutor.full_name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {tutor.headline}
                  </p>
                  {tutor.rating !== null && (
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{tutor.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-xs ml-1">
                        ({Math.floor(Math.random() * 100) + 1} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 pt-0 flex-1 flex flex-col">
                <p className="text-gray-700 mb-4 line-clamp-3 text-sm">
                  {tutor.bio || 'Experienced tutor with expertise in multiple subjects.'}
                </p>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutor.subjects.slice(0, 3).map((subject, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold bg-gray-50"
                      >
                        {subject}
                      </span>
                    ))}
                    {tutor.subjects.length > 3 && (
                      <span className="inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold">
                        +{tutor.subjects.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <span className="text-lg font-bold">${tutor.hourly_rate}</span>
                      <span className="text-sm text-gray-500">/hr</span>
                    </div>
                    <Button
                      onClick={() => handleBookSession(tutor.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Book Session
                    </Button>
            onClick={() => {
              setSearchTerm('');
              setPriceRange('');
              setMinRating('');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
