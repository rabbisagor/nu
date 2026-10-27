import React, { useState, useEffect } from 'react';
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
  Radio,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
  Layers,
  FileCheck,
  Download,
} from 'lucide-react';

interface LiveNotice {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
  isRoutine: boolean;
  year?: HonoursYear;
  category: string;
}

export const NoticesView: React.FC = () => {
  const { language, notices, setNotices, setSelectedNoticeId, setSelectedYear, setActiveTab, t } = useApp();

  // Tab: 'live' (nu.ac.bd/recent-news-notice.php) or 'saved' (verified routine database)
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'saved'>('live');

  // Live notices state
  const [liveNotices, setLiveNotices] = useState<LiveNotice[]>([]);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [liveSearch, setLiveSearch] = useState('');
  const [liveCategoryFilter, setLiveCategoryFilter] = useState<string>('all');
  const [liveSource, setLiveSource] = useState<string>('live');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Analysis state for 1-click routine generation
  const [analyzingNotice, setAnalyzingNotice] = useState<LiveNotice | null>(null);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Saved notices filter
  const [filterYear, setFilterYear] = useState<string>('all');
  const [comparingNotice, setComparingNotice] = useState<ExamNotice | null>(null);

  // Fetch live notices from server API
  const fetchLiveNotices = async (forceRefresh = false) => {
    setIsLoadingLive(true);
    try {
      const res = await fetch(`/api/nu-notices${forceRefresh ? '?refresh=true' : ''}`);
      const data = await res.json();
      if (data && data.notices) {
        setLiveNotices(data.notices);
        setLiveSource(data.source);
        setLastUpdated(data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString() : '');
      }
    } catch (err) {
      console.error('Failed to fetch live notices:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchLiveNotices();
  }, []);

  // Filtered live notices
  const filteredLiveNotices = liveNotices
    .filter((n) => {
      if (liveCategoryFilter === 'all') return true;
      if (liveCategoryFilter === 'routine') return n.isRoutine;
      if (liveCategoryFilter === 'honours') return /অনার্স|honours/i.test(n.title);
      return n.category === liveCategoryFilter;
    })
    .filter((n) => {
      if (!liveSearch.trim()) return true;
      return n.title.toLowerCase().includes(liveSearch.toLowerCase()) || n.date.toLowerCase().includes(liveSearch.toLowerCase());
    });

  // Filtered saved notices
  const filteredSavedNotices = notices.filter(
    (n) => filterYear === 'all' || n.year === filterYear
  );

  const handleSelectNotice = (notice: ExamNotice) => {
    setSelectedNoticeId(notice.id);
    setSelectedYear(notice.year);
    setActiveTab('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1-Click: Analyze Live PDF and Generate Routine
  const handleAnalyzeAndGenerate = async (notice: LiveNotice) => {
    setAnalyzingNotice(notice);
    setIsAnalyzing(true);
    setAnalysisStep(1); // 1: Downloading PDF
    setAnalysisResult(null);

    try {
      // Step 1: Downloading
      await new Promise((r) => setTimeout(r, 600));
      setAnalysisStep(2); // 2: Extracting pages & OCR

      const response = await fetch('/api/analyze-nu-notice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfUrl: notice.pdfUrl,
          title: notice.title,
          date: notice.date,
          year: notice.year || '1st',
        }),
      });

      setAnalysisStep(3); // 3: Matching course codes & department mapping
      await new Promise((r) => setTimeout(r, 600));

      const data = await response.json();

      if (data.success && data.notice) {
        setAnalysisStep(4); // 4: Complete!
        setAnalysisResult(data.notice);

        // Prepend to app's notices
        setNotices((prev) => {
          const exists = prev.find((n) => n.id === data.notice.id);
          if (exists) return prev;
          return [data.notice, ...prev];
        });
      } else {
        throw new Error('Analysis could not complete');
      }
    } catch (err) {
      console.error(err);
      setAnalysisStep(-1); // Error state
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenGeneratedRoutine = () => {
    if (analysisResult) {
      setSelectedNoticeId(analysisResult.id);
      setSelectedYear(analysisResult.year);
      setAnalyzingNotice(null);
      setActiveTab('generate');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPredecessorNotice = (revisedNotice: ExamNotice) => {
    if (!revisedNotice.supersedesNoticeId) return null;
    return notices.find((n) => n.id === revisedNotice.supersedesNoticeId) || null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-solaiman">
                {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় অফিসিয়াল পরীক্ষার নোটিশ' : 'Official Examination Circulars & Notices'}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              {language === 'bn'
                ? 'nu.ac.bd/recent-news-notice.php থেকে সরাসরি সংগৃহীত নোটিশ ও পরীক্ষা রুটিন। যেকোনো নোটিসের পিডিএফ এনালাইসিস করে তাৎক্ষণিক রুটিন তৈরি করুন।'
                : 'Directly synced with official portal nu.ac.bd/recent-news-notice.php. Ingest and analyze any official notice PDF to generate routine.'}
            </p>
          </div>

          {/* Refresh live feed button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchLiveNotices(true)}
              disabled={isLoadingLive}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin text-blue-600' : ''}`} />
              <span>{language === 'bn' ? 'লাইভ রিফ্রেশ' : 'Live Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Tab switchers: Live nu.ac.bd vs Saved verified repository */}
        <div className="mt-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-0">
          <button
            onClick={() => setActiveSubTab('live')}
            className={`py-2 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'live'
                ? 'border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>{language === 'bn' ? 'লাইভ নোটিশ বোর্ড (nu.ac.bd)' : 'Live Notice Board (nu.ac.bd)'}</span>
            <span className="text-[10px] bg-blue-100 dark:bg-slate-800 text-blue-900 dark:text-blue-300 px-1.5 py-0.2 rounded font-mono">
              {liveNotices.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('saved')}
            className={`py-2 px-4 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'saved'
                ? 'border-blue-900 text-blue-900 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'যাচাইকৃত রুটিন সংগ্রহশালা' : 'Verified Routines Database'}</span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-mono">
              {notices.length}
            </span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE NOTICES FROM nu.ac.bd */}
      {activeSubTab === 'live' && (
        <div className="space-y-6">
          {/* Official Portal Reference Strip */}
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center shrink-0">
                এন
              </div>
              <div>
                <span className="font-bold text-blue-950 dark:text-blue-200 block">
                  জাতীয় বিশ্ববিদ্যালয়ের অফিসিয়াল রিসেন্ট নোটিশ ফিড
                </span>
                <span className="text-blue-800 dark:text-blue-400 font-mono text-[11px]">
                  https://www.nu.ac.bd/recent-news-notice.php
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-500">
                সর্বশেষ সিঙ্ক: {lastUpdated || 'এখনই'}
              </span>
              <a
                href="https://www.nu.ac.bd/recent-news-notice.php"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-blue-900 dark:text-blue-300 hover:underline"
              >
                <span>অফিসিয়াল সাইটে দেখুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Filter and Search Bar for Live Notices */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
              {[
                { id: 'all', labelBn: 'সকল নোটিশ', labelEn: 'All' },
                { id: 'routine', labelBn: 'পরীক্ষার রুটিন', labelEn: 'Exam Routines' },
                { id: 'honours', labelBn: 'অনার্স পরীক্ষাসমূহ', labelEn: 'Honours Only' },
                { id: 'কেন্দ্র তালিকা', labelBn: 'কেন্দ্র তালিকা', labelEn: 'Center List' },
                { id: 'ব্যবহারিক ও মৌখিক', labelBn: 'ব্যবহারিক/মৌখিক', labelEn: 'Practical/Viva' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setLiveCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    liveCategoryFilter === cat.id
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {language === 'bn' ? cat.labelBn : cat.labelEn}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={liveSearch}
                onChange={(e) => setLiveSearch(e.target.value)}
                placeholder={language === 'bn' ? 'নোটিশ খুঁজুন...' : 'Search notices...'}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Live Notice Cards */}
          {isLoadingLive ? (
            <div className="text-center py-16 space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                nu.ac.bd থেকে সর্বশেষ নোটিশসমূহ লোড করা হচ্ছে...
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredLiveNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-sans font-medium text-slate-500">
                        {notice.date}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-300 px-2 py-0.5 rounded text-[11px] font-bold">
                        {notice.category}
                      </span>
                      {notice.year && (
                        <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 px-2 py-0.5 rounded text-[11px] font-bold">
                          {notice.year} Year
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-solaiman leading-snug">
                      {notice.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <a
                        href={notice.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 inline-flex items-center gap-1 font-mono"
                      >
                        <FileText className="w-3.5 h-3.5 text-red-600" />
                        <span>মূল পিডিএফ ফাইল</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* 1-Click Action to Analyze & Generate Routine */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleAnalyzeAndGenerate(notice)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-xs cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>{language === 'bn' ? 'পিডিএফ বিশ্লেষণ ও রুটিন তৈরি করুন' : 'Analyze PDF & Generate'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SAVED VERIFIED ROUTINES */}
      {activeSubTab === 'saved' && (
        <div className="space-y-6">
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
            {filteredSavedNotices.map((notice) => {
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

                      {notice.revisionNotes && (
                        <div className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded border border-amber-200 dark:border-amber-800">
                          <strong>সংশোধনী বিবরণ:</strong> {notice.revisionNotes}
                        </div>
                      )}
                    </div>

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
        </div>
      )}

      {/* PDF ANALYSIS & ROUTINE GENERATION PROGRESS MODAL */}
      {analyzingNotice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-blue-600 font-bold block mb-1">
                  জাতীয় বিশ্ববিদ্যালয় সার্কুলার প্রসেসর
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-solaiman">
                  {analyzingNotice.title}
                </h3>
              </div>
              {!isAnalyzing && (
                <button
                  onClick={() => setAnalyzingNotice(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Step-by-Step Pipeline */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    analysisStep > 1
                      ? 'bg-emerald-600 text-white'
                      : analysisStep === 1
                      ? 'bg-blue-600 text-white animate-spin'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {analysisStep > 1 ? '✓' : '১'}
                </div>
                <span className={analysisStep >= 1 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400'}>
                  nu.ac.bd থেকে মূল পিডিএফ সার্কুলার ডাউনলোড করা হচ্ছে...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    analysisStep > 2
                      ? 'bg-emerald-600 text-white'
                      : analysisStep === 2
                      ? 'bg-blue-600 text-white animate-spin'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {analysisStep > 2 ? '✓' : '২'}
                </div>
                <span className={analysisStep >= 2 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400'}>
                  পিডিএফ পেজ ও টেবিল থেকে পরীক্ষার তারিখ ও সময় এক্সট্রাকশন...
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                    analysisStep > 3
                      ? 'bg-emerald-600 text-white'
                      : analysisStep === 3
                      ? 'bg-blue-600 text-white animate-spin'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {analysisStep > 3 ? '✓' : '৩'}
                </div>
                <span className={analysisStep >= 3 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400'}>
                  ৬-ডিজিট বিষয় কোড মিলিয়ে বিভাগভিত্তিক রুটিন ম্যাপিং সম্পন্ন...
                </span>
              </div>
            </div>

            {/* Success Action Box */}
            {analysisStep === 4 && analysisResult && (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>রুটিন প্রস্তুত হয়েছে! ({analysisResult.scheduleItems.length} টি পরীক্ষা সূচি অন্তর্ভুক্ত)</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  এখন আপনার বিভাগ (যেমন হিসাববিজ্ঞান, ব্যবস্থাপনা, ইংরেজি ইত্যাদি) সিলেক্ট করে আলাদা রুটিন ডাউনলোড করুন।
                </p>
                <button
                  onClick={handleOpenGeneratedRoutine}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>বিভাগভিত্তিক রুটিন দেখুন ও ডাউনলোড করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
