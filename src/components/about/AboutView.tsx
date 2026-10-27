import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, GraduationCap, Award, ExternalLink, HelpCircle, BookOpen } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-solaiman">
          {language === 'bn' ? 'জাতীয় বিশ্ববিদ্যালয় ও প্ল্যাটফর্ম পরিচিতি' : 'About National University & Routine Platform'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          {language === 'bn'
            ? 'বাংলাদেশ জাতীয় বিশ্ববিদ্যালয়ের অনার্স পরীক্ষা কাঠামো, গ্রেডিং পদ্ধতি এবং স্বাধীন শিক্ষার্থী সহায়তা সেবা।'
            : 'Academic structure, honours examination system, and independent student utility overview.'}
        </p>
      </div>

      {/* Critical Legal Disclaimer Box */}
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-5 text-xs text-amber-900 dark:text-amber-200 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950 dark:text-amber-100">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span>অনানুষ্ঠানিক শিক্ষার্থী সহায়ক উদ্যোগ সংক্রান্ত ঘোষণা (Disclaimer)</span>
        </div>
        <p className="leading-relaxed">
          <strong>এনইউ রুটিন মেকার (NU Routine Maker)</strong> একটি স্বাধীন ও উন্মুক্ত প্রযুক্তিগত সমাধান, যা জাতীয় বিশ্ববিদ্যালয়ের জটিল পরীক্ষা সার্কুলার থেকে শিক্ষার্থীদের সহজে নিজ নিজ বিভাগের রুটিন খুঁজে পেতে সহায়তা করে। এই ওয়েবসাইটটি জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ (National University, Bangladesh)-এর কোনো প্রাতিষ্ঠানিক বা অফিসিয়াল পোর্টাল নয়। সকল পরীক্ষার সময়সূচি সর্বদা বিশ্ববিদ্যালয়ের আনুষ্ঠানিক ওয়েবসাইট (<strong>nu.ac.bd</strong>) থেকে যাচাই করা বাঞ্ছনীয়।
        </p>
      </div>

      {/* National University Honours Structure */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-600" />
          <span>অনার্স (স্নাতক সম্মান) ৪ বছর মেয়াদি পাঠক্রম</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
            <h3 className="font-bold text-slate-800 dark:text-white">১ম ও ২য় বর্ষ (ভিত্তি ও সহায়ক স্তর)</h3>
            <p>
              প্রথম বর্ষে আবশ্যিক সাধারণ পত্র হিসেবে &lsquo;স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস&rsquo; (কোড: ২১১৫০১) সকল বিভাগের পরীক্ষার্থীকে সম্পন্ন করতে হয়। দ্বিতীয় বর্ষে বিভাগীয় মূল বিষয়ের সাথে নন-মেজর সহায়ক পত্র অনুষ্ঠিত হয়।
            </p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-1">
            <h3 className="font-bold text-slate-800 dark:text-white">৩য় ও ৪র্থ বর্ষ (উন্নত ও সমাপনী স্তর)</h3>
            <p>
              তৃতীয় বর্ষে পূর্ণাঙ্গ বিভাগীয় বিশেষায়িত পত্র এবং চতুর্থ বর্ষে তাত্ত্বিক কোর্সের পাশাপাশি টার্ম পেপার/প্রকল্প ও সমন্বিত মৌখিক (Comprehensive Viva) পরীক্ষা গ্রহণ করা হয়।
            </p>
          </div>
        </div>
      </div>

      {/* Grading System Reference */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-solaiman flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span>জাতীয় বিশ্ববিদ্যালয় লেটার গ্রেডিং ও জিপিএ পদ্ধতি</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-2 border">প্রাপ্ত নম্বর সীমা (Marks)</th>
                <th className="p-2 border">লেটার গ্রেড (Grade)</th>
                <th className="p-2 border">গ্রেড পয়েন্ট (GP)</th>
                <th className="p-2 border">মূল্যায়ন মান</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="p-2 border">৮০% বা তদূর্ধ্ব</td>
                <td className="p-2 border font-bold text-blue-900 dark:text-blue-400">A+</td>
                <td className="p-2 border font-mono">৪.০০</td>
                <td className="p-2 border">Outstanding (অসাধারণ)</td>
              </tr>
              <tr>
                <td className="p-2 border">৭৫% থেকে ৭৯%</td>
                <td className="p-2 border font-bold">A</td>
                <td className="p-2 border font-mono">৩.৭৫</td>
                <td className="p-2 border">Excellent (চমৎকার)</td>
              </tr>
              <tr>
                <td className="p-2 border">৭০% থেকে ৭৪%</td>
                <td className="p-2 border font-bold">A-</td>
                <td className="p-2 border font-mono">৩.৫০</td>
                <td className="p-2 border">Very Good (খুব ভালো)</td>
              </tr>
              <tr>
                <td className="p-2 border">৬৫% থেকে ৬৯%</td>
                <td className="p-2 border font-bold">B+</td>
                <td className="p-2 border font-mono">৩.২৫</td>
                <td className="p-2 border">Good (ভালো)</td>
              </tr>
              <tr>
                <td className="p-2 border">৪০% থেকে ৪৪%</td>
                <td className="p-2 border font-bold text-amber-600">D</td>
                <td className="p-2 border font-mono">২.০০</td>
                <td className="p-2 border">Pass (উত্তীর্ণ)</td>
              </tr>
              <tr>
                <td className="p-2 border">৪০% এর নিচে</td>
                <td className="p-2 border font-bold text-red-600">F</td>
                <td className="p-2 border font-mono">০.০০</td>
                <td className="p-2 border">Fail (অনুত্তীর্ণ)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Links */}
      <div className="text-center pt-2">
        <a
          href="https://www.nu.ac.bd"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-900 dark:text-blue-400 hover:underline"
        >
          <span>জাতীয় বিশ্ববিদ্যালয়ের অফিসিয়াল ওয়েবসাইট ভিজিট করুন</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
