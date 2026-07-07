import React from 'react';
import Navigation from '../components/Navigation';
import JournalInterface from '../components/JournalInterface';

const SmartJournaling = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Smart Journaling</h1>
      <JournalInterface />
    </div>
  </div>
);

export default SmartJournaling; 
