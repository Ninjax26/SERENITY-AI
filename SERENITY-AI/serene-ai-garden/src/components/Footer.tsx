import React from 'react';
import { Heart, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/serenity-logo.png" alt="Serenity AI Logo" className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-serenity-600 to-calm-600 bg-clip-text text-transparent">
                Serenity AI
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Your compassionate AI companion for emotional well-being and mental health support.
            </p>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-wellness-500" />
              <span className="text-sm text-gray-600">Privacy First • Secure • Confidential</span>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/?chat">AI Companion</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/moodtracking">Mood Tracking</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/?smartjournaling">Smart Journaling</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/?wellnessinsights">Wellness Insights</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/mindfulnesstools">Mindfulness Tools</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/helpcenter">Help Center</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/contact">Contact Us</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/privacypolicy">Privacy Policy</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/terms">Terms and Conditions</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/crisis-resources">Crisis Resources</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/about">About Us</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/careers">Careers</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/press">Press</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/blog">Blog</a></li>
              <li className="hover:text-serenity-600 cursor-pointer transition-colors"><a href="/community">Community</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            © 2025 Serenity AI. Made with <Heart className="w-4 h-4 text-red-500 inline mx-1" /> for mental wellness.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-500">
            Remember: You matter, and support is always within reach. Take a moment for yourself today.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
