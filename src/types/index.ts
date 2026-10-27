export type Language = 'bn' | 'en';

export type HonoursYear = '1st' | '2nd' | '3rd' | '4th';

export type Faculty = 'Business Studies' | 'Arts' | 'Social Science' | 'Science';

export interface Department {
  id: string;
  code: string;
  nameBn: string;
  nameEn: string;
  faculty: Faculty;
  iconName?: string;
  active: boolean;
}

export interface Course {
  id: string;
  code: string; // e.g., '212501'
  nameBn: string;
  nameEn: string;
  departmentId: string;
  year: HonoursYear;
  credits: number;
  courseType: 'compulsory' | 'elective' | 'general';
  active: boolean;
}

export interface ExamScheduleItem {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeekBn: string; // e.g., 'শনিবার'
  dayOfWeekEn: string; // e.g., 'Saturday'
  time: string; // e.g., '০১:০০ PM' or '01:00 PM'
  courseCode: string;
  courseTitleBn: string;
  courseTitleEn: string;
  departmentIds: string[]; // which departments this paper applies to
  duration?: string; // e.g., '৪ ঘণ্টা' or '4 Hours'
  roomOrSpecialNotes?: string;
  isFlaggedForReview?: boolean; // For OCR uncertainty
  confidenceScore?: number; // 0 to 100
}

export interface ExamNotice {
  id: string;
  memoNo: string; // e.g., 'NU/Exam/Honours/2024/782'
  titleBn: string;
  titleEn: string;
  examName: string; // e.g., '২০২৩ সালের অনার্স ১ম বর্ষ পরীক্ষা'
  year: HonoursYear;
  session: string; // e.g., '2022-23'
  publishDate: string; // YYYY-MM-DD
  effectiveDate: string; // YYYY-MM-DD
  sourcePdfUrl?: string;
  sourcePdfFilename?: string;
  status: 'verified' | 'superseded' | 'draft';
  revisionNumber: number;
  supersedesNoticeId?: string;
  revisionNotes?: string;
  scheduleItems: ExamScheduleItem[];
  verifiedBy?: string;
  verifiedAt?: string;
}

export type RoutineTemplateId = 'official' | 'modern' | 'minimal' | 'social' | 'custom';

export interface TemplateConfig {
  id: RoutineTemplateId;
  nameBn: string;
  nameEn: string;
  descriptionBn: string;
  descriptionEn: string;
  accentColor: string;
  headerBg: string;
  tableDensity: 'compact' | 'normal' | 'relaxed';
  showEnglishNames: boolean;
  showMemoNumber: boolean;
  showSignatureBadge: boolean;
  showWatermark: boolean;
  watermarkText?: string;
  customLogoUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'UPLOAD' | 'EDIT' | 'VERIFY' | 'PUBLISH' | 'SUPERSEDE' | 'DELETE';
  targetType: 'NOTICE' | 'COURSE' | 'DEPARTMENT';
  targetId: string;
  details: string;
}

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  role: 'super_admin' | 'exam_controller' | 'moderator';
}
