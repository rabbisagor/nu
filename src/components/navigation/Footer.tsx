import React from 'react';
import { useApp } from '../../context/AppContext';
import { ExternalLink, ShieldCheck, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setActiveTab, t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About & Independent Disclaimer */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                এন
              </div>
              <span className="text-white font-bold text-base">
                {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় রুটিন মেকার' : 'NU Routine Maker'}
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-md">
              {t.footerDesc}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/90 pt-1">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{t.officialNoticeWarning}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navGenerate}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('departments')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navDepartments}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('years')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navYears}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notices')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navNotices}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('previous')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navPrevious}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional & Privacy */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              {language === 'bn' ? 'বিশ্ববিদ্যালয় ও নীতিমালা' : 'Official Portal & Policy'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.nu.ac.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <span>{t.footerOfficialLink} (nu.ac.bd)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navPrivacy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{t.footerCopyright}</p>
          <div className="flex items-center gap-4 text-xs">
            <span>SolaimanLipi & Plus Jakarta Sans</span>
            <span>·</span>
            <span>Honours 1st, 2nd, 3rd, 4th Year</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
