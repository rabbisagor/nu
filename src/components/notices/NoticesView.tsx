import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamNotice, HonoursYear } from '../../types';
import {
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  GitCompare,
  X,
  ShieldAlert,
} from 'lucide-react';

export const NoticesView: React.FC = () => {
  const { language, notices, setSelectedNoticeId, setSelectedYear, setActiveTab, t } = useApp();
  const [filterYear, setFilterYear] = useState<string>('all');
  const [comparingNotice, setComparingNotice] = useState<ExamNotice | null>(null);

  const filteredNotices = notices.filter(
    (n) => filterYear === 'all' || n.year === filterYear
  );

  const handleSelectNotice = (notice: ExamNotice) => {
    setSelectedNoticeId(notice.id);
    setSelectedYear(notice.year);
    setActiveTab('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Find predecessor notice for diff comparison
  const getPredecessorNotice = (revisedNotice: ExamNotice) => {
    if (!revisedNotice.supersedesNoticeId) return null;
    return notices.find((n) => n.id === revisedNotice.supersedesNoticeId) || null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-solaiman">
          {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় অফিসিয়াল পরীক্ষার নোটিশ' : 'Official Examination Circulars & Notices'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {language === 'bn'
            ? 'পরীক্ষা নিয়ন্ত্রণ বিভাগ কর্তৃক প্রকাশিত সকল মূল ও সংশোধিত সময়সূচি। প্রতিটি সার্কুলার স্মারক নম্বর ও তারিখ সহ যাচাইকৃত।'
            : 'All official original and revised examination schedules published by National University with verification metadata.'}
        </p>
      </div>

      {/* Year Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {['all', '1st', '2nd', '3rd', '4th'].map((y) => (
          <button
            key={y}
            onClick={() => setFilterYear(y)}
            className={`px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              filterYear === y
                ? 'bg-blue-900 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {y === 'all'
              ? language === 'bn'
                ? 'সকল বর্ষ'
                : 'All Years'
              : `${y} Year`}
          </button>
        ))}
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.map((notice) => {
          const isRevised = notice.revisionNumber > 1;
          const predecessor = getPredecessorNotice(notice);

          return (
            <div
              key={notice.id}
              className={`p-6 rounded-xl border transition-all ${
                notice.status === 'verified'
                  ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-dashed border-slate-300 dark:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  {/* Status & Revision Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500 font-semibold">
                      স্মারক: {notice.memoNo}
                    </span>
                    <span className="text-slate-300">·</span>
                    {notice.status === 'verified' ? (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>কার্যকর ও যাচাইকৃত</span>
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>স্থগিত / সংশোধিত দ্বারা প্রতিস্থাপিত</span>
                      </span>
                    )}

                    {isRevised && (
                      <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 px-2 py-0.5 rounded text-[11px] font-bold">
                        সংশোধিত রুটিন (Revision {notice.revisionNumber})
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman">
                    {language === 'bn' ? notice.titleBn : notice.titleEn}
                  </h3>

                  <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-4">
                    <span>সেশন: {notice.session}</span>
                    <span>·</span>
                    <span>বিজ্ঞপ্তি প্রকাশ: {notice.publishDate}</span>
                    <span>·</span>
                    <span>পরীক্ষা আরম্ভ: {notice.effectiveDate}</span>
                    <span>·</span>
                    <span>যাচাইকারী: {notice.verifiedBy}</span>
                  </div>

                  {/* Revision notes if any */}
                  {notice.revisionNotes && (
                    <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded border border-amber-200 dark:border-amber-800">
                      <strong>সংশোধনী বিবরণ:</strong> {notice.revisionNotes}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {isRevised && predecessor && (
                    <button
                      onClick={() => setComparingNotice(notice)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors cursor-pointer"
                    >
                      <GitCompare className="w-3.5 h-3.5 text-blue-600" />
                      <span>পরিবর্তন তুলনা করুন</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleSelectNotice(notice)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md transition-colors shadow-xs cursor-pointer"
                  >
                    <span>বিভাগীয় রুটিন দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* REVISION COMPARISON DIFF MODAL */}
      {comparingNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 max-w-3xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-solaiman">
                  রুটিন সংশোধন ও পরিবর্তন তুলনা (Revision Comparison)
                </h3>
              </div>
              <button
                onClick={() => setComparingNotice(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-300">
              <p>
                <strong>বর্তমান সংশোধিত সার্কুলার:</strong> {comparingNotice.memoNo} ({comparingNotice.publishDate})
              </p>
              {comparingNotice.revisionNotes && (
                <p className="mt-1 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded">
                  {comparingNotice.revisionNotes}
                </p>
              )}
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">বিষয় কোড</th>
                    <th className="py-2.5 px-3">বিষয়ের নাম</th>
                    <th className="py-2.5 px-3">পূর্বের নির্ধারিত তারিখ</th>
                    <th className="py-2.5 px-3">সংশোধিত নতুন তারিখ</th>
                    <th className="py-2.5 px-3">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {comparingNotice.scheduleItems.map((item) => {
                    const isRescheduled = item.roomOrSpecialNotes?.includes('সংশোধিত');
                    return (
                      <tr
                        key={item.id}
                        className={isRescheduled ? 'bg-amber-50/60 dark:bg-amber-950/30' : ''}
                      >
                        <td className="py-2 px-3 font-mono font-bold text-blue-900 dark:text-blue-400">
                          {item.courseCode}
                        </td>
                        <td className="py-2 px-3 font-solaiman">{item.courseTitleBn}</td>
                        <td className="py-2 px-3 text-slate-400">
                          {isRescheduled ? '২০/১১/২০২৪' : item.date}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                          {item.date} ({item.dayOfWeekBn})
                        </td>
                        <td className="py-2 px-3">
                          {isRescheduled ? (
                            <span className="text-amber-600 dark:text-amber-400 font-bold">
                              পুনর্নির্ধারিত
                            </span>
                          ) : (
                            <span className="text-slate-500">অপরিবর্তিত</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-right pt-2">
              <button
                onClick={() => setComparingNotice(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
