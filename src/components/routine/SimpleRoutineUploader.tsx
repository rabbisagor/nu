import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { HonoursYear, Department, ExamNotice, RoutineTemplateId } from '../../types';
import { RoutinePreviewCard } from './RoutinePreviewCard';
import { TEMPLATE_CONFIGS } from '../../data/nuData';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Clock,
  Calendar,
  AlertCircle,
  FileCheck,
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
    selectedTemplateId,
    setSelectedTemplateId,
    t,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload & Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [currentNotice, setCurrentNotice] = useState<ExamNotice>(() => {
    return notices[0];
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Active department object
  const activeDept =
    departments.find((d) => d.id === selectedDepartmentId) || departments[0];

  // Handle file select (PDF or Image)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setUploadedFileName(file.name);
    setIsAnalyzing(true);
    setAnalysisProgress('ফাইল লোড করা হচ্ছে...');

    try {
      // Read file as base64 data URL
      const reader = new FileReader();
      const fileDataPromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const fileData = await fileDataPromise;

      setAnalysisProgress('শিক্ষাবর্ষ ও পরীক্ষার সময়সূচি স্বয়ংক্রিয়ভাবে শনাক্ত হচ্ছে...');

      // Call backend API
      const res = await fetch('/api/analyze-routine-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileData,
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const data = await res.json();

      if (data.success && data.notice) {
        setAnalysisProgress('সকল বিভাগের আলাদা রুটিন তৈরি হচ্ছে...');
        await new Promise((r) => setTimeout(r, 400));

        // Update notice & year
        setCurrentNotice(data.notice);
        setSelectedYear(data.detectedYear as HonoursYear);

        // Add to context notices
        setNotices((prev) => [data.notice, ...prev.filter((n) => n.id !== data.notice.id)]);

        // Keep or set department
        if (!selectedDepartmentId) {
          setSelectedDepartmentId(departments[0].id);
        }
      } else {
        throw new Error(data.error || 'বিশ্লেষণ সম্পন্ন হতে পারেনি');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'ফাইল বিশ্লেষণে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  // Quick 1-click test with any year's demo routine
  const handleQuickDemoYear = async (year: HonoursYear) => {
    setErrorMsg('');
    setIsAnalyzing(true);
    setUploadedFileName(`Official_Honours_${year}_Year_Routine.pdf`);
    setAnalysisProgress(`অনার্স ${year === '1st' ? '১ম' : year === '2nd' ? '২য়' : year === '3rd' ? '৩য়' : '৪র্থ'} বর্ষের অফিসিয়াল রুটিন লোড হচ্ছে...`);

    try {
      const res = await fetch('/api/analyze-routine-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: `Honours_${year}_Year_Exam_Routine.pdf`,
          yearOverride: year,
        }),
      });

      const data = await res.json();
      if (data.success && data.notice) {
        await new Promise((r) => setTimeout(r, 400));
        setCurrentNotice(data.notice);
        setSelectedYear(year);
        setNotices((prev) => [data.notice, ...prev.filter((n) => n.id !== data.notice.id)]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress('');
    }
  };

  // Trigger hidden file picker
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getYearLabelBn = (y: string) => {
    switch (y) {
      case '1st':
        return 'অনার্স ১ম বর্ষ';
      case '2nd':
        return 'অনার্স ২য় বর্ষ';
      case '3rd':
        return 'অনার্স ৩য় বর্ষ';
      case '4th':
        return 'অনার্স ৪র্থ বর্ষ (চূড়ান্ত)';
      default:
        return `${y} বর্ষ`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero & Upload Zone */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-solaiman tracking-tight">
          {language === 'bn'
            ? 'রুটিনের PDF বা ছবি দিন, বিভাগভিত্তিক রুটিন নিন'
            : 'Upload Routine PDF or Image, Get Department Timetables'}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-solaiman leading-relaxed">
          {language === 'bn'
            ? 'জাতীয় বিশ্ববিদ্যালয়ের যেকোনো বর্ষের অফিসিয়াল রুটিন আপলোড করলেই সিস্টেম স্বয়ংক্রিয়ভাবে বছর শনাক্ত করে প্রতিটি বিভাগের জন্য নির্ভুল ও আলাদা রুটিন তৈরি করে দিবে।'
            : 'Upload official examination routine PDF or Image. The system detects the Honours year and generates separate timetables for all departments.'}
        </p>
      </div>

      {/* Main Drag-and-Drop Upload Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-900/60 p-8 sm:p-12 text-center shadow-sm hover:border-blue-600 transition-all relative overflow-hidden">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf, .png, .jpg, .jpeg, .webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isAnalyzing ? (
          <div className="py-6 space-y-4">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-solaiman">
                {analysisProgress || 'ফাইল বিশ্লেষণ চলছে...'}
              </h3>
              <p className="text-xs text-slate-500">
                স্বয়ংক্রিয়ভাবে বিষয় কোড ও বিভাগসমূহ ফিল্টার করা হচ্ছে
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-400 mx-auto flex items-center justify-center shadow-xs">
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman">
                {language === 'bn'
                  ? 'অফিসিয়াল রুটিন PDF বা ছবি (PNG / JPG) আপলোড করুন'
                  : 'Upload Routine PDF or Image (PNG / JPG)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                কম্পিউটার বা মোবাইল থেকে ফাইল ড্র্যাগ করে ছাড়ুন অথবা ব্রাউজ করুন (PDF, PNG, JPG, JPEG)
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-6 py-3 text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>ফাইল নির্বাচন করুন</span>
              </button>
            </div>

            {uploadedFileName && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>লোডকৃত ফাইল: {uploadedFileName}</span>
              </div>
            )}

            {/* Quick 1-click Test Buttons for all Honours Years */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <span className="text-xs text-slate-500 block mb-2 font-medium">
                ফাইল না থাকলে সরাসরি ডেমো রুটিন দিয়ে পরীক্ষা করুন:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoYear('1st')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 hover:text-blue-900 transition-colors cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  ⚡ অনার্স ১ম বর্ষ রুটিন
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoYear('2nd')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 hover:text-blue-900 transition-colors cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  ⚡ অনার্স ২য় বর্ষ রুটিন
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoYear('3rd')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 hover:text-blue-900 transition-colors cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  ⚡ অনার্স ৩য় বর্ষ রুটিন
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoYear('4th')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-800 dark:text-slate-200 hover:text-blue-900 transition-colors cursor-pointer border border-slate-200 dark:border-slate-600"
                >
                  ⚡ অনার্স ৪র্থ বর্ষ (চূড়ান্ত)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-4 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* GENERATED ROUTINE RESULTS SECTION */}
      {currentNotice && (
        <div className="space-y-6 pt-2">
          {/* Detected Year & Notice Summary Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-white font-bold px-2.5 py-0.5 rounded text-xs">
                  ✓ শনাক্তকৃত
                </span>
                <span className="text-blue-200 text-xs font-semibold">
                  {currentNotice.session} সেশন
                </span>
              </div>
              <h2 className="text-xl font-bold font-solaiman text-white">
                {currentNotice.examName} — বিভাগীয় রুটিন প্রস্তুত!
              </h2>
              <p className="text-xs text-blue-200">
                স্মারক নং: {currentNotice.memoNo} · প্রকাশের তারিখ: {currentNotice.publishDate}
              </p>
            </div>

            {/* Quick Switch Year Buttons */}
            <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-xl border border-white/10 self-start md:self-auto">
              <span className="text-[11px] text-blue-200 px-2 font-medium">বর্ষ পরিবর্তন:</span>
              {(['1st', '2nd', '3rd', '4th'] as HonoursYear[]).map((y) => (
                <button
                  key={y}
                  onClick={() => handleQuickDemoYear(y)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentNotice.year === y
                      ? 'bg-white text-blue-950 shadow-xs'
                      : 'text-blue-200 hover:text-white'
                  }`}
                >
                  {y} Year
                </button>
              ))}
            </div>
          </div>

          {/* Department Selection Selector (Horizontal Chips) */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>আপনার বিভাগ নির্বাচন করুন ({departments.length} টি বিভাগ প্রস্তুত):</span>
              </label>
              <span className="text-xs text-blue-900 dark:text-blue-400 font-semibold">
                নির্বাচিত: {activeDept.nameBn} ({activeDept.code})
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {departments.map((dept) => {
                const isSelected = selectedDepartmentId === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSelectedDepartmentId(dept.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="font-solaiman text-[13px]">{dept.nameBn}</span>
                    <span className="text-[10px] opacity-70 ml-1.5 font-mono">({dept.code})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Template Switcher Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ডিজাইন রূপরেখা (Template):
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {(Object.keys(TEMPLATE_CONFIGS) as RoutineTemplateId[]).map((tmplKey) => {
                const conf = TEMPLATE_CONFIGS[tmplKey];
                const isSelected = selectedTemplateId === tmplKey;
                return (
                  <button
                    key={tmplKey}
                    onClick={() => setSelectedTemplateId(tmplKey)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {language === 'bn' ? conf.nameBn : conf.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* THE LIVE PREVIEW CARD WITH PNG / PDF EXPORT */}
          <RoutinePreviewCard
            notice={currentNotice}
            department={activeDept}
            templateId={selectedTemplateId}
          />
        </div>
      )}
    </div>
  );
};
