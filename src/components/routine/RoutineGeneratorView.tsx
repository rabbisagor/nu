import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HonoursYear, RoutineTemplateId } from '../../types';
import { RoutinePreviewCard } from './RoutinePreviewCard';
import { TEMPLATE_CONFIGS } from '../../data/nuData';
import {
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const RoutineGeneratorView: React.FC = () => {
  const {
    language,
    t,
    selectedYear,
    setSelectedYear,
    selectedDepartmentId,
    setSelectedDepartmentId,
    selectedNoticeId,
    setSelectedNoticeId,
    selectedTemplateId,
    setSelectedTemplateId,
    departments,
    notices,
    getDepartmentById,
    getNoticeById,
  } = useApp();

  const [deptSearch, setDeptSearch] = useState('');

  // Filter notices for selected year
  const availableNotices = notices.filter((n) => n.year === selectedYear);

  // If current selected notice doesn't match selected year, switch to first available
  const activeNotice =
    availableNotices.find((n) => n.id === selectedNoticeId) ||
    availableNotices[0] ||
    notices[0];

  const activeDepartment =
    getDepartmentById(selectedDepartmentId) || departments[0];

  const filteredDepartments = departments
    .filter((d) => d.active)
    .filter(
      (d) =>
        d.nameBn.toLowerCase().includes(deptSearch.toLowerCase()) ||
        d.nameEn.toLowerCase().includes(deptSearch.toLowerCase()) ||
        d.code.includes(deptSearch)
    );

  const yearsList: { id: HonoursYear; labelBn: string; labelEn: string }[] = [
    { id: '1st', labelBn: 'অনার্স ১ম বর্ষ', labelEn: 'Honours 1st Year' },
    { id: '2nd', labelBn: 'অনার্স ২য় বর্ষ', labelEn: 'Honours 2nd Year' },
    { id: '3rd', labelBn: 'অনার্স ৩য় বর্ষ', labelEn: 'Honours 3rd Year' },
    { id: '4th', labelBn: 'অনার্স ৪র্থ বর্ষ', labelEn: 'Honours 4th Year' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-solaiman">
          {t.genHeaderTitle}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {t.genHeaderDesc}
        </p>
      </div>

      {/* Control Selection Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-6">
        {/* Step 1: Year Selection Tabs */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
            ১. {t.labelSelectYear}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {yearsList.map((y) => (
              <button
                key={y.id}
                onClick={() => {
                  setSelectedYear(y.id);
                  const matching = notices.find((n) => n.year === y.id);
                  if (matching) setSelectedNoticeId(matching.id);
                }}
                className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all text-center border cursor-pointer ${
                  selectedYear === y.id
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {language === 'bn' ? y.labelBn : y.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Department Selector with Search */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ২. {t.labelSelectDept}
            </label>
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                placeholder={language === 'bn' ? 'বিভাগ খুঁজুন...' : 'Search department...'}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-700/50 rounded-lg">
            {filteredDepartments.map((dept) => {
              const isSelected = selectedDepartmentId === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartmentId(dept.id)}
                  className={`p-2 rounded-md text-left text-xs transition-colors border cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-900 dark:text-blue-300 font-bold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate font-solaiman text-[13px]">
                    {language === 'bn' ? dept.nameBn : dept.nameEn}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {dept.code} · {dept.faculty}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Notice Selector & Template Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              ৩. {t.labelSelectNotice}
            </label>
            <select
              value={activeNotice ? activeNotice.id : ''}
              onChange={(e) => setSelectedNoticeId(e.target.value)}
              className="w-full text-xs p-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {availableNotices.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.examName} ({n.session}) — {n.revisionNumber > 1 ? `[সংশোধিত Rev-${n.revisionNumber}]` : '[মূল সার্কুলার]'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">
              ৪. {t.labelSelectTemplate}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {(Object.keys(TEMPLATE_CONFIGS) as RoutineTemplateId[]).map((tmplKey) => {
                const conf = TEMPLATE_CONFIGS[tmplKey];
                const isSelected = selectedTemplateId === tmplKey;
                return (
                  <button
                    key={tmplKey}
                    onClick={() => setSelectedTemplateId(tmplKey)}
                    className={`p-1.5 rounded text-center text-[11px] font-medium border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {language === 'bn' ? conf.nameBn : conf.nameEn}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Routine Preview Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>
              {language === 'bn'
                ? `${activeDepartment.nameBn} বিভাগের পরীক্ষা সূচি`
                : `${activeDepartment.nameEn} Department Exam Routine`}
            </span>
          </h2>
          <span className="text-xs text-slate-500">
            {language === 'bn' ? 'সরাসরি প্রিভিউ ও ডাউনলোড' : 'Live Preview & Download'}
          </span>
        </div>

        {activeNotice && activeDepartment ? (
          <RoutinePreviewCard
            notice={activeNotice}
            department={activeDepartment}
            templateId={selectedTemplateId}
          />
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
            <p className="font-semibold text-base">{t.routineEmptyTitle}</p>
            <p className="text-xs mt-1">{t.routineEmptyDesc}</p>
          </div>
        )}
      </div>
    </div>
  );
};
