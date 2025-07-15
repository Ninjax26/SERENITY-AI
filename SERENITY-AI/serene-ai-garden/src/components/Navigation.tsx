import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Calendar, BookOpen, BarChart3, Menu, X, Sparkles, Brain, Moon, Sun } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useTheme } from "@/hooks/use-theme";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ user_metadata?: { avatar_url?: string }; email?: string } | null>(null);
  const [theme, setTheme] = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Heart },
    { id: 'chat', label: 'AI Companion', icon: MessageCircle },
    { id: 'mood', label: 'Mood Tracker', icon: Calendar },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'mindfulness', label: 'Mindfulness', icon: Brain },
    { id: 'dashboard', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white/90 dark:bg-gray-900 backdrop-blur-md border-b border-white/50 dark:border-gray-800 sticky top-0 z-50">
      <div>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => onViewChange('home')}>
            <img src="/serenity-logo.png" alt="Serenity AI Logo" className="w-8 h-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-serenity-600 to-calm-600 bg-clip-text text-transparent">
              Serenity AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 min-w-0 overflow-hidden justify-center mx-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    currentView === item.id 
                      ? 'bg-serenity-500 text-white shadow-lg' 
                      : 'hover:bg-serenity-50 text-serenity-700 dark:hover:bg-serenity-900 dark:text-serenity-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate hidden xl:inline max-w-[110px]">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-serenity-100 dark:hover:bg-serenity-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 flex-shrink-0 ml-2">
            {!user ? (
              <Button
                variant="ghost"
                className="text-serenity-700 hover:bg-serenity-50"
                onClick={signIn}
              >
                Sign In
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-serenity-300"
                  />
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-serenity-100 text-serenity-700 font-bold">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                )}
                <span className="text-sm text-serenity-700 font-medium truncate max-w-[100px] hidden lg:inline">{user.email}</span>
                <Button
                  variant="outline"
                  className="border-serenity-300 text-serenity-700 hover:bg-serenity-50"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            )}
            <Button className="bg-gradient-to-r from-serenity-500 to-calm-500 hover:from-serenity-600 hover:to-calm-600 text-white shadow-lg">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start space-x-2 ${
                    currentView === item.id 
                      ? 'bg-serenity-500 text-white' 
                      : 'hover:bg-serenity-50 text-serenity-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            <div className="pt-4 space-y-2">
              {!user ? (
                <Button variant="ghost" className="w-full" onClick={signIn}>Sign In</Button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-serenity-300"
                      />
                    ) : (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-serenity-100 text-serenity-700 font-bold">
                        {user.email?.[0]?.toUpperCase()}
                      </span>
                    )}
                    <span className="text-sm text-serenity-700 font-medium truncate">{user.email}</span>
                  </div>
                  <Button variant="outline" className="w-full border-serenity-300 text-serenity-700 hover:bg-serenity-50" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              )}
              <Button className="w-full bg-gradient-to-r from-serenity-500 to-calm-500 text-white">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
