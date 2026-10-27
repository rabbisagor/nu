import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExamNotice, Department } from '../../types';
import { downloadRoutineAsPng, downloadRoutineAsPdf, printRoutine } from '../../lib/exportUtils';
import { englishToBanglaDigits } from '../../lib/pdfParser';
import { Download, FileDown, Printer, CheckCircle2, Loader2 } from 'lucide-react';

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
  const [exportType, setExportType] = useState<'png' | 'pdf' | ''>('');
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
    setExportType('png');
    setExportSuccessMsg('');
    try {
      const ok = await downloadRoutineAsPng('routine-capture-canvas', exportFilename);
      if (ok) {
        setExportSuccessMsg('✓ PNG ছবি সফলভাবে ডাউনলোড হয়েছে!');
        setTimeout(() => setExportSuccessMsg(''), 4000);
      } else {
        printRoutine('routine-capture-canvas');
      }
    } catch (e) {
      console.error(e);
      printRoutine('routine-capture-canvas');
    } finally {
      setIsExporting(false);
      setExportType('');
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setExportType('pdf');
    setExportSuccessMsg('');
    try {
      const ok = await downloadRoutineAsPdf('routine-capture-canvas', exportFilename, 'p');
      if (ok) {
        setExportSuccessMsg('✓ A4 সাইজ PDF ফাইল সফলভাবে ডাউনলোড হয়েছে!');
        setTimeout(() => setExportSuccessMsg(''), 4000);
      } else {
        printRoutine('routine-capture-canvas');
      }
    } catch (e) {
      console.error(e);
      printRoutine('routine-capture-canvas');
    } finally {
      setIsExporting(false);
      setExportType('');
    }
  };

  const handleNativePrint = () => {
    printRoutine('routine-capture-canvas');
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
      {/* Download Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-solaiman">
            নির্বাচিত বিভাগ ও বর্ষ:
          </span>
          <span className="text-base font-bold text-slate-900 dark:text-white font-solaiman">
            {department.nameBn} বিভাগ — {formatYearBn(notice.year)} ({departmentItems.length} টি পরীক্ষা)
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          {/* High Quality PDF Download */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-60"
            title="Download A4 PDF"
          >
            {isExporting && exportType === 'pdf' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            <span>{isExporting && exportType === 'pdf' ? 'পিডিএফ প্রস্তুত হচ্ছে...' : 'PDF ডাউনলোড (A4)'}</span>
          </button>

          {/* High Quality PNG Download */}
          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-xl transition-all border border-emerald-300 dark:border-emerald-800 shadow-xs cursor-pointer disabled:opacity-60"
            title="Download High Quality PNG Image"
          >
            {isExporting && exportType === 'png' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting && exportType === 'png' ? 'ছবি প্রস্তুত হচ্ছে...' : 'ছবি ডাউনলোড (PNG)'}</span>
          </button>

          {/* Browser Print / Native PDF */}
          <button
            onClick={handleNativePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-600"
            title="Print or Save as PDF"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট</span>
          </button>
        </div>
      </div>

      {exportSuccessMsg && (
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-300 dark:border-emerald-800 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* THE CAPTURE CONTAINER (Using standard Hex/RGB colors for 100% canvas rendering reliability) */}
      <div className="overflow-x-auto pb-4">
        <div
          id="routine-capture-canvas"
          className="mx-auto transition-all font-solaiman shadow-lg border w-[840px] min-h-[1050px] p-8"
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            borderColor: '#cbd5e1',
          }}
        >
          {/* Institutional Header */}
          <div
            className="text-center pb-4 relative"
            style={{ borderBottom: '2px solid #172554' }}
          >
            <div className="flex items-center justify-center gap-3 mb-1">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-xs"
                style={{
                  border: '2px solid #1e3a8a',
                  backgroundColor: '#eff6ff',
                  color: '#1e3a8a',
                }}
              >
                এনইউ
              </div>
              <div>
                <h2
                  className="text-2xl font-bold tracking-tight font-solaiman leading-tight"
                  style={{ color: '#0f172a' }}
                >
                  জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ
                </h2>
                <p className="text-xs font-bold tracking-wide" style={{ color: '#334155' }}>
                  পরীক্ষা নিয়ন্ত্রণ দপ্তর · গাজীপুর-১৭০৪
                </p>
              </div>
            </div>

            {/* Exam Name Badge */}
            <div
              className="mt-3 py-1.5 px-6 rounded inline-block shadow-xs"
              style={{ backgroundColor: '#172554', color: '#ffffff' }}
            >
              <h3 className="text-base font-bold font-solaiman">
                {notice.examName} — বিভাগীয় সময়সূচি
              </h3>
            </div>

            <div
              className="mt-2 text-xs flex items-center justify-between px-2 font-sans"
              style={{ color: '#475569' }}
            >
              <span>
                <strong>স্মারক নং:</strong> {notice.memoNo}
              </span>
              <span>
                <strong>তারিখ:</strong> {notice.publishDate}
              </span>
            </div>
          </div>

          {/* Department Strip */}
          <div
            className="my-4 rounded p-3 flex items-center justify-between text-xs"
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
            }}
          >
            <div>
              <span style={{ color: '#475569' }}>বিভাগ / বিষয়: </span>
              <strong className="text-sm font-bold font-solaiman" style={{ color: '#172554' }}>
                {department.nameBn} ({department.nameEn})
              </strong>
              <span style={{ color: '#475569', marginLeft: '8px' }}>বিষয় কোড: {department.code}</span>
            </div>
            <div className="text-right">
              <span style={{ color: '#475569' }}>শিক্ষাবর্ষ: </span>
              <strong style={{ color: '#0f172a' }}>{notice.session}</strong>
              <span style={{ margin: '0 4px', color: '#94a3b8' }}>·</span>
              <strong style={{ color: '#172554' }}>{formatYearBn(notice.year)}</strong>
            </div>
          </div>

          {/* Daily Timing Notice */}
          <div
            className="text-xs flex items-center justify-between pb-2 mb-4 font-solaiman"
            style={{
              borderBottom: '1px solid #cbd5e1',
              color: '#1e293b',
            }}
          >
            <span>
              <strong>পরীক্ষা আরম্ভের সময়:</strong> প্রতিদিন দুপুর ১.৩০ টা
            </span>
            <span>
              <strong>পরীক্ষার সময়কাল:</strong> প্রশ্নপত্রে উল্লেখিত সময়
            </span>
          </div>

          {/* Timetable Table */}
          {departmentItems.length === 0 ? (
            <div
              className="text-center py-12 rounded"
              style={{
                color: '#64748b',
                border: '1px dashed #cbd5e1',
              }}
            >
              এই বিভাগের জন্য কোনো বিষয় পাওয়া যায়নি।
            </div>
          ) : (
            <table
              className="w-full text-left border-collapse text-xs font-solaiman"
              style={{ border: '1px solid #94a3b8' }}
            >
              <thead>
                <tr
                  className="font-semibold text-center"
                  style={{
                    backgroundColor: '#172554',
                    color: '#ffffff',
                  }}
                >
                  <th style={{ border: '1px solid #64748b', padding: '10px 8px', width: '48px' }}>ক্র.নং</th>
                  <th style={{ border: '1px solid #64748b', padding: '10px 12px', width: '144px' }}>তারিখ ও বার</th>
                  <th style={{ border: '1px solid #64748b', padding: '10px 12px', width: '110px' }}>বিষয় কোড</th>
                  <th style={{ border: '1px solid #64748b', padding: '10px 12px', textAlign: 'left' }}>বিষয়ের নাম</th>
                  <th style={{ border: '1px solid #64748b', padding: '10px 12px', width: '110px' }}>পরীক্ষার সময়</th>
                  <th style={{ border: '1px solid #64748b', padding: '10px 12px', width: '128px' }}>মন্তব্য</th>
                </tr>
              </thead>
              <tbody>
                {departmentItems.map((item, index) => {
                  const isCompulsory = item.departmentIds.includes('all');
                  const rowBg = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                  return (
                    <tr key={item.id} style={{ backgroundColor: rowBg }}>
                      <td
                        style={{
                          border: '1px solid #cbd5e1',
                          padding: '10px 8px',
                          textAlign: 'center',
                          fontFamily: 'sans-serif',
                          fontWeight: 500,
                          color: '#1e293b',
                        }}
                      >
                        {englishToBanglaDigits(index + 1)}
                      </td>
                      <td
                        style={{
                          border: '1px solid #cbd5e1',
                          padding: '10px 12px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontFamily: 'sans-serif' }}>
                          {englishToBanglaDigits(item.date)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'SolaimanLipi, sans-serif' }}>
                          {item.dayOfWeekBn}
                        </div>
                      </td>
                      <td
                        style={{
                          border: '1px solid #cbd5e1',
                          padding: '10px 12px',
                          textAlign: 'center',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          color: '#172554',
                        }}
                      >
                        {item.courseCode}
                      </td>
                      <td
                        style={{
                          border: '1px solid #cbd5e1',
                          padding: '10px 12px',
                        }}
                      >
                        <div style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '13px' }}>
                          {item.courseTitleBn}
                        </div>
                        {item.courseTitleEn && (
                          <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'sans-serif' }}>
                            {item.courseTitleEn}
                          </div>
                        )}
                      </td>
                      <td
                        style={{
                          border: '1px solid #cbd5e1',
                          padding: '10px 12px',
                          textAlign: 'center',
                          fontFamily: 'sans-serif',
                          color: '#1e293b',
                          fontWeight: 500,
                        }}
                      >
                        {item.time}
                      </td>
                      <td
                        style={{
                          border: '1px solid #cbd5e1',
                          padding: '10px 12px',
                          fontSize: '11px',
                          color: '#475569',
                        }}
                      >
                        {isCompulsory ? (
                          <span style={{ color: '#1e3a8a', fontWeight: 'bold' }}>আবশ্যিক পত্র</span>
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
          <div
            className="mt-8 pt-4 flex items-end justify-between text-xs font-solaiman"
            style={{
              borderTop: '1px solid #cbd5e1',
              color: '#334155',
            }}
          >
            <div className="max-w-md space-y-1 text-[11px]">
              <p style={{ fontWeight: 'bold', color: '#0f172a' }}>বিশেষ নির্দেশনাবলী:</p>
              <p>১। প্রশ্নপত্রের ট্রাংক সকল তত্ত্বীয় পরীক্ষা শেষ না হওয়া পর্যন্ত ট্রেজারি থেকে বের করা যাবে না।</p>
              <p>২। তত্ত্বীয় পরীক্ষা শেষ হওয়ার পরে ব্যবহারিক পরীক্ষা শুরু হবে। ব্যবহারিক পরীক্ষার তারিখ ও সময় কলেজ থেকে জেনে নিতে হবে।</p>
              <p style={{ color: '#64748b' }}>
                * জাতীয় বিশ্ববিদ্যালয় অফিসিয়াল সার্কুলার স্মারক: {notice.memoNo}
              </p>
            </div>

            <div className="text-center font-solaiman">
              <div
                className="w-28 h-8 mx-auto mb-1 flex items-center justify-center italic text-xs"
                style={{
                  borderBottom: '1px solid #94a3b8',
                  color: '#94a3b8',
                }}
              >
                স্বাক্ষরিত
              </div>
              <p style={{ fontWeight: 'bold', color: '#0f172a', fontSize: '12px' }}>পরীক্ষা নিয়ন্ত্রক</p>
              <p style={{ fontSize: '11px', color: '#475569' }}>জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
