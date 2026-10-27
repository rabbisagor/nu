-- ====================================================================
-- NU Routine Maker — PostgreSQL / Supabase Migration Schema
-- Database: PostgreSQL 15+ / Supabase
-- Description: Department-wise Honours Routine Generator Tables & RLS
-- ====================================================================

-- 1. Create Enums
CREATE TYPE honours_year_type AS ENUM ('1st', '2nd', '3rd', '4th');
CREATE TYPE course_type_enum AS ENUM ('compulsory', 'elective', 'general');
CREATE TYPE notice_status_enum AS ENUM ('draft', 'verified', 'superseded');

-- 2. Profiles and User Roles (RBAC)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'exam_controller', 'moderator', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  faculty TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Courses Table
CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  department_id TEXT NOT NULL,
  year honours_year_type NOT NULL,
  credits NUMERIC(3, 1) NOT NULL DEFAULT 4.0,
  course_type course_type_enum NOT NULL DEFAULT 'compulsory',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Examination Notices Table
CREATE TABLE IF NOT EXISTS examination_notices (
  id TEXT PRIMARY KEY,
  memo_no TEXT NOT NULL UNIQUE,
  title_bn TEXT NOT NULL,
  title_en TEXT NOT NULL,
  exam_name TEXT NOT NULL,
  year honours_year_type NOT NULL,
  session VARCHAR(20) NOT NULL,
  publish_date DATE NOT NULL,
  effective_date DATE NOT NULL,
  source_pdf_url TEXT,
  status notice_status_enum NOT NULL DEFAULT 'draft',
  revision_number INT NOT NULL DEFAULT 1,
  supersedes_notice_id TEXT REFERENCES examination_notices(id) ON DELETE SET NULL,
  revision_notes TEXT,
  verified_by TEXT,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Exam Schedule Items (Timetable rows)
CREATE TABLE IF NOT EXISTS exam_schedule_items (
  id TEXT PRIMARY KEY,
  notice_id TEXT NOT NULL REFERENCES examination_notices(id) ON DELETE CASCADE,
  exam_date DATE NOT NULL,
  day_of_week_bn VARCHAR(30) NOT NULL,
  day_of_week_en VARCHAR(30) NOT NULL,
  exam_time VARCHAR(30) NOT NULL DEFAULT '01:00 PM',
  course_code VARCHAR(20) NOT NULL,
  course_title_bn TEXT NOT NULL,
  course_title_en TEXT NOT NULL,
  department_ids TEXT[] NOT NULL DEFAULT ARRAY['all'],
  duration VARCHAR(30) DEFAULT '৪ ঘণ্টা',
  room_or_special_notes TEXT,
  confidence_score INT DEFAULT 100,
  is_flagged_for_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_dept ON courses(department_id);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code);
CREATE INDEX IF NOT EXISTS idx_schedule_notice ON exam_schedule_items(notice_id);
CREATE INDEX IF NOT EXISTS idx_schedule_date ON exam_schedule_items(exam_date);
CREATE INDEX IF NOT EXISTS idx_notices_year ON examination_notices(year);

-- Enable Row Level Security (RLS)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE examination_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedule_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public can read verified schedules, departments, and courses
CREATE POLICY "Public can view active departments" ON departments FOR SELECT USING (active = true);
CREATE POLICY "Public can view active courses" ON courses FOR SELECT USING (active = true);
CREATE POLICY "Public can view verified notices" ON examination_notices FOR SELECT USING (status = 'verified' OR status = 'superseded');
CREATE POLICY "Public can view schedule items" ON exam_schedule_items FOR SELECT USING (true);

-- Admins can insert/update/delete
CREATE POLICY "Admins have full access to notices" ON examination_notices
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'exam_controller')));

CREATE POLICY "Admins have full access to schedule items" ON exam_schedule_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'exam_controller')));

CREATE POLICY "Admins have full access to departments" ON departments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'exam_controller')));

CREATE POLICY "Admins have full access to courses" ON courses
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'exam_controller')));
