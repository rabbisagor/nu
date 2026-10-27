import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Calendar,
  Layers,
  GraduationCap,
  ShieldAlert,
  Moon,
  Sun,
  Menu,
  X,
  Lock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme, activeTab, setActiveTab, t, adminUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'generate', label: t.navGenerate },
    { id: 'departments', label: t.navDepartments },
    { id: 'years', label: t.navYears },
    { id: 'notices', label: t.navNotices },
    { id: 'about', label: t.navAbout },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Banner: Independent Student Support Tool Notification */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="font-medium text-slate-200">
            {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় শিক্ষার্থী সহায়ক টুল' : 'National University Student Support Tool'}
          </span>
          <span className="text-slate-500">·</span>
          <span>{t.independentDisclaimerBadge}</span>
          <span className="text-slate-500">·</span>
          <button
            onClick={() => handleNavClick('admin')}
            className="text-blue-400 hover:text-blue-300 underline font-medium inline-flex items-center gap-1 cursor-pointer"
          >
            <Lock className="w-3 h-3" />
            <span>{adminUser ? adminUser.name : t.navAdmin}</span>
          </button>
        </div>
      </div>

      {/* Main Header adhering to Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 Nav Links) — Zone 3 (Language & CTA) */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                এন
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap block leading-tight">
                  {language === 'bn' ? 'এনইউ রুটিন মেকার' : 'NU Routine Maker'}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block whitespace-nowrap leading-none">
                  {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় অনার্স পরীক্ষা' : 'Honours Exam Routine'}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise Nav Links (Single line, text with subtle hover effect) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`cursor-pointer whitespace-nowrap py-1 transition-colors relative ${
                    isActive
                      ? 'text-blue-900 dark:text-blue-400 font-semibold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-900 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language Switcher, Theme Toggle, Primary Action) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  language === 'bn'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                বাংলা
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded cursor-pointer transition-colors ${
                  language === 'en'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            {/* Dark/Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('generate')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-900 dark:bg-blue-600 rounded-md hover:bg-blue-800 dark:hover:bg-blue-500 transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.btnGenerateNow}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-blue-50 dark:bg-slate-800 text-blue-900 dark:text-blue-400 font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleNavClick('admin')}
                className="text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 py-1"
              >
                <Lock className="w-3 h-3" />
                <span>{t.navAdmin}</span>
              </button>
              <button
                onClick={() => handleNavClick('generate')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 rounded-md"
              >
                {t.btnGenerateNow}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
