import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar, BookOpen, Brain, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    if (window.location.search.includes('chat')) {
      setCurrentView('chat');
    } else if (window.location.search.includes('smartjournaling')) {
      setCurrentView('journal');
    } else if (window.location.search.includes('wellnessinsights')) {
      setCurrentView('dashboard');
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
            <HeroSection onGetStarted={() => setCurrentView('chat')} />
            <FeatureShowcase onFeatureClick={setCurrentView} />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen wellness-gradient">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="animate-fade-in">
        {renderCurrentView()}
      </main>

      {currentView === 'home' && <Footer />}
    </div>
  );
};

export default Index;
