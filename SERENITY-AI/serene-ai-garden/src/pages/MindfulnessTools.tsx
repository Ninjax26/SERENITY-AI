import React from 'react';
import Mindfulness from '../components/Mindfulness';
import Navigation from '../components/Navigation';

const MindfulnessTools = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Mindfulness Tools</h1>
      <Mindfulness />
    </div>
  </div>
);

export default MindfulnessTools; 
