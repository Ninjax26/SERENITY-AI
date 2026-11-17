import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ChatInterface from '@/components/ChatInterface';
import MoodTracker from '@/components/MoodTracker';
import JournalInterface from '@/components/JournalInterface';
import DashboardOverview from '@/components/DashboardOverview';
import FeatureShowcase from '@/components/FeatureShowcase';
import Footer from '@/components/Footer';
import MindfulnessInterface from '@/components/Mindfulness';

const Index = () => {
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    // Deep-linkable home views (?chat, ?mood, ...) survive refreshes and the
    // OAuth redirect back to "/", so a chosen destination is not lost.
    if (window.location.search.includes('chat')) {
      setCurrentView('chat');
    } else if (window.location.search.includes('smartjournaling')) {
      setCurrentView('journal');
    } else if (window.location.search.includes('wellnessinsights')) {
      setCurrentView('dashboard');
    } else if (window.location.search.includes('mood')) {
      setCurrentView('mood');
    } else if (window.location.search.includes('mindfulness')) {
      setCurrentView('mindfulness');
    } else {
      // A view chosen before signing in resumes after the OAuth redirect.
      const returnView = sessionStorage.getItem('serenity:returnView');
      if (returnView) {
        sessionStorage.removeItem('serenity:returnView');
        setCurrentView(returnView);
      }
    }
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface />;
      case 'mood':
        return <MoodTracker />;
      case 'journal':
        return <JournalInterface />;
      case 'dashboard':
        return <DashboardOverview />;
      case 'mindfulness':
        return <MindfulnessInterface />;
      default:
        return (
          <>
            <HeroSection
              onCheckIn={() => setCurrentView('mood')}
              onBreathingExercise={() => setCurrentView('mindfulness')}
            />
            <FeatureShowcase onFeatureClick={setCurrentView} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="animate-fade-in">
        {renderCurrentView()}
      </main>

      {currentView === 'home' && <Footer />}
    </div>
  );
};

export default Index;
