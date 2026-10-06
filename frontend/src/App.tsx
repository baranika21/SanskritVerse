// ==============================================================================
// SANSKRITVERSE Root Application Component
// ==============================================================================

import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { LoginPage } from './pages/LoginPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AcharyaAIPage } from './pages/AcharyaAIPage';
import { LessonsPage } from './pages/LessonsPage';
import { AlphabetPage } from './pages/AlphabetPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { GrammarAcademyPage } from './pages/GrammarAcademyPage';
import { PronunciationLabPage } from './pages/PronunciationLabPage';
import { LinguisticsLabPage } from './pages/LinguisticsLabPage';
import { ChhandasPage } from './pages/ChhandasPage';
import { ManuscriptReaderPage } from './pages/ManuscriptReaderPage';
import { SubhashitaPage } from './pages/SubhashitaPage';
import { TranslationLabPage } from './pages/TranslationLabPage';
import { SentenceBuilderPage } from './pages/SentenceBuilderPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingModal } from './pages/OnboardingModal';

export const App: React.FC = () => {
  const { currentView, isAuthenticated, theme } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const renderActiveView = () => {
    // If not authenticated, enforce Login or Landing page
    if (!isAuthenticated && currentView !== 'landing') {
      return <LoginPage />;
    }

    switch (currentView) {
      case 'login':
        return <LoginPage />;
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'acharya':
        return <AcharyaAIPage />;
      case 'lessons':
        return <LessonsPage />;
      case 'alphabet':
        return <AlphabetPage />;
      case 'vocabulary':
        return <VocabularyPage />;
      case 'grammar':
        return <GrammarAcademyPage />;
      case 'pronunciation':
        return <PronunciationLabPage />;
      case 'linguistics':
        return <LinguisticsLabPage />;
      case 'chhandas':
        return <ChhandasPage />;
      case 'manuscripts':
        return <ManuscriptReaderPage />;
      case 'subhashitas':
        return <SubhashitaPage />;
      case 'translation':
        return <TranslationLabPage />;
      case 'builder':
        return <SentenceBuilderPage />;
      case 'practice':
        return <QuizzesPage />;
      case 'achievements':
        return <LeaderboardPage />;
      case 'progress':
        return <ProgressAnalyticsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return isAuthenticated ? <DashboardPage /> : <LoginPage />;
    }
  };

  const showSidebar = isAuthenticated && currentView !== 'landing' && currentView !== 'login';

  return (
    <div className="min-h-screen bg-[#070A12] text-[#F8FAFC] flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Navigation Header */}
      <Navbar />

      {/* Main App Container */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Content Area */}
        <main className={`flex-1 ${currentView === 'login' ? 'p-0 max-w-full' : 'p-4 sm:p-6 lg:p-8 max-w-7xl'} mx-auto w-full overflow-x-hidden`}>
          {renderActiveView()}
        </main>
      </div>

      {/* Footer */}
      {currentView !== 'login' && <Footer />}

      {/* Onboarding Dialog */}
      <OnboardingModal />
    </div>
  );
};

export default App;
