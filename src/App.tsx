import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { HomeView } from './components/home/HomeView';
import { RoutineGeneratorView } from './components/routine/RoutineGeneratorView';
import { DepartmentsView } from './components/departments/DepartmentsView';
import { YearsView } from './components/years/YearsView';
import { NoticesView } from './components/notices/NoticesView';
import { AboutView } from './components/about/AboutView';
import { AdminDashboardView } from './components/admin/AdminDashboardView';
import { PrivacyPolicyView, ContactView } from './components/legal/LegalPages';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="min-h-[calc(100vh-140px)]">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'generate' && <RoutineGeneratorView />}
      {activeTab === 'departments' && <DepartmentsView />}
      {activeTab === 'years' && <YearsView />}
      {(activeTab === 'notices' || activeTab === 'previous') && <NoticesView />}
      {activeTab === 'about' && <AboutView />}
      {activeTab === 'admin' && <AdminDashboardView />}
      {activeTab === 'privacy' && <PrivacyPolicyView />}
      {activeTab === 'contact' && <ContactView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-solaiman">
        <Navbar />
        <MainContent />
        <Footer />
      </div>
    </AppProvider>
  );
}
