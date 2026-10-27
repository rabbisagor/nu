import { Language } from '../types';

export const translations = {
  bn: {
    // Brand & Header
    appTitle: 'জাতীয় বিশ্ববিদ্যালয় রুটিন মেকার',
    appShortName: 'এনইউ রুটিন',
    appSubtitle: 'জাতীয় বিশ্ববিদ্যালয় অনার্স পরীক্ষার বিভাগভিত্তিক রুটিন জেনারেটর',
    independentDisclaimerBadge: 'একটি উন্মুক্ত শিক্ষার্থী সহায়ক প্ল্যাটফর্ম (বেসরকারি)',

    // Navigation
    navHome: 'হোম',
    navGenerate: 'রুটিন তৈরি করুন',
    navDepartments: 'সকল বিভাগ',
    navYears: 'সকল বর্ষ',
    navNotices: 'অফিসিয়াল নোটিশ',
    navPrevious: 'পূর্ববর্তী রুটিন',
    navAbout: 'বিশ্ববিদ্যালয় পরিচিতি',
    navAdmin: 'অ্যাডমিন ড্যাশবোর্ড',
    navPrivacy: 'গোপনীয়তা নীতি',
    navContact: 'যোগাযোগ',

    // Hero section
    heroTag: 'জাতীয় বিশ্ববিদ্যালয় পরীক্ষা ২০২৩-২৪',
    heroTitle: 'জাতীয় বিশ্ববিদ্যালয়ের পরীক্ষার রুটিন এখন আপনার বিভাগ অনুযায়ী',
    heroSubtitle: 'অফিসিয়াল জটিল নোটিশ থেকে আপনার নির্দিষ্ট ডিপার্টমেন্টের বিষয়সমূহ স্বয়ংক্রিয়ভাবে ফিল্টার করে নিন। ডাউনলোড করুন দৃষ্টিনন্দন প্রিন্ট-রেডি পিডিএফ ও সামাজিক যোগাযোগমাধ্যমে শেয়ারযোগ্য এইচডি ছবি।',
    btnGenerateNow: 'রুটিন তৈরি করুন',
    btnLatestNotices: 'সর্বশেষ অফিসিয়াল নোটিশ',
    officialNoticeWarning: 'সতর্কতা: রুটিনে প্রদত্ত প্রতিটি তারিখ ও সময় জাতীয় বিশ্ববিদ্যালয়ের অফিসিয়াল সার্কুলারের সাথে মিলিয়ে নেওয়া বাধ্যতামূলক। এটি একটি সহায়ক টুল।',

    // Year selection
    yearsTitle: 'অনার্স শিক্ষাবর্ষ নির্বাচন করুন',
    yearsSubtitle: 'আপনার পাঠ্যবর্ষ বেছে নিয়ে এক ক্লিকেই সম্পূর্ণ পরীক্ষা সূচি প্রস্তুত করুন',
    year1: 'অনার্স ১ম বর্ষ',
    year2: 'অনার্স ২য় বর্ষ',
    year3: 'অনার্স ৩য় বর্ষ',
    year4: 'অনার্স ৪র্থ বর্ষ (চূড়ান্ত)',
    year1Desc: 'স্নাতক (সম্মান) প্রথম বর্ষের শিক্ষার্থীদের জন্য প্রণীত সূচি',
    year2Desc: 'স্নাতক (সম্মান) দ্বিতীয় বর্ষের পরীক্ষার্থীদের বিষয়ভিত্তিক তালিকা',
    year3Desc: 'স্নাতক (সম্মান) তৃতীয় বর্ষের বিভাগীয় ও সাধারণ পত্রসমূহ',
    year4Desc: 'স্নাতক (সম্মান) সমাপনী বর্ষের বিশেষায়িত ও গবেষণাপত্র',

    // Generator Form
    genHeaderTitle: 'বিভাগভিত্তিক রুটিন প্রস্তুতকারক',
    genHeaderDesc: 'আপনার বর্ষ ও বিভাগ নির্বাচন করে তাৎক্ষণিক পরীক্ষা সূচি তৈরি করুন',
    labelSelectYear: 'শিক্ষাবর্ষ নির্বাচন করুন',
    labelSelectDept: 'আপনার বিভাগ / বিষয়',
    labelSelectNotice: 'অফিসিয়াল পরীক্ষার নোটিশ',
    labelSelectSession: 'শিক্ষাবর্ষ (সেশন)',
    labelSelectTemplate: 'ডিজাইন টেমপ্লেট',
    labelOutputLanguage: 'রুটিনের ভাষা',
    btnCreateRoutine: 'রুটিন প্রদর্শন করুন',
    btnDownloadPng: 'PNG ডাউনলোড করুন (এইচডি)',
    btnDownloadPdf: 'PDF ডাউনলোড করুন (A4)',
    btnPrint: 'প্রিন্ট করুন',
    btnShare: 'লিংক কপি করুন',

    // Templates
    tmplOfficial: 'অফিসিয়াল একাডেমি',
    tmplModern: 'মডার্ন স্টুডেন্ট',
    tmplMinimal: 'মিনিমাল প্রিন্ট (সাদা-কালো)',
    tmplSocial: 'সোশ্যাল মিডিয়া স্কয়ার (১০৮০×১০৮০)',
    tmplCustom: 'কাস্টম ডিজাইন',

    // Table Headers
    thSl: 'ক্র.নং',
    thDate: 'পরীক্ষার তারিখ',
    thDay: 'বার',
    thCourseCode: 'বিষয় কোড',
    thCourseName: 'বিষয়ের নাম',
    thTime: 'পরীক্ষার সময়',
    thDuration: 'সময়সীমা',
    thRemarks: 'মন্তব্য',

    // Routine metadata in preview
    memoLabel: 'স্মারক নম্বর:',
    examTimeLabel: 'পরীক্ষা শুরুর সময়:',
    publishDateLabel: 'প্রকাশের তারিখ:',
    verificationLabel: 'যাচাইকরণ স্থিতি:',
    statusVerified: 'অফিসিয়াল নোটিশ দ্বারা যাচাইকৃত',
    statusSuperseded: 'সংশোধিত / বাতিলকৃত নোটিশ',
    statusDraft: 'পর্যালোচনায় আছে',
    routineEmptyTitle: 'কোনো পরীক্ষার সূচি পাওয়া যায়নি',
    routineEmptyDesc: 'নির্বাচিত বিভাগ ও শিক্ষাবর্ষের জন্য এখনও কোনো পরীক্ষা সূচি অন্তর্ভুক্ত করা হয়নি। অনুগ্রহ করে অন্য বিভাগ বা বছর নির্বাচন করুন।',

    // How it works
    howItWorksTitle: 'কীভাবে রুটিন মেকার কাজ করে?',
    howItWorksStep1Title: '১. অফিসিয়াল পিডিএফ আপলোড ও যাচাই',
    howItWorksStep1Desc: 'অ্যাডমিন কর্তৃক জাতীয় বিশ্ববিদ্যালয়ের প্রকাশিত অফিসিয়াল সার্কুলার আপলোড এবং প্রতিটি বিষয় কোড ডাটাবেজের সাথে নির্ভুলভাবে মিলিয়ে নেওয়া হয়।',
    howItWorksStep2Title: '২. বিভাগ ও বর্ষ নির্বাচন',
    howItWorksStep2Desc: 'শিক্ষার্থী তার নির্দিষ্ট অনার্স বর্ষ এবং ডিপার্টমেন্ট নির্বাচন করলেই সিস্টেম স্বয়ংক্রিয়ভাবে অন্য বিষয়ের ভিড় সরিয়ে নিজস্ব রুটিন তৈরি করে।',
    howItWorksStep3Title: '৩. হাই-কোয়ালিটি এক্সপোর্ট',
    howItWorksStep3Desc: 'এক ক্লিকে সোশ্যাল মিডিয়ায় শেয়ার উপযোগী高清 ছবি বা পড়ার টেবিলে লাগানোর মতো পরিষ্কার A4 সাইজ পিডিএফ ডাউনলোড করুন।',

    // Revision tracker
    revTagOriginal: 'মূল রুটিন',
    revTagRevised: 'সংশোধিত রুটিন (Revision)',
    revChangeAlert: 'মনোযোগ দিন: এই রুটিনটি সংশোধিত হয়েছে। পরিবর্তিত পরীক্ষার তারিখ ও সময় বিশেষ রঙে চিহ্নিত করা হলো।',

    // Admin Dashboard
    adminTitle: 'অ্যাডমিন নিয়ন্ত্রণ কক্ষ',
    adminSubtitle: 'অফিসিয়াল নোটিশ যাচাইকরণ, পিডিএফ প্রসেসিং এবং বিষয় কোড ম্যাপিং',
    tabOverview: 'সারসংক্ষেপ',
    tabUploadPdf: 'পিডিএফ আপলোড ও এক্সট্র্যাক্ট',
    tabNotices: 'নোটিশ ব্যবস্থাপনা',
    tabDepartments: 'বিভাগ ও কোর্স',
    tabAuditLog: 'অডিট লগ',
    kpiTotalNotices: 'মোট আপলোডকৃত নোটিশ',
    kpiVerifiedSchedules: 'যাচাইকৃত সময়সূচি',
    kpiPublishedRoutines: 'প্রকাশিত রুটিন',
    kpiDeptCoverage: 'বিভাগীয় কভারেজ',
    uploadBoxTitle: 'অফিসিয়াল রুটিনের পিডিএফ আপলোড করুন',
    uploadBoxSub: 'পিডিএফ ফাইল ড্র্যাগ করে ছাড়ুন অথবা ব্রাউজ করুন (সর্বোচ্চ ১৫ মেগাবাইট)',
    ocrToggleLabel: 'স্ক্যান করা পিডিএফ-এর জন্য ওসিআর (OCR) মোড চালু করুন',
    rawTextInputLabel: 'অথবা রুটিনের টেক্সট/টেবিল সরাসরি পেস্ট করুন',
    btnStartExtraction: 'তথ্য রূপান্তর ও কোড ম্যাচ করুন',
    extractionStatus: 'এক্সট্রাকশন স্ট্যাটাস',
    uncertainWarning: 'কয়েকটি বিষয় কোড স্বয়ংক্রিয়ভাবে নিশ্চিত হতে পারেনি। অনুগ্রহ করে নিচের তালিকায় ম্যানুয়ালি রিভিউ করুন।',
    btnVerifyPublish: 'যাচাই করুন ও প্রকাশ করুন',
    btnSupersedeOlder: 'পূর্ববর্তী নোটিশ স্থগিত ঘোষণা করুন',

    // Footer & Disclaimer
    footerDesc: 'জাতীয় বিশ্ববিদ্যালয়ের শিক্ষার্থীদের জন্য একটি উন্মুক্ত ও নিরপেক্ষ শিক্ষা-সহায়ক সেবা। এটি জাতীয় বিশ্ববিদ্যালয়ের কোনো আনুষ্ঠানিক দপ্তর বা অধিভুক্ত ওয়েবসাইট নয়।',
    footerQuickLinks: 'দ্রুত লিংকসমূহ',
    footerOfficialLink: 'জাতীয় বিশ্ববিদ্যালয় অফিসিয়াল সাইট',
    footerCopyright: '© ২০২৬ এনইউ রুটিন মেকার। সর্বস্বত্ব সংরক্ষিত।',
  },
  en: {
    // Brand & Header
    appTitle: 'NU Routine Maker',
    appShortName: 'NU Routine',
    appSubtitle: 'National University Bangladesh Honours Department-Wise Exam Routine Generator',
    independentDisclaimerBadge: 'Independent Student Support Initiative (Unofficial)',

    // Navigation
    navHome: 'Home',
    navGenerate: 'Generate Routine',
    navDepartments: 'All Departments',
    navYears: 'All Years',
    navNotices: 'Official Notices',
    navPrevious: 'Past Routines',
    navAbout: 'About NU',
    navAdmin: 'Admin Dashboard',
    navPrivacy: 'Privacy Policy',
    navContact: 'Contact',

    // Hero section
    heroTag: 'National University Examinations 2023-24',
    heroTitle: 'Your National University Exam Routine, Department by Department',
    heroSubtitle: 'Automatically filter only your department\'s specific exam papers from crowded official PDF circulars. Download crystal-clear print-ready PDFs and social media shareable HD PNG images.',
    btnGenerateNow: 'Generate Routine',
    btnLatestNotices: 'Latest Official Notices',
    officialNoticeWarning: 'Warning: All examination dates and times must be verified against original official National University circulars. This is an independent assistance tool.',

    // Year selection
    yearsTitle: 'Select Honours Academic Year',
    yearsSubtitle: 'Choose your academic year to build your personalized exam schedule in seconds',
    year1: 'Honours 1st Year',
    year2: 'Honours 2nd Year',
    year3: 'Honours 3rd Year',
    year4: 'Honours 4th Year (Final)',
    year1Desc: 'Syllabus and exam timetable for 1st Year undergraduate students',
    year2Desc: 'Departmental and subsidiary exam schedule for 2nd Year students',
    year3Desc: 'Core departmental subjects and elective papers for 3rd Year',
    year4Desc: 'Final Year specialized courses, project papers, and comprehensive viva',

    // Generator Form
    genHeaderTitle: 'Department-Wise Routine Generator',
    genHeaderDesc: 'Select your year and department to instantly view and export your schedule',
    labelSelectYear: 'Academic Year',
    labelSelectDept: 'Department / Subject',
    labelSelectNotice: 'Official Examination Notice',
    labelSelectSession: 'Academic Session',
    labelSelectTemplate: 'Design Template',
    labelOutputLanguage: 'Routine Output Language',
    btnCreateRoutine: 'Generate Timetable',
    btnDownloadPng: 'Download PNG (HD)',
    btnDownloadPdf: 'Download PDF (A4)',
    btnPrint: 'Print Routine',
    btnShare: 'Copy Share Link',

    // Templates
    tmplOfficial: 'Official Academic',
    tmplModern: 'Modern Student',
    tmplMinimal: 'Minimal Print (Black & White)',
    tmplSocial: 'Social Media Square (1080×1080)',
    tmplCustom: 'Custom Layout',

    // Table Headers
    thSl: 'SL',
    thDate: 'Exam Date',
    thDay: 'Day',
    thCourseCode: 'Course Code',
    thCourseName: 'Subject Name',
    thTime: 'Start Time',
    thDuration: 'Duration',
    thRemarks: 'Remarks',

    // Routine metadata in preview
    memoLabel: 'Memo No:',
    examTimeLabel: 'Exam Commencing:',
    publishDateLabel: 'Published Date:',
    verificationLabel: 'Verification Status:',
    statusVerified: 'Verified against Official Circular',
    statusSuperseded: 'Superseded / Revised Notice',
    statusDraft: 'Awaiting Admin Review',
    routineEmptyTitle: 'No Examination Routine Found',
    routineEmptyDesc: 'No examination routine has been mapped yet for the selected department and year. Please check back soon or try another combination.',

    // How it works
    howItWorksTitle: 'How NU Routine Maker Works',
    howItWorksStep1Title: '1. Official PDF Ingestion & Verification',
    howItWorksStep1Desc: 'Administrators upload the official university circular PDF and match every 6-digit course code against the verified curriculum database.',
    howItWorksStep2Title: '2. Select Year & Department',
    howItWorksStep2Desc: 'Students choose their specific department and year. The system discards irrelevant courses and compiles only your required exams.',
    howItWorksStep3Title: '3. High-Fidelity Export',
    howItWorksStep3Desc: 'Download with one click as crisp high-resolution images for mobile screens or printable A4 PDFs formatted with proper Bangla typography.',

    // Revision tracker
    revTagOriginal: 'Original Notice',
    revTagRevised: 'Revised Circular',
    revChangeAlert: 'Notice: This examination routine has been revised by the university. Rescheduled papers and updated times are highlighted.',

    // Admin Dashboard
    adminTitle: 'Admin Command Center',
    adminSubtitle: 'Official Notice Ingestion, PDF Processing & Course Code Mapping Engine',
    tabOverview: 'Overview',
    tabUploadPdf: 'PDF Parsing & Review',
    tabNotices: 'Notice Archives',
    tabDepartments: 'Departments & Courses',
    tabAuditLog: 'Audit Trail',
    kpiTotalNotices: 'Total Notices Ingested',
    kpiVerifiedSchedules: 'Verified Schedules',
    kpiPublishedRoutines: 'Published Routines',
    kpiDeptCoverage: 'Active Departments',
    uploadBoxTitle: 'Upload Official Examination Routine PDF',
    uploadBoxSub: 'Drag & drop official PDF notice or browse files (Max 15 MB)',
    ocrToggleLabel: 'Enable OCR mode for scanned routine images/PDFs',
    rawTextInputLabel: 'Or paste raw routine text / table data directly',
    btnStartExtraction: 'Extract & Match Course Codes',
    extractionStatus: 'Extraction Status',
    uncertainWarning: 'Some course codes had low OCR confidence or missing mappings. Please verify them in the editable review table below.',
    btnVerifyPublish: 'Verify & Publish Schedule',
    btnSupersedeOlder: 'Supersede Previous Revision',

    // Footer & Disclaimer
    footerDesc: 'An open-access educational support initiative for students of National University Bangladesh. This is an independent web application and is not affiliated with or endorsed by the National University.',
    footerQuickLinks: 'Quick Links',
    footerOfficialLink: 'Official NU Portal',
    footerCopyright: '© 2026 NU Routine Maker. All rights reserved.',
  }
};

export const getTranslation = (lang: Language) => translations[lang] || translations.bn;
