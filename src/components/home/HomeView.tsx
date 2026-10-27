import React from 'react';
import { useApp } from '../../context/AppContext';
import { HonoursYear } from '../../types';
import {
  Calendar,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Download,
  Building,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    language,
    setActiveTab,
    setSelectedYear,
    setSelectedDepartmentId,
    setSelectedNoticeId,
    departments,
    notices,
    t,
  } = useApp();

  const handleYearClick = (year: HonoursYear) => {
    setSelectedYear(year);
    const matchingNotice = notices.find((n) => n.year === year && n.status === 'verified');
    if (matchingNotice) {
      setSelectedNoticeId(matchingNotice.id);
    }
    setActiveTab('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDepartmentClick = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    setActiveTab('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNoticeClick = (noticeId: string, year: HonoursYear) => {
    setSelectedNoticeId(noticeId);
    setSelectedYear(year);
    setActiveTab('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Top popular departments
  const popularDepts = departments.slice(0, 8);

  // Latest verified notices
  const latestNotices = notices.slice(0, 4);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          {/* Subtle top indicator */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-6 border border-blue-100 dark:border-blue-900/50">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.heroTag}</span>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-solaiman tracking-tight leading-tight">
              {language === 'bn'
                ? 'জাতীয় বিশ্ববিদ্যালয়ের পরীক্ষার রুটিন এখন আপনার বিভাগ অনুযায়ী'
                : 'Your National University Exam Routine, Department by Department'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-solaiman leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('generate');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.btnGenerateNow}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveTab('notices');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>{t.btnLatestNotices}</span>
            </button>
          </div>

          {/* Official Verification Disclaimer Banner */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500 dark:text-slate-400">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>{t.officialNoticeWarning}</span>
          </div>
        </div>
      </section>

      {/* 4 Honours Year Selection Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-solaiman">
            {t.yearsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {t.yearsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1st Year Card */}
          <div
            onClick={() => handleYearClick('1st')}
            className="group p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-400 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition-transform">
                ১ম
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman">
                {t.year1}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.year1Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-400">
              <span>{language === 'bn' ? 'রুটিন দেখুন' : 'View Routine'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2nd Year Card */}
          <div
            onClick={() => handleYearClick('2nd')}
            className="group p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-400 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition-transform">
                ২য়
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman">
                {t.year2}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.year2Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-900 dark:text-indigo-400">
              <span>{language === 'bn' ? 'রুটিন দেখুন' : 'View Routine'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3rd Year Card */}
          <div
            onClick={() => handleYearClick('3rd')}
            className="group p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-400 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition-transform">
                ৩য়
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman">
                {t.year3}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.year3Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-400">
              <span>{language === 'bn' ? 'রুটিন দেখুন' : 'View Routine'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4th Year Card */}
          <div
            onClick={() => handleYearClick('4th')}
            className="group p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-400 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition-transform">
                ৪র্থ
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman">
                {t.year4}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.year4Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-purple-900 dark:text-purple-400">
              <span>{language === 'bn' ? 'রুটিন দেখুন' : 'View Routine'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Department Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman">
            {language === 'bn' ? 'জনপ্রিয় বিভাগসমূহ' : 'Popular Departments'}
          </h3>
          <button
            onClick={() => setActiveTab('departments')}
            className="text-xs font-semibold text-blue-900 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {language === 'bn' ? 'সকল বিভাগ দেখুন →' : 'View All Departments →'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularDepts.map((d) => (
            <button
              key={d.id}
              onClick={() => handleDepartmentClick(d.id)}
              className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-left hover:border-blue-600 transition-colors shadow-xs cursor-pointer"
            >
              <div className="font-bold text-slate-900 dark:text-white text-xs font-solaiman">
                {language === 'bn' ? d.nameBn : d.nameEn}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {language === 'bn' ? `কোড: ${d.code}` : `Code: ${d.code}`} · {d.faculty}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Latest Verified Official Notices */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-solaiman">
              {language === 'bn' ? 'সর্বশেষ যাচাইকৃত পরীক্ষা সার্কুলার' : 'Latest Verified Examination Circulars'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn'
                ? 'জাতীয় বিশ্ববিদ্যালয়ের অফিসিয়াল বিজ্ঞপ্তি থেকে যাচাইকৃত সময়সূচি'
                : 'Schedules verified directly against official university circulars'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('notices')}
            className="text-xs font-semibold text-blue-900 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {language === 'bn' ? 'সকল নোটিশ →' : 'View All Notices →'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestNotices.map((n) => {
            const isRevised = n.revisionNumber > 1;
            return (
              <div
                key={n.id}
                onClick={() => handleNoticeClick(n.id, n.year)}
                className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {n.memoNo}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {isRevised ? (
                      <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        সংশোধিত রুটিন (Rev-{n.revisionNumber})
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        যাচাইকৃত
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base font-solaiman">
                    {language === 'bn' ? n.titleBn : n.titleEn}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>সেশন: {n.session}</span>
                    <span>·</span>
                    <span>প্রকাশ: {n.publishDate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-blue-900 dark:text-blue-400">
                  <span>বিভাগ অনুযায়ী রুটিন প্রস্তুত করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-solaiman">
              {t.howItWorksTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'bn' ? 'তিনটি সহজ ধাপে আপনার ব্যক্তিগত রুটিন সংগ্রহ করুন' : 'Get your personalized routine in 3 easy steps'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm">
                ১
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base font-solaiman">
                {t.howItWorksStep1Title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.howItWorksStep1Desc}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm">
                ২
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base font-solaiman">
                {t.howItWorksStep2Title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.howItWorksStep2Desc}
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-sm">
                ৩
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base font-solaiman">
                {t.howItWorksStep3Title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {t.howItWorksStep3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
