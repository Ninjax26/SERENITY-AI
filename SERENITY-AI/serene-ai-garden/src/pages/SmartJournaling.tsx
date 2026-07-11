import React from 'react';
import Navigation from '../components/Navigation';
import JournalInterface from '../components/JournalInterface';

const SmartJournaling = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <JournalInterface />
  </div>
);

export default SmartJournaling; 
