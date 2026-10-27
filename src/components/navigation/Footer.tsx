import React from 'react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { language } = useApp();

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-solaiman">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>
          {language === 'bn'
            ? '© জাতীয় বিশ্ববিদ্যালয় রুটিন প্রস্তুতকারক — অনার্স ১ম, ২য়, ৩য় ও ৪র্থ বর্ষ'
            : '© National University Routine Maker — Honours 1st, 2nd, 3rd & 4th Year'}
        </p>
        <p className="text-[11px] text-slate-400">
          SolaimanLipi Typography · High Quality PDF & PNG Export
        </p>
      </div>
    </footer>
  );
};
