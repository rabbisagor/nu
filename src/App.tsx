import React from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { SimpleRoutineUploader } from './components/routine/SimpleRoutineUploader';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-solaiman">
        <Navbar />
        <main className="flex-1">
          <SimpleRoutineUploader />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}
