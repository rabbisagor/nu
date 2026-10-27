import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamNotice, Department, RoutineTemplateId } from '../../types';
import { TEMPLATE_CONFIGS } from '../../data/nuData';
import { downloadRoutineAsPng, downloadRoutineAsPdf, printRoutine } from '../../lib/exportUtils';
import { englishToBanglaDigits } from '../../lib/pdfParser';
import {
  Download,
  FileDown,
  Printer,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  Building,
  Info,
} from 'lucide-react';

interface RoutinePreviewCardProps {
  notice: ExamNotice;
  department: Department;
  templateId?: RoutineTemplateId;
}

export const RoutinePreviewCard: React.FC<RoutinePreviewCardProps> = ({
  notice,
  department,
  templateId = 'official',
}) => {
  const { language, t } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showEnglishTitles, setShowEnglishTitles] = useState(true);

  const config = TEMPLATE_CONFIGS[templateId] || TEMPLATE_CONFIGS.official;

  // Filter schedule items that belong to this department or 'all'
  const departmentItems = notice.scheduleItems
    .filter((item) => {
      if (item.departmentIds.includes('all')) return true;
      if (item.departmentIds.includes(department.id)) return true;
      return false;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const exportFilename = `NU_Routine_${department.code}_${notice.year}_Year_${notice.session}`;

  const handleDownloadPng = async () => {
    setIsExporting(true);
    await downloadRoutineAsPng('routine-capture-canvas', exportFilename);
    setIsExporting(false);
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await downloadRoutineAsPdf('routine-capture-canvas', exportFilename, 'p');
    setIsExporting(false);
  };

  const handlePrint = () => {
    printRoutine('routine-capture-canvas');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatYearBn = (y: string) => {
    switch (y) {
      case '1st':
        return '১ম বর্ষ';
      case '2nd':
        return '২য় বর্ষ';
      case '3rd':
        return '৩য় বর্ষ';
      case '4th':
        return '৪র্থ বর্ষ (চূড়ান্ত)';
      default:
        return `${y} বর্ষ`;
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar above preview */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showEnglishTitles}
              onChange={(e) => setShowEnglishTitles(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>{language === 'bn' ? 'ইংরেজি বিষয় নাম প্রদর্শন' : 'Show English Titles'}</span>
          </label>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            title="Download high-resolution image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'প্রসেসিং...' : t.btnDownloadPng}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors shadow-xs cursor-pointer border border-slate-200 dark:border-slate-600 disabled:opacity-50"
            title="Download A4 PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{t.btnDownloadPdf}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="Print"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.btnPrint}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="Share"
          >
            {copySuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copySuccess ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : t.btnShare}</span>
          </button>
        </div>
      </div>

      {/* Revision Notice Banner if applicable */}
      {notice.revisionNumber > 1 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">{t.revChangeAlert}</p>
            {notice.revisionNotes && (
              <p className="text-amber-800 dark:text-amber-300">{notice.revisionNotes}</p>
            )}
          </div>
        </div>
      )}

      {/* THE CAPTURE CONTAINER */}
      <div className="overflow-x-auto pb-4">
        <div
          id="routine-capture-canvas"
          className={`mx-auto bg-white text-slate-900 transition-all font-solaiman shadow-md border border-slate-200 ${
            templateId === 'social'
              ? 'w-[720px] min-h-[720px] p-8'
              : templateId === 'minimal'
              ? 'w-[800px] min-h-[1050px] p-8 bg-white'
              : 'w-[820px] min-h-[1050px] p-8'
          }`}
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
          }}
        >
          {/* TEMPLATE A: OFFICIAL ACADEMIC */}
          {templateId === 'official' && (
            <div className="space-y-6">
              {/* Institutional Header */}
              <div className="text-center border-b-2 border-blue-900 pb-4 relative">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full border-2 border-blue-900 bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-xl shadow-xs">
                    এনইউ
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-blue-950 font-solaiman leading-tight">
                      জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ
                    </h2>
                    <p className="text-xs font-semibold text-slate-600 tracking-wide">
                      গাজীপুর-১৭০৪ · পরীক্ষা নিয়ন্ত্রণ বিভাগ
                    </p>
                  </div>
                </div>

                {/* Subtitle & Circular details */}
                <div className="mt-3 bg-blue-950 text-white py-1.5 px-4 rounded-sm inline-block shadow-xs">
                  <h3 className="text-base font-bold font-solaiman">
                    {notice.examName} — বিভাগীয় সময়সূচি
                  </h3>
                </div>

                <div className="mt-2 text-xs flex items-center justify-between px-2 text-slate-600 font-sans">
                  <span>
                    <strong>স্মারক নং:</strong> {notice.memoNo}
                  </span>
                  <span>
                    <strong>তারিখ:</strong> {notice.publishDate}
                  </span>
                </div>
              </div>

              {/* Department & Year Strip */}
              <div className="bg-slate-50 border border-slate-300 rounded p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">বিভাগ / বিষয়: </span>
                  <strong className="text-sm text-blue-900 font-bold font-solaiman">
                    {department.nameBn} ({department.nameEn})
                  </strong>
                  <span className="text-slate-500 ml-2">বিষয় কোড: {department.code}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">শিক্ষাবর্ষ: </span>
                  <strong className="text-slate-800">{notice.session}</strong>
                  <span className="mx-1">·</span>
                  <strong className="text-blue-900">{formatYearBn(notice.year)}</strong>
                </div>
              </div>

              {/* General exam instructions */}
              <div className="text-[11px] text-slate-600 flex items-center justify-between border-b border-slate-200 pb-2">
                <span>
                  <strong>পরীক্ষা শুরুর সময়:</strong> প্রতিদিন দুপুর ০১:০০ টা (শুক্রবার বেলা ০২:৩০ টা)
                </span>
                <span>
                  <strong>পরীক্ষার সময়কাল:</strong> প্রশ্নপত্রে উল্লেখিত সময়কাল (৪ ঘণ্টা)
                </span>
              </div>

              {/* Timetable Table */}
              {departmentItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-dashed border-slate-300 rounded">
                  {t.routineEmptyTitle}
                </div>
              ) : (
                <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                  <thead>
                    <tr className="bg-blue-900 text-white font-semibold text-center">
                      <th className="border border-slate-400 py-2 px-2 w-12">{t.thSl}</th>
                      <th className="border border-slate-400 py-2 px-3 w-36">{t.thDate} ও বার</th>
                      <th className="border border-slate-400 py-2 px-3 w-24">{t.thCourseCode}</th>
                      <th className="border border-slate-400 py-2 px-3 text-left">{t.thCourseName}</th>
                      <th className="border border-slate-400 py-2 px-3 w-28">{t.thTime}</th>
                      <th className="border border-slate-400 py-2 px-3 w-32">{t.thRemarks}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentItems.map((item, index) => {
                      const isCompulsory = item.departmentIds.includes('all');
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                          }`}
                        >
                          <td className="border border-slate-300 py-2.5 px-2 text-center font-sans font-medium text-slate-700">
                            {englishToBanglaDigits(index + 1)}
                          </td>
                          <td className="border border-slate-300 py-2.5 px-3 text-center">
                            <div className="font-bold text-slate-900 font-sans">
                              {englishToBanglaDigits(item.date)}
                            </div>
                            <div className="text-[11px] text-slate-600 font-solaiman">
                              {item.dayOfWeekBn}
                            </div>
                          </td>
                          <td className="border border-slate-300 py-2.5 px-3 text-center font-mono font-bold text-blue-950">
                            {item.courseCode}
                          </td>
                          <td className="border border-slate-300 py-2.5 px-3">
                            <div className="font-bold text-slate-900 font-solaiman text-[13px]">
                              {item.courseTitleBn}
                            </div>
                            {showEnglishTitles && item.courseTitleEn && (
                              <div className="text-[11px] text-slate-500 font-sans">
                                {item.courseTitleEn}
                              </div>
                            )}
                          </td>
                          <td className="border border-slate-300 py-2.5 px-3 text-center font-sans text-slate-700 font-medium">
                            {item.time}
                          </td>
                          <td className="border border-slate-300 py-2.5 px-3 text-[11px] text-slate-600">
                            {isCompulsory ? (
                              <span className="text-blue-800 font-medium">আবশ্যিক পত্র</span>
                            ) : (
                              item.roomOrSpecialNotes || 'বিভাগীয় পত্র'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* Bottom Instructions & Signatures */}
              <div className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between text-xs text-slate-600">
                <div className="max-w-md space-y-1 text-[11px]">
                  <p className="font-semibold text-slate-800">বিশেষ নির্দেশনাবলী:</p>
                  <p>১. প্রবেশপত্র ব্যতিরেকে কোনো পরীক্ষার্থীকে কেন্দ্রে প্রবেশ করতে দেওয়া হবে না।</p>
                  <p>২. পরীক্ষা কেন্দ্রে মোবাইল ফোন বা কোনো অবৈধ ইলেকট্রনিক ডিভাইস বহন সম্পূর্ণ নিষিদ্ধ।</p>
                  <p className="text-slate-500">
                    * মূল বিজ্ঞপ্তি থেকে স্বয়ংক্রিয়ভাবে ফিল্টারকৃত। মূল স্মারক: {notice.memoNo}
                  </p>
                </div>

                <div className="text-center font-solaiman">
                  <div className="w-28 h-8 border-b border-slate-400 mx-auto mb-1 flex items-center justify-center italic text-slate-400 text-xs">
                    স্বাক্ষরিত
                  </div>
                  <p className="font-bold text-slate-900 text-xs">পরীক্ষা নিয়ন্ত্রক</p>
                  <p className="text-[11px] text-slate-600">জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ</p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    ✓ সার্কুলার দ্বারা যাচাইকৃত
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE B: MODERN STUDENT */}
          {templateId === 'modern' && (
            <div className="space-y-6">
              {/* Modern Gradient Accent Header */}
              <div className="rounded-xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 shadow-md relative overflow-hidden">
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-blue-300 font-semibold font-sans">
                      National University Bangladesh
                    </span>
                    <h2 className="text-2xl font-bold font-solaiman text-white mt-1">
                      {notice.examName}
                    </h2>
                    <p className="text-sm text-blue-200 mt-1">
                      {department.nameBn} বিভাগ · {formatYearBn(notice.year)} ({notice.session})
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-right">
                    <span className="text-[11px] text-blue-200 block">স্মারক নং</span>
                    <span className="text-xs font-mono font-bold">{notice.memoNo}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200 font-sans">
                  <span>পরীক্ষা শুরু: প্রতিদিন দুপুর ০১:০০ টা</span>
                  <span>যাচাইকরণ স্থিতি: অফিসিয়াল নোটিশ অনুসারে প্রস্তুত</span>
                </div>
              </div>

              {/* Cards / Table */}
              <div className="space-y-2.5">
                {departmentItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {/* Date Badge */}
                      <div className="w-20 text-center py-1 px-2 rounded-md bg-blue-100 text-blue-950 shrink-0">
                        <div className="text-xs font-bold font-sans">
                          {englishToBanglaDigits(item.date)}
                        </div>
                        <div className="text-[10px] font-semibold text-blue-800">
                          {item.dayOfWeekBn}
                        </div>
                      </div>

                      {/* Course Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                            {item.courseCode}
                          </span>
                          <span className="font-bold text-slate-900 text-sm font-solaiman">
                            {item.courseTitleBn}
                          </span>
                        </div>
                        {showEnglishTitles && (
                          <div className="text-xs text-slate-500 font-sans mt-0.5">
                            {item.courseTitleEn}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Time & Duration */}
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-slate-800 font-sans flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        <span>{item.time}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.duration}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>এনইউ রুটিন মেকার · nu-routine.org</span>
                <span>অফিসিয়াল নোটিশ তারিখ: {notice.publishDate}</span>
              </div>
            </div>
          )}

          {/* TEMPLATE C: MINIMAL PRINT (Black and White for Laser Printers) */}
          {templateId === 'minimal' && (
            <div className="space-y-4 text-black">
              <div className="text-center border-b border-black pb-3">
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ
                </h2>
                <h3 className="text-base font-bold mt-1">
                  {notice.examName} — {department.nameBn} বিভাগ
                </h3>
                <div className="text-xs flex justify-between mt-2 font-mono">
                  <span>স্মারক: {notice.memoNo}</span>
                  <span>সেশন: {notice.session}</span>
                  <span>বর্ষ: {formatYearBn(notice.year)}</span>
                </div>
              </div>

              <table className="w-full text-left border-collapse border border-black text-xs font-serif">
                <thead>
                  <tr className="border-b-2 border-black font-bold text-center bg-gray-100">
                    <th className="border border-black p-2 w-10">নং</th>
                    <th className="border border-black p-2 w-32">তারিখ ও বার</th>
                    <th className="border border-black p-2 w-24">কোড</th>
                    <th className="border border-black p-2 text-left">বিষয়</th>
                    <th className="border border-black p-2 w-24">সময়</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-black">
                      <td className="border border-black p-2 text-center">{index + 1}</td>
                      <td className="border border-black p-2 text-center">
                        <div>{item.date}</div>
                        <div className="text-[10px]">{item.dayOfWeekBn}</div>
                      </td>
                      <td className="border border-black p-2 text-center font-bold font-mono">
                        {item.courseCode}
                      </td>
                      <td className="border border-black p-2">
                        <div className="font-bold">{item.courseTitleBn}</div>
                        {showEnglishTitles && (
                          <div className="text-[10px] italic">{item.courseTitleEn}</div>
                        )}
                      </td>
                      <td className="border border-black p-2 text-center">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-[11px] pt-4 border-t border-black flex justify-between">
                <span>* পরীক্ষা আরম্ভের সময়: দুপুর ০১:০০ টা</span>
                <span>যাচাইকৃত অফিসিয়াল রুটিন কপি</span>
              </div>
            </div>
          )}

          {/* TEMPLATE D: SOCIAL MEDIA SQUARE (1080x1080) */}
          {templateId === 'social' && (
            <div className="flex flex-col justify-between h-[650px] bg-slate-900 text-white p-6 rounded-xl border border-slate-700 relative">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                      NU
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-slate-400 block font-sans">
                        National University
                      </span>
                      <span className="text-base font-bold text-white font-solaiman leading-none">
                        জাতীয় বিশ্ববিদ্যালয়
                      </span>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>

                <div className="text-center my-4">
                  <h3 className="text-xl font-bold font-solaiman text-amber-300">
                    {notice.examName}
                  </h3>
                  <p className="text-base font-bold text-white mt-1">
                    {department.nameBn} বিভাগ · {formatYearBn(notice.year)} ({notice.session})
                  </p>
                </div>
              </div>

              {/* Middle Timetable Rows */}
              <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
                {departmentItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-600/30 text-blue-300 font-mono text-xs px-2 py-1 rounded font-bold">
                        {item.date.slice(5)}
                      </div>
                      <div>
                        <span className="font-mono text-amber-300 font-bold mr-2">
                          {item.courseCode}
                        </span>
                        <span className="font-semibold text-white font-solaiman">
                          {item.courseTitleBn}
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">{item.time}</span>
                  </div>
                ))}
              </div>

              {/* Social Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>স্মারক: {notice.memoNo}</span>
                <span>রুটিন প্রস্তুত: NU Routine Maker</span>
              </div>
            </div>
          )}

          {/* TEMPLATE E: CUSTOM */}
          {templateId === 'custom' && (
            <div className="space-y-6">
              {/* Emerald Accent Header */}
              <div className="text-center pb-4 border-b-2 border-emerald-700">
                <h2 className="text-2xl font-bold text-emerald-950 font-solaiman">
                  জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ
                </h2>
                <h3 className="text-lg font-bold text-emerald-800 mt-1">
                  {notice.examName} — {department.nameBn} বিভাগ
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  সেশন: {notice.session} · {formatYearBn(notice.year)} · স্মারক নং: {notice.memoNo}
                </p>
              </div>

              {/* Table */}
              <table className="w-full text-left border-collapse border border-emerald-300 text-xs">
                <thead>
                  <tr className="bg-emerald-800 text-white font-semibold text-center">
                    <th className="border border-emerald-400 p-2 w-10">ক্র.নং</th>
                    <th className="border border-emerald-400 p-2 w-36">তারিখ ও বার</th>
                    <th className="border border-emerald-400 p-2 w-24">বিষয় কোড</th>
                    <th className="border border-emerald-400 p-2 text-left">বিষয়ের নাম</th>
                    <th className="border border-emerald-400 p-2 w-28">সময়</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-emerald-50/50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30'
                      }`}
                    >
                      <td className="border border-emerald-200 p-2.5 text-center font-sans">
                        {index + 1}
                      </td>
                      <td className="border border-emerald-200 p-2.5 text-center">
                        <div className="font-bold text-slate-900 font-sans">{item.date}</div>
                        <div className="text-[11px] text-slate-600">{item.dayOfWeekBn}</div>
                      </td>
                      <td className="border border-emerald-200 p-2.5 text-center font-mono font-bold text-emerald-900">
                        {item.courseCode}
                      </td>
                      <td className="border border-emerald-200 p-2.5">
                        <div className="font-bold text-slate-900 font-solaiman text-[13px]">
                          {item.courseTitleBn}
                        </div>
                        {showEnglishTitles && (
                          <div className="text-[11px] text-slate-500">{item.courseTitleEn}</div>
                        )}
                      </td>
                      <td className="border border-emerald-200 p-2.5 text-center font-sans font-medium">
                        {item.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
                <span>জাতীয় বিশ্ববিদ্যালয় রুটিন জেনারেটর</span>
                <span>প্রকাশকাল: {notice.publishDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
