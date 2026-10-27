import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HonoursYear } from '../../types';
import { RoutinePreviewCard } from './RoutinePreviewCard';
import { resolveRoutineFromInput } from '../../lib/routineResolver';
import {
  GraduationCap,
  Building,
  Calendar,
  Search,
} from 'lucide-react';

export const SimpleRoutineUploader: React.FC = () => {
  const {
    language,
    departments,
    notices,
    setNotices,
    selectedYear,
    setSelectedYear,
    selectedDepartmentId,
    setSelectedDepartmentId,
  } = useApp();

  const [currentNotice, setCurrentNotice] = useState(() => {
    return notices[0];
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Switch year
  const handleYearChange = (year: HonoursYear) => {
    setSelectedYear(year);
    const result = resolveRoutineFromInput(`Honours_${year}_Year_Routine.pdf`, year);
    setCurrentNotice(result.notice);
    setNotices((prev) => [result.notice, ...prev.filter((n) => n.id !== result.notice.id)]);
  };

  // Filtered departments based on search
  const filteredDepartments = departments.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.nameBn.toLowerCase().includes(term) ||
      d.nameEn.toLowerCase().includes(term) ||
      d.code.toLowerCase().includes(term)
    );
  });

  // Active department object
  const activeDept =
    departments.find((d) => d.id === selectedDepartmentId) || departments[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 font-solaiman">
      {/* Title & Introduction */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/80 text-blue-900 dark:text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-900">
          <GraduationCap className="w-4 h-4 text-blue-700 dark:text-blue-400" />
          <span>জাতীয় বিশ্ববিদ্যালয় বাংলাদেশ · অফিসিয়াল পরীক্ষার সময়সূচি</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {language === 'bn'
            ? 'অনার্স পরীক্ষার বিভাগভিত্তিক রুটিন ডাউনলোড'
            : 'National University Honours Routine Download'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {language === 'bn'
            ? 'বর্ষ ও আপনার বিভাগ নির্বাচন করুন এবং এক ক্লিকেই A4 সাইজ PDF বা ক্লিয়ার PNG ছবি ডাউনলোড করুন।'
            : 'Select your examination year and department to download your timetable in A4 PDF or PNG image.'}
        </p>
        <div className="pt-1">
          <span className="inline-block text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
            কারিগরি রূপরেখা ও ডেভেলপমেন্ট: <strong className="text-blue-900 dark:text-blue-400">মীর রাব্বি হোসেন (Mir Rabbi Hossain)</strong>
          </span>
        </div>
      </div>

      {/* 1. Year Selection Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-blue-900 dark:text-blue-400" />
          <span>১. শিক্ষাবর্ষ নির্বাচন করুন:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(
            [
              { id: '1st', labelBn: 'অনার্স ১ম বর্ষ', subBn: 'কোড: ২২০১' },
              { id: '2nd', labelBn: 'অনার্স ২য় বর্ষ', subBn: 'কোড: ২২০২' },
              { id: '3rd', labelBn: 'অনার্স ৩য় বর্ষ', subBn: 'কোড: ২২০৩' },
              { id: '4th', labelBn: 'অনার্স ৪র্থ বর্ষ', subBn: 'চূড়ান্ত পরীক্ষা' },
            ] as { id: HonoursYear; labelBn: string; subBn: string }[]
          ).map((y) => {
            const isSelected = (currentNotice?.year || selectedYear) === y.id;
            return (
              <button
                key={y.id}
                type="button"
                onClick={() => handleYearChange(y.id)}
                className={`p-3 rounded-xl font-bold transition-all border text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-md ring-2 ring-blue-900/30 dark:ring-blue-500/50'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-slate-800'
                }`}
              >
                <span className="text-sm font-extrabold">{y.labelBn}</span>
                <span
                  className={`text-[10px] ${
                    isSelected ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {y.subBn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Department Selection Strip */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-blue-900 dark:text-blue-400" />
            <span>২. আপনার বিভাগ নির্বাচন করুন ({departments.length} টি বিভাগ):</span>
          </label>
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="বিভাগ খুঁজুন (যেমন: হিসাববিজ্ঞান)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
          {filteredDepartments.map((dept) => {
            const isSelected = selectedDepartmentId === dept.id;
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDepartmentId(dept.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{dept.nameBn}</span>
                <span className="text-[10px] opacity-70 ml-1 font-mono">({dept.code})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Routine Preview & Download Card */}
      {currentNotice && (
        <RoutinePreviewCard
          notice={currentNotice}
          department={activeDept}
        />
      )}
    </div>
  );
};
