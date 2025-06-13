'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { X, Upload, FileText, User, GraduationCap, Award, CheckCircle } from 'lucide-react';

type ApplicationStatus = 'pending' | 'approved' | 'rejected';

type TutorApplication = {
  id?: string;
  user_id: string;
  credentials_url?: string;
  status: ApplicationStatus;
  submitted_at?: string;
  reviewed_at?: string;
  reviewer_id?: string;
  rejection_reason?: string;
  proof_uploads?: {
    education_certificates?: string[];
    teaching_certificates?: string[];
    identity_document?: string;
    cv_resume?: string;
    portfolio?: string[];
  };
};

type FormData = {
  // Personal Information
  full_name: string;
  phone: string;
  address: string;
  date_of_birth: string;
  
  // Education Background
  highest_qualification: string;
  institution: string;
  graduation_year: string;
  field_of_study: string;
  gpa_grade: string;
  
  // Teaching Experience
  years_of_experience: string;
  previous_tutoring: string;
  teaching_approach: string;
  subjects_expertise: string[];
  age_groups: string[];
  
  // Availability & Rates
  availability_hours: string[];
  hourly_rate: string;
  preferred_mode: string;
  
  // Documents
  files: {
    education_certificates: File[];
    teaching_certificates: File[];
    identity_document: File | null;
    cv_resume: File | null;
    portfolio: File[];
  };
};

const STEPS = [
  { id: 1, title: 'Personal Information', icon: User },
  { id: 2, title: 'Education Background', icon: GraduationCap },
  { id: 3, title: 'Teaching Experience', icon: Award },
  { id: 4, title: 'Availability & Rates', icon: FileText },
  { id: 5, title: 'Document Upload', icon: Upload },
  { id: 6, title: 'Review & Submit', icon: CheckCircle },
];

const SUBJECTS = [
  'Mathematics', 'English', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Computer Science', 'Art', 'Music', 'Languages'
];

const AGE_GROUPS = [
  'Primary (6-12 years)', 'Secondary (13-16 years)', 'A-Level (17-18 years)', 'Adult Education'
];

interface TutorVettingWizardProps {
  userId: string;
  onClose: () => void;
}

export default function TutorVettingWizard({ userId, onClose }: TutorVettingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    phone: '',
    address: '',
    date_of_birth: '',
    highest_qualification: '',
    institution: '',
    graduation_year: '',
    field_of_study: '',
    gpa_grade: '',
    years_of_experience: '',
    previous_tutoring: '',
    teaching_approach: '',
    subjects_expertise: [],
    age_groups: [],
    availability_hours: [],
    hourly_rate: '',
    preferred_mode: '',
    files: {
      education_certificates: [],
      teaching_certificates: [],
      identity_document: null,
      cv_resume: null,
      portfolio: [],
    },
  });

  const supabase = createClient();
  const router = useRouter();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateFileData = (category: string, files: File[] | File | null) => {
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [category]: files
      }
    }));
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('tutor-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('tutor-documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const uploadFiles = async (): Promise<any> => {
    const uploads: any = {};
    
    try {
      // Upload education certificates
      if (formData.files.education_certificates.length > 0) {
        uploads.education_certificates = [];
        for (const file of formData.files.education_certificates) {
          const url = await uploadFile(file, `${userId}/education`);
          uploads.education_certificates.push(url);
        }
      }

      // Upload teaching certificates
      if (formData.files.teaching_certificates.length > 0) {
        uploads.teaching_certificates = [];
        for (const file of formData.files.teaching_certificates) {
          const url = await uploadFile(file, `${userId}/teaching`);
          uploads.teaching_certificates.push(url);
        }
      }

      // Upload identity document
      if (formData.files.identity_document) {
        uploads.identity_document = await uploadFile(
          formData.files.identity_document, 
          `${userId}/identity`
        );
      }

      // Upload CV/Resume
      if (formData.files.cv_resume) {
        uploads.cv_resume = await uploadFile(
          formData.files.cv_resume, 
          `${userId}/cv`
        );
      }

      // Upload portfolio
      if (formData.files.portfolio.length > 0) {
        uploads.portfolio = [];
        for (const file of formData.files.portfolio) {
          const url = await uploadFile(file, `${userId}/portfolio`);
          uploads.portfolio.push(url);
        }
      }

      return uploads;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload all files first
      const uploadedFiles = await uploadFiles();

      // Create tutor application record
      const applicationData: Partial<TutorApplication> = {
        user_id: userId,
        status: 'pending',
        proof_uploads: uploadedFiles,
      };

      const { error: applicationError } = await supabase
        .from('tutor_applications')
        .insert([applicationData]);

      if (applicationError) {
        throw applicationError;
      }

      // Update user profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          date_of_birth: formData.date_of_birth,
          highest_qualification: formData.highest_qualification,
          institution: formData.institution,
          graduation_year: parseInt(formData.graduation_year),
          field_of_study: formData.field_of_study,
          gpa_grade: formData.gpa_grade,
          years_of_experience: parseInt(formData.years_of_experience),
          previous_tutoring: formData.previous_tutoring,
          teaching_approach: formData.teaching_approach,
          subjects_expertise: formData.subjects_expertise,
          age_groups: formData.age_groups,
          availability_hours: formData.availability_hours,
          hourly_rate: parseFloat(formData.hourly_rate),
          preferred_mode: formData.preferred_mode,
          application_status: 'pending',
        })
        .eq('id', userId);

      if (profileError) {
        throw profileError;
      }

      // Close wizard and redirect
      onClose();
      router.push('/dashboard/tutor?application=submitted');
      
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => updateFormData('full_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_of_birth}
                  onChange={(e) => updateFormData('date_of_birth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Education Background</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highest Qualification *
                </label>
                <select
                  required
                  value={formData.highest_qualification}
                  onChange={(e) => updateFormData('highest_qualification', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select qualification</option>
                  <option value="high_school">High School</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => updateFormData('institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Graduation Year *
                </label>
                <input
                  type="number"
                  required
                  min="1950"
                  max={new Date().getFullYear()}
                  value={formData.graduation_year}
                  onChange={(e) => updateFormData('graduation_year', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  required
                  value={formData.field_of_study}
                  onChange={(e) => updateFormData('field_of_study', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA/Grade
                </label>
                <input
                  type="text"
                  value={formData.gpa_grade}
                  onChange={(e) => updateFormData('gpa_grade', e.target.value)}
                  placeholder="e.g., 3.8/4.0 or First Class"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Teaching Experience</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Teaching/Tutoring Experience *
                </label>
                <select
                  required
                  value={formData.years_of_experience}
                  onChange={(e) => updateFormData('years_of_experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select experience</option>
                  <option value="0">No experience</option>
                  <option value="1">1 year</option>
                  <option value="2">2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="5">5+ years</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Tutoring Experience
                </label>
                <textarea
                  value={formData.previous_tutoring}
                  onChange={(e) => updateFormData('previous_tutoring', e.target.value)}
                  rows={4}
                  placeholder="Describe your previous tutoring experience, including subjects taught and student outcomes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Approach *
                </label>
                <textarea
                  required
                  value={formData.teaching_approach}
                  onChange={(e) => updateFormData('teaching_approach', e.target.value)}
                  rows={4}
                  placeholder="Describe your teaching methodology and approach to helping students learn..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Expertise *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SUBJECTS.map((subject) => (
                    <label key={subject} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.subjects_expertise.includes(subject)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('subjects_expertise', [...formData.subjects_expertise, subject]);
                          } else {
                            updateFormData('subjects_expertise', formData.subjects_expertise.filter(s => s !== subject));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Age Groups *
                </label>
                <div className="space-y-2">
                  {AGE_GROUPS.map((group) => (
                    <label key={group} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.age_groups.includes(group)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('age_groups', [...formData.age_groups, group]);
                          } else {
                            updateFormData('age_groups', formData.age_groups.filter(g => g !== group));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{group}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Availability & Rates</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Hours *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'Monday Morning', 'Monday Afternoon', 'Monday Evening',
                    'Tuesday Morning', 'Tuesday Afternoon', 'Tuesday Evening',
                    'Wednesday Morning', 'Wednesday Afternoon', 'Wednesday Evening',
                    'Thursday Morning', 'Thursday Afternoon', 'Thursday Evening',
                    'Friday Morning', 'Friday Afternoon', 'Friday Evening',
                    'Saturday Morning', 'Saturday Afternoon', 'Saturday Evening',
                    'Sunday Morning', 'Sunday Afternoon', 'Sunday Evening'
                  ].map((slot) => (
                    <label key={slot} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availability_hours.includes(slot)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateFormData('availability_hours', [...formData.availability_hours, slot]);
                          } else {
                            updateFormData('availability_hours', formData.availability_hours.filter(h => h !== slot));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (BWP) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.hourly_rate}
                  onChange={(e) => updateFormData('hourly_rate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Teaching Mode *
                </label>
                <select
                  required
                  value={formData.preferred_mode}
                  onChange={(e) => updateFormData('preferred_mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select mode</option>
                  <option value="online">Online Only</option>
                  <option value="in_person">In-Person Only</option>
                  <option value="both">Both Online & In-Person</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Document Upload</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Certificates * (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => updateFileData('education_certificates', Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload your degree, diploma, or certificate</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Certificates (if any)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => updateFileData('teaching_certificates', Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload any teaching qualifications or certifications</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Identity Document * (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => updateFileData('identity_document', e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload your national ID or passport</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CV/Resume * (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => updateFileData('cv_resume', e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload your current CV or resume</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio/Sample Work (optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => updateFileData('portfolio', Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Upload examples of your teaching materials or student work</p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Personal Information</h4>
                <p className="text-sm text-gray-600">
                  {formData.full_name} • {formData.phone} • {formData.date_of_birth}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Education</h4>
                <p className="text-sm text-gray-600">
                  {formData.highest_qualification} in {formData.field_of_study} from {formData.institution} ({formData.graduation_year})
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Teaching Experience</h4>
                <p className="text-sm text-gray-600">
                  {formData.years_of_experience} years of experience
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Subjects & Age Groups</h4>
                <p className="text-sm text-gray-600">
                  Subjects: {formData.subjects_expertise.join(', ')}
                </p>
                <p className="text-sm text-gray-600">
                  Age Groups: {formData.age_groups.join(', ')}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Rate & Availability</h4>
                <p className="text-sm text-gray-600">
                  BWP {formData.hourly_rate}/hour • {formData.preferred_mode} • {formData.availability_hours.length} time slots available
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Documents</h4>
                <ul className="text-sm text-gray-600">
                  <li>Education Certificates: {formData.files.education_certificates.length} files</li>
                  <li>Teaching Certificates: {formData.files.teaching_certificates.length} files</li>
                  <li>Identity Document: {formData.files.identity_document ? '1 file' : 'Not uploaded'}</li>
                  <li>CV/Resume: {formData.files.cv_resume ? '1 file' : 'Not uploaded'}</li>
                  <li>Portfolio: {formData.files.portfolio.length} files</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Next Steps:</strong> After submission, our team will review your application within 3-5 business days. 
                You'll receive an email notification once the review is complete.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tutor Application</h2>
            <p className="text-sm text-gray-600">Complete your profile to start tutoring</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-600 text-white' : 
                    'bg-gray-200 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-blue-600' : 
                      isCompleted ? 'text-green-600' : 
                      'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`hidden md:block w-12 h-0.5 ml-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
          
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-500">
            Step {currentStep} of {STEPS.length}
          </span>
          
          {currentStep < STEPS.length ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}