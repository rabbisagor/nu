import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamNotice, Department } from '../../types';
import { downloadRoutineAsPng, downloadRoutineAsPdf } from '../../lib/exportUtils';
import { englishToBanglaDigits } from '../../lib/pdfParser';
import { Download, FileDown, CheckCircle2 } from 'lucide-react';

interface RoutinePreviewCardProps {
  notice: ExamNotice;
  department: Department;
  templateId?: any;
}

export const RoutinePreviewCard: React.FC<RoutinePreviewCardProps> = ({
  notice,
  department,
}) => {
  const { language } = useApp();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');

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
    setExportSuccessMsg('');
    const ok = await downloadRoutineAsPng('routine-capture-canvas', exportFilename);
    setIsExporting(false);
    if (ok) {
      setExportSuccessMsg(language === 'bn' ? 'PNG ছবি সফলভাবে ডাউনলোড হয়েছে' : 'PNG downloaded successfully');
      setTimeout(() => setExportSuccessMsg(''), 3000);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportSuccessMsg('');
    const ok = await downloadRoutineAsPdf('routine-capture-canvas', exportFilename, 'p');
    setIsExporting(false);
    if (ok) {
      setExportSuccessMsg(language === 'bn' ? 'A4 PDF সফলভাবে ডাউনলোড হয়েছে' : 'PDF downloaded successfully');
      setTimeout(() => setExportSuccessMsg(''), 3000);
    }
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
      {/* Download Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-solaiman">
            প্রস্তুতকৃত রুটিন:
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white font-solaiman">
            {department.nameBn} বিভাগ — {formatYearBn(notice.year)} ({departmentItems.length} টি পরীক্ষা)
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* High Quality PDF Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{isExporting ? 'প্রসেসিং...' : 'PDF ডাউনলোড (A4)'}</span>
          </button>

          {/* High Quality PNG Download */}
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-all border border-emerald-300 dark:border-emerald-800 shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>ছবি ডাউনলোড (PNG)</span>
          </button>
        </div>
      </div>

      {exportSuccessMsg && (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* THE CAPTURE CONTAINER */}
      <div className="overflow-x-auto pb-4">
        <div
          id="routine-capture-canvas"
          className="mx-auto bg-white text-slate-900 transition-all font-solaiman shadow-lg border border-slate-300 w-[840px] min-h-[1050px] p-8"
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
          }}
        >
          {/* Institutional Header */}
          <div className="text-center border-b-2 border-blue-950 pb-4 relative">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-12 h-12 rounded-full border-2 border-blue-900 bg-blue-50 flex items-center justify-center text-blue-900 font-bold text-xl shadow-xs">
                এনইউ
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-blue-950 font-solaiman leading-tight">
                  জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ
                </h2>
                <p className="text-xs font-bold text-slate-700 tracking-wide">
                  পরীক্ষা নিয়ন্ত্রণ দপ্তর · গাজীপুর-১৭০৪
                </p>
              </div>
            </div>

            {/* Exam Name Badge */}
            <div className="mt-3 bg-blue-950 text-white py-1.5 px-6 rounded inline-block shadow-xs">
              <h3 className="text-base font-bold font-solaiman">
                {notice.examName} — বিভাগীয় সময়সূচি
              </h3>
            </div>

            <div className="mt-2 text-xs flex items-center justify-between px-2 text-slate-700 font-sans">
              <span>
                <strong>স্মারক নং:</strong> {notice.memoNo}
              </span>
              <span>
                <strong>তারিখ:</strong> {notice.publishDate}
              </span>
            </div>
          </div>

          {/* Department Strip */}
          <div className="my-4 bg-slate-50 border border-slate-300 rounded p-3 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-600">বিভাগ / বিষয়: </span>
              <strong className="text-sm text-blue-950 font-bold font-solaiman">
                {department.nameBn} ({department.nameEn})
              </strong>
              <span className="text-slate-600 ml-2">বিষয় কোড: {department.code}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-600">শিক্ষাবর্ষ: </span>
              <strong className="text-slate-900 font-bold">{notice.session}</strong>
              <span className="mx-1">·</span>
              <strong className="text-blue-950 font-bold">{formatYearBn(notice.year)}</strong>
            </div>
          </div>

          {/* Daily Timing Notice */}
          <div className="text-xs text-slate-800 flex items-center justify-between border-b border-slate-300 pb-2 mb-4 font-solaiman">
            <span>
              <strong>পরীক্ষা আরম্ভের সময়:</strong> প্রতিদিন দুপুর ১.৩০ টা
            </span>
            <span>
              <strong>পরীক্ষার সময়কাল:</strong> প্রশ্নপত্রে উল্লেখিত সময়
            </span>
          </div>

          {/* Timetable Table */}
          {departmentItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-300 rounded">
              এই বিভাগের জন্য কোনো বিষয় পাওয়া যায়নি।
            </div>
          ) : (
            <table className="w-full text-left border-collapse border border-slate-400 text-xs font-solaiman">
              <thead>
                <tr className="bg-blue-950 text-white font-semibold text-center">
                  <th className="border border-slate-400 py-2.5 px-2 w-12">ক্র.নং</th>
                  <th className="border border-slate-400 py-2.5 px-3 w-36">তারিখ ও বার</th>
                  <th className="border border-slate-400 py-2.5 px-3 w-28">বিষয় কোড</th>
                  <th className="border border-slate-400 py-2.5 px-3 text-left">বিষয়ের নাম</th>
                  <th className="border border-slate-400 py-2.5 px-3 w-28">পরীক্ষার সময়</th>
                  <th className="border border-slate-400 py-2.5 px-3 w-32">মন্তব্য</th>
                </tr>
              </thead>
              <tbody>
                {departmentItems.map((item, index) => {
                  const isCompulsory = item.departmentIds.includes('all');
                  return (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                    >
                      <td className="border border-slate-300 py-2.5 px-2 text-center font-sans font-medium text-slate-800">
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
                        {item.courseTitleEn && (
                          <div className="text-[11px] text-slate-600 font-sans">
                            {item.courseTitleEn}
                          </div>
                        )}
                      </td>
                      <td className="border border-slate-300 py-2.5 px-3 text-center font-sans text-slate-800 font-medium">
                        {item.time}
                      </td>
                      <td className="border border-slate-300 py-2.5 px-3 text-[11px] text-slate-600">
                        {isCompulsory ? (
                          <span className="text-blue-900 font-bold">আবশ্যিক পত্র</span>
                        ) : (
                          item.roomOrSpecialNotes || 'বিভাগীয় মূল পত্র'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Bottom Instructions & Controller Signatures */}
          <div className="mt-8 pt-4 border-t border-slate-300 flex items-end justify-between text-xs text-slate-700 font-solaiman">
            <div className="max-w-md space-y-1 text-[11px]">
              <p className="font-bold text-slate-900">বিশেষ নির্দেশনাবলী:</p>
              <p>১। প্রশ্নপত্রের ট্রাকে সকল তত্ত্বীয় পরীক্ষা শেষ না হওয়া পর্যন্ত ট্রেজারি থেকে বের করা যাবে না।</p>
              <p>২। তত্ত্বীয় পরীক্ষা শেষ হওয়ার পরে ব্যবহারিক পরীক্ষা শুরু হবে। ব্যবহারিক পরীক্ষার তারিখ ও সময় কলেজ থেকে জেনে নিতে হবে।</p>
              <p className="text-slate-500">
                * জাতীয় বিশ্ববিদ্যালয় অফিসিয়াল সার্কুলার স্মারক: {notice.memoNo}
              </p>
            </div>

            <div className="text-center font-solaiman">
              <div className="w-28 h-8 border-b border-slate-400 mx-auto mb-1 flex items-center justify-center italic text-slate-400 text-xs">
                স্বাক্ষরিত
              </div>
              <p className="font-bold text-slate-900 text-xs">পরীক্ষা নিয়ন্ত্রক</p>
              <p className="text-[11px] text-slate-600">জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
