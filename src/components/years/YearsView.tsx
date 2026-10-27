import React from 'react';
import { useApp } from '../../context/AppContext';
import { HonoursYear } from '../../types';
import { Calendar, BookOpen, GraduationCap, ArrowRight, ShieldCheck } from 'lucide-react';

export const YearsView: React.FC = () => {
  const { language, notices, setSelectedYear, setSelectedNoticeId, setActiveTab } = useApp();

  const yearConfigs: {
    year: HonoursYear;
    titleBn: string;
    titleEn: string;
    session: string;
    activeExamBn: string;
    activeExamEn: string;
    descBn: string;
    descEn: string;
  }[] = [
    {
      year: '1st',
      titleBn: 'অনার্স ১ম বর্ষ (Honours 1st Year)',
      titleEn: 'Honours 1st Year Examination',
      session: '২০২২-২০২৩ শিক্ষাবর্ষ',
      activeExamBn: '২০২৩ সালের অনার্স ১ম বর্ষ পরীক্ষা',
      activeExamEn: 'Honours 1st Year Examination 2023',
      descBn: 'প্রথম বর্ষের শিক্ষার্থীদের জন্য আবশ্যিক স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস পত্রসহ সকল বিভাগীয় মৌলিক পত্রের সময়সূচি।',
      descEn: 'Timetable including the compulsory History of Independent Bangladesh and fundamental departmental courses.',
    },
    {
      year: '2nd',
      titleBn: 'অনার্স ২য় বর্ষ (Honours 2nd Year)',
      titleEn: 'Honours 2nd Year Examination',
      session: '২০২১-২০২২ শিক্ষাবর্ষ',
      activeExamBn: '২০২৩ সালের অনার্স ২য় বর্ষ পরীক্ষা',
      activeExamEn: 'Honours 2nd Year Examination 2023',
      descBn: 'দ্বিতীয় বর্ষের শিক্ষার্থীদের বিভাগীয় উন্নত পত্র ও সহায়ক (Non-major) কোর্সসমূহের সমন্বয়ে গঠিত পরীক্ষা সূচি।',
      descEn: 'Second-year major papers and subsidiary courses schedule verified against university circulars.',
    },
    {
      year: '3rd',
      titleBn: 'অনার্স ৩য় বর্ষ (Honours 3rd Year)',
      titleEn: 'Honours 3rd Year Examination',
      session: '২০২০-২০২১ শিক্ষাবর্ষ',
      activeExamBn: '২০২৩ সালের অনার্স ৩য় বর্ষ পরীক্ষা',
      activeExamEn: 'Honours 3rd Year Examination 2023',
      descBn: 'তৃতীয় বর্ষের পূর্ণাঙ্গ বিভাগীয় বিশেষায়িত ও গবেষণা ভিত্তিক বিষয়সমূহের পরীক্ষা সময়সূচি।',
      descEn: 'Advanced departmental specialization modules and technical subject examinations.',
    },
    {
      year: '4th',
      titleBn: 'অনার্স ৪র্থ বর্ষ (Honours 4th Year - Final)',
      titleEn: 'Honours 4th Year (Final) Examination',
      session: '২০১৯-২০২০ শিক্ষাবর্ষ',
      activeExamBn: '২০২২ সালের অনার্স ৪র্থ বর্ষ পরীক্ষা',
      activeExamEn: 'Honours 4th Year Final Examination 2022',
      descBn: 'স্নাতক (সম্মান) সমাপনী বর্ষের শিক্ষার্থীদের তত্ত্বীয় পরীক্ষা, টার্ম পেপার এবং মৌখিক পরীক্ষার পূর্ণাঙ্গ সূচি।',
      descEn: 'Comprehensive schedule for final year theory papers, project viva, and comprehensive evaluation.',
    },
  ];

  const handleSelectYear = (year: HonoursYear) => {
    setSelectedYear(year);
    const notice = notices.find((n) => n.year === year && n.status === 'verified');
    if (notice) {
      setSelectedNoticeId(notice.id);
    }
    setActiveTab('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-solaiman">
          {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় অনার্স শিক্ষাবর্ষসমূহ' : 'Honours Academic Examination Years'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {language === 'bn'
            ? 'অনার্স ১ম বর্ষ থেকে ৪র্থ বর্ষ (চূড়ান্ত) পর্যন্ত সকল বর্ষের চলমান ও পূর্ববর্তী পরীক্ষার রুটিন।'
            : 'Select an undergraduate academic year to view verified circulars and generate department-specific timetables.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {yearConfigs.map((cfg) => {
          const yearNotices = notices.filter((n) => n.year === cfg.year);
          return (
            <div
              key={cfg.year}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-blue-900 dark:text-blue-400 font-bold">
                  <span className="bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded">
                    {cfg.session}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {yearNotices.length} টি সার্কুলার
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-solaiman">
                  {language === 'bn' ? cfg.titleBn : cfg.titleEn}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'bn' ? cfg.descBn : cfg.descEn}
                </p>

                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    চলমান অফিসিয়াল পরীক্ষা:
                  </span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 font-solaiman">
                    {language === 'bn' ? cfg.activeExamBn : cfg.activeExamEn}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectYear(cfg.year)}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'bn' ? 'এই বর্ষের রুটিন তৈরি করুন' : 'Generate This Year\'s Routine'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
