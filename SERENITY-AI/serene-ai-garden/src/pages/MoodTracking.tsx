import React from 'react';
import MoodTracker from '../components/MoodTracker';
import Navigation from '../components/Navigation';

const MoodTracking = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Mood Tracking</h1>
      <MoodTracker />
    </div>
  </div>
);

export default MoodTracking; 
