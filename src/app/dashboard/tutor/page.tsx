'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import TutorVettingWizard from '@/components/tutor/TutorVettingWizard';
import { 
  User, 
  Calendar, 
  DollarSign, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  FileText,
  Star
} from 'lucide-react';

type ApplicationStatus = 'pending' | 'approved' | 'rejected' | null;

type TutorProfile = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  application_status?: ApplicationStatus;
  hourly_rate?: number;
  subjects_expertise?: string[];
  years_of_experience?: number;
  rating?: number;
  total_sessions?: number;
  total_earnings?: number;
};

type TutorApplication = {
  id: string;
  status: ApplicationStatus;
  submitted_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
};

export default function TutorDashboard() {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [application, setApplication] = useState<TutorApplication | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchTutorData();
    
    // Check if application was just submitted
    if (searchParams.get('application') === 'submitted') {
      // Show success message or update UI
    }
  }, []);

  const fetchTutorData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        router.push('/auth/signin');
        return;
      }

      // Get tutor profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData);

      // Get tutor application if exists
      const { data: applicationData, error: applicationError } = await supabase
        .from('tutor_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single();

      if (applicationError && applicationError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected if no application exists
        throw applicationError;
      }

      setApplication(applicationData);

      // Show wizard if no application exists or if application was rejected
      if (!applicationData || applicationData.status === 'rejected') {
        setShowWizard(true);
      }

    } catch (err) {
      console.error('Error fetching tutor data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleWizardClose = () => {
    setShowWizard(false);
    fetchTutorData(); // Refresh data after wizard closes
  };

  const getApplicationStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            Under Review
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
            <XCircle className="h-4 w-4 mr-1" />
            Rejected
          </div>
        );
      default:
        return (
          <div className="flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
            <FileText className="h-4 w-4 mr-1" />
            Not Submitted
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              {getApplicationStatusBadge(application?.status || null)}
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Status Section */}
        {application ? (
          <div className="mb-8">
            {application.status === 'pending' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-yellow-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-yellow-800">Application Under Review</h3>
                    <p className="text-yellow-700 mt-1">
                      Your application was submitted on {new Date(application.submitted_at).toLocaleDateString()}. 
                      Our team is reviewing your documents and will get back to you within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {application.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-green-800">Application Approved!</h3>
                    <p className="text-green-700 mt-1">
                      Congratulations! Your application was approved on {application.reviewed_at ? new Date(application.reviewed_at).toLocaleDateString() : 'recently'}. 
                      You can now start accepting tutoring sessions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {application.status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <XCircle className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-medium text-red-800">Application Rejected</h3>
                    <p className="text-red-700 mt-1">
                      Unfortunately, your application was not approved. 
                      {application.rejection_reason && (
                        <>
                          <br />
                          <strong>Reason:</strong> {application.rejection_reason}
                        </>
                      )}
                    </p>
                    <button
                      onClick={() => setShowWizard(true)}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Reapply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-blue-800">Complete Your Application</h3>
                <p className="text-blue-700 mt-1">
                  To start tutoring on Edify, you need to complete your tutor application and get approved.
                </p>
                <button
                  onClick={() => setShowWizard(true)}
                  className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Start Application
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Stats - Only show if approved */}
        {application?.status === 'approved' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">{profile?.total_sessions || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">BWP {profile?.total_earnings || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{profile?.rating || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Hourly Rate</p>
                    <p className="text-2xl font-bold text-gray-900">BWP {profile?.hourly_rate || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="font-medium text-blue-900">View Schedule</span>
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-green-600 mr-3" />
                      <span className="font-medium text-green-900">Manage Subjects</span>
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-purple-600 mr-3" />
                      <span className="font-medium text-purple-900">Update Profile</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-600">
                    No recent activity to display.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tutor Vetting Wizard */}
      {showWizard && profile && (
        <TutorVettingWizard
          userId={profile.id}
          onClose={handleWizardClose}
        />
      )}
    </div>
  );
}