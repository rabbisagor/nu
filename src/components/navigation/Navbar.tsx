import React from 'react';
import { useApp } from '../../context/AppContext';
import { Moon, Sun, GraduationCap } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { language, setLanguage, theme, toggleTheme } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl bg-blue-900 dark:bg-blue-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm">
            এনইউ
          </div>
          <div className="min-w-0">
            <span className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate block leading-tight font-solaiman">
              {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় রুটিন মেকার' : 'NU Routine Maker'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate block leading-none font-solaiman">
              {language === 'bn' ? 'অনার্স ১ম, ২য়, ৩য় ও ৪র্থ (চূড়ান্ত) বর্ষ' : 'Honours 1st, 2nd, 3rd & 4th Year'}
            </span>
          </div>
        </div>

        {/* Right Controls: Language & Theme */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                language === 'bn'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md cursor-pointer transition-colors ${
                language === 'en'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              English
            </button>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
