import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Faculty } from '../../types';
import { Search, Building, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const DepartmentsView: React.FC = () => {
  const { language, departments, courses, setSelectedDepartmentId, setActiveTab, t } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');

  const faculties: { id: string; labelBn: string; labelEn: string }[] = [
    { id: 'all', labelBn: 'সকল অনুষদ', labelEn: 'All Faculties' },
    { id: 'Business Studies', labelBn: 'ব্যবসায় শিক্ষা অনুষদ', labelEn: 'Business Studies' },
    { id: 'Social Science', labelBn: 'সামাজিক বিজ্ঞান অনুষদ', labelEn: 'Social Science' },
    { id: 'Arts', labelBn: 'কলা অনুষদ', labelEn: 'Faculty of Arts' },
    { id: 'Science', labelBn: 'বিজ্ঞান অনুষদ', labelEn: 'Faculty of Science' },
  ];

  const filteredDepts = departments
    .filter((d) => d.active)
    .filter((d) => selectedFaculty === 'all' || d.faculty === selectedFaculty)
    .filter(
      (d) =>
        d.nameBn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code.includes(searchTerm)
    );

  const handleSelectDept = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    setActiveTab('generate');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-solaiman">
          {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় সকল বিভাগ ও বিষয় কোড' : 'All Departments & Subject Codes'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
          {language === 'bn'
            ? 'অনার্স ১ম, ২য়, ৩য় ও ৪র্থ বর্ষের জন্য অনুমোদিত ডিপার্টমেন্টসমূহ থেকে আপনার বিষয় বেছে নিন।'
            : 'Select your department to view curriculum and generate separate examination schedules.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
        {/* Faculty filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {faculties.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFaculty(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                selectedFaculty === f.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {language === 'bn' ? f.labelBn : f.labelEn}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'বিভাগ বা কোড দিয়ে খুঁজুন...' : 'Search by department or code...'}
            className="w-full text-xs pl-8 pr-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredDepts.map((d) => {
          const deptCourses = courses.filter((c) => c.departmentId === d.id);
          return (
            <div
              key={d.id}
              className="p-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
                  <span>কোড: {d.code}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    {d.faculty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white font-solaiman">
                  {language === 'bn' ? d.nameBn : d.nameEn}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-sans">
                  {language === 'bn' ? d.nameEn : d.nameBn}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {language === 'bn'
                      ? `${deptCourses.length} টি কোর্স সূচি অন্তর্ভুক্ত`
                      : `${deptCourses.length} Courses mapped`}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleSelectDept(d.id)}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{language === 'bn' ? 'রুটিন প্রস্তুত করুন' : 'Generate Routine'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
