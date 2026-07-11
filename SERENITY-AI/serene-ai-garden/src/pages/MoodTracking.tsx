import React from 'react';
import MoodTracker from '../components/MoodTracker';
import Navigation from '../components/Navigation';

const MoodTracking = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <MoodTracker />
  </div>
);

export default MoodTracking; 
