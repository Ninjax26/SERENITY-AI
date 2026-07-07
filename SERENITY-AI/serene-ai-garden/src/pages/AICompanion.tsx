import React from 'react';
import Navigation from '../components/Navigation';
import ChatInterface from '../components/ChatInterface';

const AICompanion = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Navigation />
    <ChatInterface />
  </div>
);

export default AICompanion; 
