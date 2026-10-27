import { ExamScheduleItem, Course } from '../types';

// Convert Bangla numerals to English
export function banglaToEnglishDigits(str: string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, (char) => {
    const idx = banglaDigits.indexOf(char);
    return idx !== -1 ? String(idx) : char;
  });
}

// Convert English numerals to Bangla
export function englishToBanglaDigits(str: string | number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/[0-9]/g, (char) => {
    return banglaDigits[Number(char)];
  });
}

// Map English day to Bangla day
export function getBanglaDayOfWeek(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const day = date.getDay();
    const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    return daysBn[day] || '';
  } catch {
    return '';
  }
}

export function getEnglishDayOfWeek(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const day = date.getDay();
    const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysEn[day] || '';
  } catch {
    return '';
  }
}

export interface ParseResult {
  extractedItems: ExamScheduleItem[];
  detectedMemoNo?: string;
  detectedExamName?: string;
  detectedSession?: string;
  detectedPublishDate?: string;
  logs: string[];
  uncertainCount: number;
}

/**
 * Extracts raw text from a PDF file using pdfjs-dist if available in browser
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    // Dynamic import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    // Configure worker
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
    }

    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map((item: any) => item.str || '');
      fullText += pageStrings.join(' ') + '\n';
    }

    if (fullText.trim().length > 20) {
      return fullText;
    }
  } catch (err) {
    console.warn('PDF.js in-browser parse error or scanned page detected:', err);
  }

  // If text was empty or failed (scanned PDF), return message indicating OCR needed or simulated fallback
  return '';
}

/**
 * Robust regex-based routine parser for National University exam circulars
 */
export function parseRoutineText(rawText: string, knownCourses: Course[]): ParseResult {
  const logs: string[] = [];
  const items: ExamScheduleItem[] = [];

  logs.push(`ইনপুট টেক্সট পর্যালোচনা করা হচ্ছে (${rawText.length} অক্ষর)...`);

  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  let detectedMemoNo = '';
  let detectedExamName = '';
  let detectedSession = '';
  let detectedPublishDate = '';

  // Extract metadata from headers
  for (const line of lines) {
    const normLine = banglaToEnglishDigits(line);

    // Look for memo no
    if (/স্মারক|memo|নং|no\./i.test(line) && !detectedMemoNo) {
      const memoMatch = line.match(/(?:স্মারক\s*(?:নং)?[:\s]*|memo\s*(?:no)?[:\s]*)([\w\d\/\.\-]+)/i);
      if (memoMatch) detectedMemoNo = memoMatch[1];
    }

    // Look for exam name
    if (/অনার্স.*পরীক্ষা|honours.*exam/i.test(line) && !detectedExamName) {
      detectedExamName = line.replace(/^(বিজ্ঞপ্তি|নোটিশ|পরীক্ষা|সময়সূচি)[:\s]*/i, '').trim();
    }

    // Look for session
    if (/সেশন|session/i.test(line) || /\b(20\d\d[-–]20\d\d)\b/.test(normLine)) {
      const sMatch = normLine.match(/\b(20\d\d[-–]20\d\d)\b/);
      if (sMatch) detectedSession = sMatch[1];
    }
  }

  // Pattern to find dates: e.g. 16/11/2024, 16-11-2024, ১৬/১১/২০২৪, 16.11.2024
  const dateRegex = /(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/;
  // Pattern to find 6-digit NU course codes
  const courseCodeRegex = /\b(2[1-4]\d{4})\b/g;

  let currentDate = '';
  let currentTime = '০১:০০ PM';

  for (let i = 0; i < lines.length; i++) {
    const originalLine = lines[i];
    const engLine = banglaToEnglishDigits(originalLine);

    // Check if line contains a date
    const dateMatch = engLine.match(dateRegex);
    if (dateMatch) {
      const day = dateMatch[1].padStart(2, '0');
      const month = dateMatch[2].padStart(2, '0');
      const year = dateMatch[3];
      currentDate = `${year}-${month}-${day}`;
      logs.push(`তারিখ শনাক্ত হয়েছে: ${currentDate} (লাইন: "${originalLine.substring(0, 30)}...")`);
    }

    // Check if line specifies time
    if (/০১[:\.]০০|01[:\.]00|দুপুর ১|1[:\.]00\s*pm/i.test(engLine)) {
      currentTime = '০১:০০ PM';
    } else if (/০২[:\.]৩০|02[:\.]30|বেলা ২[:\.]৩০|2[:\.]30\s*pm/i.test(engLine)) {
      currentTime = '০২:৩০ PM';
    } else if (/০৯[:\.]৩০|09[:\.]30|সকাল ৯/i.test(engLine)) {
      currentTime = '০৯:৩০ AM';
    }

    // Extract course codes in this line
    const foundCodes = engLine.match(courseCodeRegex);
    if (foundCodes && foundCodes.length > 0) {
      for (const code of foundCodes) {
        // Find matching course in database
        const matchedCourse = knownCourses.find((c) => c.code === code);

        let titleBn = '';
        let titleEn = '';
        let deptIds: string[] = [];
        let confidence = 95;
        let isFlagged = false;

        if (matchedCourse) {
          titleBn = matchedCourse.nameBn;
          titleEn = matchedCourse.nameEn;
          deptIds = matchedCourse.departmentId === 'all' ? ['all'] : [matchedCourse.departmentId];
          confidence = 100;
        } else {
          // Attempt to extract title after the code
          const afterCode = originalLine.split(code)[1] || '';
          const cleanedTitle = afterCode.replace(/[|:,\-]/g, ' ').trim();
          titleBn = cleanedTitle.length > 3 ? cleanedTitle : `বিষয় কোড ${code}`;
          titleEn = `Course Code ${code}`;
          deptIds = ['dept-acc']; // default fallback
          confidence = 70;
          isFlagged = true; // Needs manual check
          logs.push(`সতর্কতা: কোড ${code} ডাটাবেজে পাওয়া যায়নি। পর্যালোচনার জন্য চিহ্নিত করা হলো।`);
        }

        // Avoid adding duplicate code for the same date
        const existing = items.find((item) => item.courseCode === code && item.date === currentDate);
        if (!existing) {
          const itemDate = currentDate || '2024-11-20';
          items.push({
            id: `extracted-${items.length + 1}-${code}`,
            date: itemDate,
            dayOfWeekBn: getBanglaDayOfWeek(itemDate),
            dayOfWeekEn: getEnglishDayOfWeek(itemDate),
            time: currentTime,
            courseCode: code,
            courseTitleBn: titleBn,
            courseTitleEn: titleEn,
            departmentIds: deptIds,
            duration: '৪ ঘণ্টা',
            confidenceScore: confidence,
            isFlaggedForReview: isFlagged,
          });
        }
      }
    }
  }

  // Sort chronologically
  items.sort((a, b) => a.date.localeCompare(b.date));

  const uncertainCount = items.filter((item) => item.isFlaggedForReview || (item.confidenceScore && item.confidenceScore < 90)).length;

  logs.push(`এক্সট্রাকশন সমাপ্ত: সর্বমোট ${items.length} টি পরীক্ষা সূচি এক্সট্র্যাক্ট করা হয়েছে (${uncertainCount} টি পর্যালোচনার জন্য চিহ্নিত)।`);

  return {
    extractedItems: items,
    detectedMemoNo,
    detectedExamName,
    detectedSession,
    detectedPublishDate,
    logs,
    uncertainCount,
  };
}

/**
 * High quality sample routine text for instant demo / verification testing
 */
export const SAMPLE_NU_ROUTINE_TEXT = `জাতীয় বিশ্ববিদ্যালয়, বাংলাদেশ
গাজীপুর-১৭০৪
পরীক্ষা নিয়ন্ত্রণ বিভাগ

স্মারক নং: ৭২.০১.০০০.৮৮২.২০২৪-০২
তারিখ: ০৪ নভেম্বর ২০২৪

বিজ্ঞপ্তি
২০২৩ সালের অনার্স ১ম বর্ষ পরীক্ষার সংশোধিত সময়সূচি
সংশ্লিষ্ট সকলকে জানানো যাচ্ছে যে, অনিবার্য কারণবশত ২০২৩ সালের অনার্স ১ম বর্ষের পরীক্ষা নিম্নবর্ণিত সংশোধিত তারিখ ও সময় অনুযায়ী অনুষ্ঠিত হবে।

পরীক্ষা আরম্ভের সময়: প্রতিদিন দুপুর ০১:০০ টা
পরীক্ষার সময়কাল: প্রশ্নপত্রে উল্লেখিত সময়কাল (৪ ঘণ্টা)

তারিখ ও বার | বিষয় কোড ও বিষয়ের নাম
১৬/১১/২০২৪ (শনিবার)
২১১৫০১ স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস (সকল বিভাগের শিক্ষার্থীদের জন্য আবশ্যিক)

২১/১১/২০২৪ (বৃহস্পতিবার)
২১২৫০১ হিসাববিজ্ঞান নীতিমালা (হিসাববিজ্ঞান বিভাগ)
২১১১০১ ইংরেজি কবিতা পরিচিতি (ইংরেজি বিভাগ)
২১১০০১ বাংলা সাহিত্যের ইতিহাস-১ (বাংলা বিভাগ)
২১১৯০১ রাজনৈতিক তত্ত্ব পরিচিতি (রাষ্ট্রবিজ্ঞান বিভাগ)

২৫/১১/২০২৪ (সোমবার)
২১২৫০৩ ব্যবসায় পরিচিতি (হিসাববিজ্ঞান ও ব্যবস্থাপনা বিভাগ)
২১১১০৩ ইংরেজি গদ্য পরিচিতি (ইংরেজি বিভাগ)
২১১০০৩ প্রাচীন ও মধ্যযুগের কবিতা (বাংলা বিভাগ)
২১১৯০৩ রাজনৈতিক সংগঠন (যুক্তরাজ্য ও যুক্তরাষ্ট্র)

২৯/১১/২০২৪ (শুক্রবার) - পরীক্ষা আরম্ভ বেলা ০২:৩০ টা
২১২৫০৫ ব্যবসায় অর্থায়ন নীতিমালা (হিসাববিজ্ঞান বিভাগ)
২১১১০৫ ইংরেজি রিডিং অ্যান্ড রাইটিং স্কিলস

০৩/১২/২০২৪ (মঙ্গলবার)
২১২৫০৭ মার্কেটিং নীতিমালা (হিসাববিজ্ঞান বিভাগ)
২১১১০৭ পাশ্চাত্য দর্শন ও সাহিত্য

০৮/১২/২০২৪ (রবিবার)
২১২৫০৯ ব্যষ্টিক অর্থনীতি (হিসাববিজ্ঞান বিভাগ)

পরীক্ষা নিয়ন্ত্রক
জাতীয় বিশ্ববিদ্যালয়, গাজীপুর`;
