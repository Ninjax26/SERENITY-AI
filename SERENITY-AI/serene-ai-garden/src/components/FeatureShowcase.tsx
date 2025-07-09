import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Calendar, BookOpen, Brain } from 'lucide-react';

interface FeatureShowcaseProps {
  onFeatureClick: (featureId: string) => void;
}

const FeatureShowcase = ({ onFeatureClick }: FeatureShowcaseProps) => {
  const features = [
    {
      id: 'chat',
      title: 'AI Companion',
      description: 'Chat with your empathetic AI companion for emotional support and guidance.',
      icon: MessageCircle,
      gradient: 'from-serenity-400 to-serenity-600',
      hoverGradient: 'hover:from-serenity-500 hover:to-serenity-700'
    },
    {
      id: 'mood',
      title: 'Mood Tracker',
      description: 'Track your daily emotions and discover patterns in your mental well-being.',
      icon: Calendar,
      gradient: 'from-wellness-400 to-wellness-600',
      hoverGradient: 'hover:from-wellness-500 hover:to-wellness-700'
    },
    {
      id: 'journal',
      title: 'Smart Journal',
      description: 'Write thoughtful entries with AI-powered insights and reflection prompts.',
      icon: BookOpen,
      gradient: 'from-calm-400 to-calm-600',
      hoverGradient: 'hover:from-calm-500 hover:to-calm-700'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness Tools',
      description: 'Access breathing exercises, guided meditations, and relaxation techniques.',
      icon: Brain,
      gradient: 'from-serenity-400 to-calm-500',
      hoverGradient: 'hover:from-serenity-500 hover:to-calm-600'
    }
  ];

  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Explore Serenity AI Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.id} className="wellness-card gentle-hover">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl font-semibold">{feature.title}</span>
                    <Icon className="w-6 h-6 text-gray-700" />
                  </CardTitle>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full bg-gradient-to-br ${feature.gradient} ${feature.hoverGradient} text-white shadow-md`}
                    onClick={() => onFeatureClick(feature.id)}
                  >
                    Explore {feature.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
