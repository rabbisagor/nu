import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  HonoursYear,
  Department,
  Course,
  ExamNotice,
  RoutineTemplateId,
  AuditLog,
  AdminUser,
} from '../types';
import { INITIAL_DEPARTMENTS, INITIAL_COURSES, INITIAL_NOTICES } from '../data/nuData';
import { translations, getTranslation } from '../lib/i18n';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  notices: ExamNotice[];
  setNotices: React.Dispatch<React.SetStateAction<ExamNotice[]>>;
  auditLogs: AuditLog[];
  addAuditLog: (action: AuditLog['action'], targetType: AuditLog['targetType'], targetId: string, details: string) => void;
  selectedYear: HonoursYear;
  setSelectedYear: (year: HonoursYear) => void;
  selectedDepartmentId: string;
  setSelectedDepartmentId: (deptId: string) => void;
  selectedNoticeId: string;
  setSelectedNoticeId: (noticeId: string) => void;
  selectedTemplateId: RoutineTemplateId;
  setSelectedTemplateId: (tmplId: RoutineTemplateId) => void;
  adminUser: AdminUser | null;
  loginAdmin: (username: string) => boolean;
  logoutAdmin: () => void;
  t: typeof translations.bn;
  // Helpers
  getDepartmentById: (id: string) => Department | undefined;
  getCourseByCode: (code: string) => Course | undefined;
  getNoticeById: (id: string) => ExamNotice | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language defaults to Bangla as required
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nu_lang');
    return saved === 'en' ? 'en' : 'bn';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('nu_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedYear, setSelectedYear] = useState<HonoursYear>('1st');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('dept-acc');
  const [selectedNoticeId, setSelectedNoticeId] = useState<string>('notice-h1-2023-rev');
  const [selectedTemplateId, setSelectedTemplateId] = useState<RoutineTemplateId>('official');

  // Persistence for Departments, Courses, Notices
  const [departments, setDepartments] = useState<Department[]>(() => {
    try {
      const saved = localStorage.getItem('nu_departments');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEPARTMENTS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('nu_courses');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_COURSES;
  });

  const [notices, setNotices] = useState<ExamNotice[]>(() => {
    try {
      const saved = localStorage.getItem('nu_notices');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTICES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    return [
      {
        id: 'log-1',
        timestamp: '2024-11-04 14:30',
        user: 'Exam Controller Gazipur',
        action: 'SUPERSEDE',
        targetType: 'NOTICE',
        targetId: 'notice-h1-2023-orig',
        details: 'Notice 782-Rev-2 published and superseded notice 782-Orig due to rescheduled dates',
      },
      {
        id: 'log-2',
        timestamp: '2024-10-28 17:00',
        user: 'Admin Gazipur',
        action: 'VERIFY',
        targetType: 'NOTICE',
        targetId: 'notice-h3-2023',
        details: 'Honours 3rd Year examination 2023 verified against official memo 902',
      },
    ];
  });

  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('nu_admin');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('nu_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('nu_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('nu_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('nu_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('nu_notices', JSON.stringify(notices));
  }, [notices]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const addAuditLog = (
    action: AuditLog['action'],
    targetType: AuditLog['targetType'],
    targetId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-US', { hour12: false }),
      user: adminUser ? adminUser.name : 'Authorized Admin',
      action,
      targetType,
      targetId,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const loginAdmin = (username: string) => {
    const user: AdminUser = {
      id: 'admin-1',
      username: username || 'admin',
      name: username === 'controller' ? 'Exam Controller (Gazipur)' : 'NU System Administrator',
      role: 'super_admin',
    };
    setAdminUser(user);
    localStorage.setItem('nu_admin', JSON.stringify(user));
    return true;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem('nu_admin');
  };

  const getDepartmentById = (id: string) => departments.find((d) => d.id === id);
  const getCourseByCode = (code: string) => courses.find((c) => c.code === code);
  const getNoticeById = (id: string) => notices.find((n) => n.id === id);

  const t = getTranslation(language);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        departments,
        setDepartments,
        courses,
        setCourses,
        notices,
        setNotices,
        auditLogs,
        addAuditLog,
        selectedYear,
        setSelectedYear,
        selectedDepartmentId,
        setSelectedDepartmentId,
        selectedNoticeId,
        setSelectedNoticeId,
        selectedTemplateId,
        setSelectedTemplateId,
        adminUser,
        loginAdmin,
        logoutAdmin,
        t,
        getDepartmentById,
        getCourseByCode,
        getNoticeById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
