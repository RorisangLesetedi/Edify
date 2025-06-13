/*
  # Extend profiles table for tutor information

  1. New Columns
    - Add tutor-specific fields to profiles table:
      - `phone` (text) - Contact phone number
      - `address` (text) - Physical address
      - `date_of_birth` (date) - Date of birth
      - `highest_qualification` (text) - Education level
      - `institution` (text) - Educational institution
      - `graduation_year` (integer) - Year of graduation
      - `field_of_study` (text) - Area of study
      - `gpa_grade` (text) - Academic performance
      - `years_of_experience` (integer) - Teaching experience
      - `previous_tutoring` (text) - Previous tutoring experience
      - `teaching_approach` (text) - Teaching methodology
      - `subjects_expertise` (text[]) - Array of subjects
      - `age_groups` (text[]) - Preferred age groups
      - `availability_hours` (text[]) - Available time slots
      - `hourly_rate` (decimal) - Hourly rate in BWP
      - `preferred_mode` (text) - Teaching mode preference
      - `application_status` (text) - Application status
      - `rating` (decimal) - Average rating
      - `total_sessions` (integer) - Total completed sessions
      - `total_earnings` (decimal) - Total earnings

  2. Storage
    - Create storage bucket for tutor documents
    - Set up RLS policies for document access
*/

-- Add new columns to profiles table
DO $$
BEGIN
  -- Personal Information
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE profiles ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address') THEN
    ALTER TABLE profiles ADD COLUMN address text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'date_of_birth') THEN
    ALTER TABLE profiles ADD COLUMN date_of_birth date;
  END IF;

  -- Education Background
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'highest_qualification') THEN
    ALTER TABLE profiles ADD COLUMN highest_qualification text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'institution') THEN
    ALTER TABLE profiles ADD COLUMN institution text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'graduation_year') THEN
    ALTER TABLE profiles ADD COLUMN graduation_year integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'field_of_study') THEN
    ALTER TABLE profiles ADD COLUMN field_of_study text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'gpa_grade') THEN
    ALTER TABLE profiles ADD COLUMN gpa_grade text;
  END IF;

  -- Teaching Experience
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'years_of_experience') THEN
    ALTER TABLE profiles ADD COLUMN years_of_experience integer;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'previous_tutoring') THEN
    ALTER TABLE profiles ADD COLUMN previous_tutoring text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'teaching_approach') THEN
    ALTER TABLE profiles ADD COLUMN teaching_approach text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'subjects_expertise') THEN
    ALTER TABLE profiles ADD COLUMN subjects_expertise text[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'age_groups') THEN
    ALTER TABLE profiles ADD COLUMN age_groups text[];
  END IF;

  -- Availability & Rates
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'availability_hours') THEN
    ALTER TABLE profiles ADD COLUMN availability_hours text[];
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'hourly_rate') THEN
    ALTER TABLE profiles ADD COLUMN hourly_rate decimal(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'preferred_mode') THEN
    ALTER TABLE profiles ADD COLUMN preferred_mode text;
  END IF;

  -- Application & Performance
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'application_status') THEN
    ALTER TABLE profiles ADD COLUMN application_status text DEFAULT 'not_submitted';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'rating') THEN
    ALTER TABLE profiles ADD COLUMN rating decimal(3,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_sessions') THEN
    ALTER TABLE profiles ADD COLUMN total_sessions integer DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'total_earnings') THEN
    ALTER TABLE profiles ADD COLUMN total_earnings decimal(10,2) DEFAULT 0;
  END IF;
END $$;

-- Create storage bucket for tutor documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutor-documents', 'tutor-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for tutor documents storage
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tutor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'tutor-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'tutor-documents' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add constraints for application status
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'profiles_application_status_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_application_status_check 
    CHECK (application_status IN ('not_submitted', 'pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Add constraints for preferred mode
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'profiles_preferred_mode_check'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_preferred_mode_check 
    CHECK (preferred_mode IN ('online', 'in_person', 'both'));
  END IF;
END $$;