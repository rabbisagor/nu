# NU Routine Maker — জাতীয় বিশ্ববিদ্যালয় রুটিন মেকার

A production-ready, responsive, bilingual web application designed for students and administrators of the **National University of Bangladesh (NU)**. It supports **Honours 1st Year, 2nd Year, 3rd Year, and 4th Year (Final Year)**.

The system allows administrators to ingest official examination circular PDFs, extract schedule data using PDF.js and OCR algorithms, match 6-digit course codes against a verified curriculum database, review and correct extraction data, and instantly generate **department-wise, beautiful, print-ready routines** downloadable in high-resolution PNG and A4 PDF formats.

---

## 🌟 Key Features

### 1. Bilingual Architecture & SolaimanLipi Font
- **Primary Language:** Bangla (`bn`) — default.
- **Secondary Language:** English (`en`).
- **Typography:** SolaimanLipi loaded via `https://fonts.maateen.me/solaiman-lipi/font.css`, paired with *Plus Jakarta Sans* and *Noto Sans Bengali* fallbacks.
- Flawless Bengali conjunct rendering (যুক্তাক্ষর) in UI, HTML5 Canvas exports, PNG downloads, and generated A4 PDFs.

### 2. Automatic Department-Wise Routine Generator
- Filter out clutter from massive multi-department official circulars.
- Supports all major Honours faculties (Business Studies, Social Science, Arts, Science).
- Chronological sorting with accurate Bangla & English weekdays, exam start times, durations, and special room/prayer time notes.
- Included 5 selectable visual design templates:
  - **Template A (Official Academic):** Classic navy header, university crest, structured borders, and Controller of Examination signature seal.
  - **Template B (Modern Student):** Slate & royal blue styling optimized for screen viewing and mobile sharing.
  - **Template C (Minimal Print):** High-contrast black and white layout engineered for crisp monochrome laser printing.
  - **Template D (Social Media 1:1):** 1080×1080 square format with bold typography for Facebook and Messenger feeds.
  - **Template E (Custom):** Emerald accent with configurable density and optional secondary English titles.

### 3. Core Admin Workflow: PDF Ingestion & OCR
1. **Upload Official Routine PDF:** Ingest official circulars using `pdfjs-dist` or paste raw routine text.
2. **Text & OCR Extraction:** Auto-detect dates (`DD/MM/YYYY` in English and Bangla digits), times, and 6-digit National University course codes.
3. **Editable Review Table:** Uncertain codes or OCR ambiguities are highlighted for human administrator inspection before publication.
4. **Curriculum Matching:** Automatically map extracted papers to the corresponding departmental syllabus.
5. **Revision & Supersede Management:** When an exam is rescheduled, publish a new revision (e.g. Rev-2) and view an automated side-by-side comparison highlighting rescheduled papers.

### 4. Admin Command Center
- **Overview:** Notice counters, verified schedule counts, published routine metrics, and department coverage.
- **Notice Archives:** Track active vs superseded notices.
- **Course & Department Manager:** Add departments, create 6-digit course mappings, and configure syllabus versions.
- **Audit Trail:** Comprehensive audit log recording who published, edited, or superseded circulars.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/nu-routine-maker.git
cd nu-routine-maker

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 📦 Deployment to Vercel and GitHub

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "feat: complete NU Routine Maker application"
git branch -M main
git remote add origin https://github.com/<your-username>/nu-routine-maker.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Sign in to [Vercel](https://vercel.com).
2. Click **"Add New Project"** and import your GitHub repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

### Environment Variables
Configure the following in your Vercel project settings (or `.env` locally):
```env
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
```

---

## 🗄️ Database Schema & Supabase Setup

The application includes complete PostgreSQL migrations located in:
`/supabase/migrations/20261026_init_schema.sql`

To set up your database on Supabase:
1. Create a new project in [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in the Supabase Dashboard.
3. Copy the contents of `/supabase/migrations/20261026_init_schema.sql` and run the script.
4. The script provisions:
   - `departments`
   - `courses`
   - `examination_notices`
   - `exam_schedule_items`
   - `audit_logs`
   - `profiles`
   - Secure Row Level Security (RLS) policies allowing public routine downloads while restricting administrative modifications.

---

## 🔒 Security & Independent Notice Disclaimer

- **Independent Initiative:** This tool is an open student support project and is **not affiliated with or endorsed by National University Bangladesh**.
- **Accuracy First:** All schedules must be verified against official university circulars available at `https://www.nu.ac.bd`.
- **Role-Based Protection:** Administrative routes and publishing actions require authorized administrator credentials.

---

## 📄 License
Released under the Apache-2.0 License.
