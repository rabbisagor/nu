import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Mail, Send, CheckCircle2, MessageSquare, MapPin } from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  const { language } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-solaiman">
          {language === 'bn' ? 'গোপনীয়তা ও তথ্য নিরাপত্তা নীতি' : 'Privacy Policy'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn' ? 'সর্বশেষ হালনাগাদ: নভেম্বর ২০২৪' : 'Last updated: November 2024'}
        </p>
      </div>

      <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-solaiman">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            ১. সাধারণ তথ্য ও শিক্ষার্থীর গোপনীয়তা
          </h2>
          <p>
            এনইউ রুটিন মেকার শিক্ষার্থীদের ব্যক্তিগত পরীক্ষা রুটিন তৈরি বা ডাউনলোড করার জন্য কোনো প্রকার ব্যক্তিগত তথ্য (যেমন নাম, রোল নম্বর, রেজিস্ট্রেশন নম্বর বা মোবাইল নম্বর) সংগ্রহ করে না। এটি একটি সর্বজনীন ও উন্মুক্ত তথ্য-প্রক্রিয়াকরণ টুল।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            ২. ব্রাউজার স্টোরেজ ও কুকিজ
          </h2>
          <p>
            আপনার পছন্দের ভাষা (বাংলা বা ইংরেজি) এবং ডার্ক/লাইট থিম মোড মনে রাখার জন্য শুধুমাত্র ক্লায়েন্ট-সাইড লোকাল স্টোরেজ (LocalStorage) ব্যবহৃত হয়। এই তথ্য আপনার ডিভাইসেই সংরক্ষিত থাকে এবং কোনো তৃতীয় পক্ষের সাথে আদান-প্রদান করা হয় না।
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            ৩. তথ্যের সঠিকতা ও দায়মুক্তি (Limitation of Liability)
          </h2>
          <p>
            আমরা অফিসিয়াল নোটিশ থেকে বিষয় কোডসমূহ সতর্কতার সাথে যাচাই করে থাকি। তবে মুদ্রণজনিত ত্রুটি বা বিশ্ববিদ্যালয়ের আকস্মিক নোটিশ পরিবর্তনের কারণে তথ্যের অমিলের জন্য ব্যবহারকারীকে মূল সার্কুলারটি দেখে নেওয়ার অনুরোধ করা হচ্ছে।
          </p>
        </section>
      </div>
    </div>
  );
};

export const ContactView: React.FC = () => {
  const { language } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white font-solaiman">
          {language === 'bn' ? 'যোগাযোগ ও ফিডব্যাক' : 'Contact & Student Feedback'}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn'
            ? 'রুটিন সংক্রান্ত কোনো অসঙ্গতি চোখে পড়লে বা নতুন ফিচার পরামর্শ থাকলে আমাদের লিখুন।'
            : 'Report routine discrepancies or send feedback to our student support team.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          {submitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-solaiman">
                {language === 'bn' ? 'আপনার বার্তা গৃহীত হয়েছে!' : 'Thank you for your message!'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'আমরা শীঘ্রই আপনার প্রেরিত তথ্য যাচাই করে প্রয়োজনীয় পদক্ষেপ গ্রহণ করব।'
                  : 'We will review your inquiry and take appropriate action.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-900 rounded-md"
              >
                নতুন বার্তা পাঠান
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    {language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'বিষয় / সার্কুলার রেফারেন্স' : 'Subject / Circular Reference'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: অনার্স ১ম বর্ষ পরীক্ষা ২০২৩ সংশোধনী তথ্য"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Message Details'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আপনার মতামত বা তারিখের অসঙ্গতি সংক্ষেপে লিখুন..."
                  className="w-full p-2.5 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-800 rounded-md transition-colors cursor-pointer"
              >
                বার্তা প্রেরণ করুন
              </button>
            </form>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white">জরুরি যোগাযোগ</h4>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>support@nu-routine.org</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
