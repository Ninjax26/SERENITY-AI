
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Heart, Shield, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden py-20 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-serenity-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-calm-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-wellness-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Badge */}
        <Badge variant="secondary" className="mb-6 bg-gradient-to-r from-serenity-100 to-calm-100 text-serenity-700 border-serenity-200 animate-pulse-gentle">
          <Sparkles className="w-4 h-4 mr-2" />
          Your compassionate AI companion for emotional well-being
        </Badge>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-serenity-600 via-calm-600 to-wellness-600 bg-clip-text text-transparent animate-fade-in">
          Find Your Inner
          <br />
          <span className="relative">
            Serenity
            <div className="absolute -inset-1 bg-gradient-to-r from-serenity-500/20 to-calm-500/20 blur-xl rounded-lg"></div>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
          Discover emotional balance through AI-powered conversations, mindful journaling, 
          and personalized wellness insights designed for your mental health journey.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
            <Heart className="w-5 h-5 text-serenity-500" />
            <span className="text-gray-700 font-medium">Empathetic AI</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
            <Shield className="w-5 h-5 text-wellness-500" />
            <span className="text-gray-700 font-medium">Privacy First</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/50">
            <Zap className="w-5 h-5 text-calm-500" />
            <span className="text-gray-700 font-medium">Instant Insights</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{animationDelay: '0.6s'}}>
          <Button 
            onClick={onGetStarted}
            size="lg" 
            className="group bg-gradient-to-r from-serenity-500 to-calm-500 hover:from-serenity-600 hover:to-calm-600 text-white px-8 py-6 text-lg font-semibold shadow-xl serenity-glow gentle-hover"
          >
            Start Your Journey
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="px-8 py-6 text-lg font-semibold border-2 border-serenity-200 text-serenity-700 hover:bg-serenity-50 gentle-hover"
          >
            Watch Demo
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-16 animate-fade-in" style={{animationDelay: '0.8s'}}>
          <p className="text-gray-500 mb-4">Trusted by thousands on their wellness journey</p>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-2xl font-bold text-serenity-400">10k+</div>
            <div className="text-sm text-gray-400">Happy Users</div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-2xl font-bold text-wellness-400">50k+</div>
            <div className="text-sm text-gray-400">Journal Entries</div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-2xl font-bold text-calm-400">98%</div>
            <div className="text-sm text-gray-400">Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
