import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Calendar, BookOpen, BarChart3, Menu, X, Brain, Moon, Sun, Users, ChevronDown, LogOut } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { useTheme } from "@/hooks/use-theme";
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface NavigationProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ user_metadata?: { avatar_url?: string; full_name?: string; name?: string }; email?: string } | null>(null);
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

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
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) toast({ title: "Sign-in failed", description: error.message, variant: "destructive" });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) toast({ title: "Sign-out failed", description: error.message, variant: "destructive" });
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Heart, path: '/' },
    { id: 'chat', label: 'AI Companion', icon: MessageCircle, path: '/aicompanion' },
    { id: 'mood', label: 'Mood Tracker', icon: Calendar, path: '/moodtracking' },
    { id: 'journal', label: 'Journal', icon: BookOpen, path: '/smartjournaling' },
    { id: 'mindfulness', label: 'Mindfulness', icon: Brain, path: '/mindfulnesstools' },
    { id: 'dashboard', label: 'Insights', icon: BarChart3, path: '/wellnessinsights' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
  ];

  const handleNavClick = (item: { id: string; label: string; icon: React.ComponentType; path: string }) => {
    if (onViewChange && item.id !== 'community') {
      // Use custom view state if provided (for Index page)
      onViewChange(item.id);
    } else {
      // Use React Router navigation
      navigate(item.path);
    }
  };

  const handleGetStarted = () => {
    if (onViewChange) onViewChange('chat');
    else navigate('/aicompanion');
  };

  const isActive = (item: { id: string; path: string }) => {
    if (onViewChange && currentView) {
      return currentView === item.id;
    }
    return location.pathname === item.path;
  };

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Account';

  const accountAvatar = (sizeClass = 'h-8 w-8') => user?.user_metadata?.avatar_url ? (
    <img
      src={user.user_metadata.avatar_url}
      alt=""
      className={`${sizeClass} rounded-full border border-serenity-300 object-cover`}
    />
  ) : (
    <span className={`inline-flex ${sizeClass} items-center justify-center rounded-full bg-serenity-100 text-sm font-bold text-serenity-700`}>
      {user?.email?.[0]?.toUpperCase() || 'U'}
    </span>
  );

  return (
    <nav className="bg-white/90 dark:bg-gray-900 backdrop-blur-md border-b border-white/50 dark:border-gray-800 sticky top-0 z-50">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 min-w-0 items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => handleNavClick(navItems[0])}>
            <img src="/serenity-logo.png" alt="Serenity AI Logo" className="w-8 h-8" />
            <span className="whitespace-nowrap text-lg font-bold bg-gradient-to-r from-serenity-600 to-calm-600 bg-clip-text text-transparent sm:text-xl lg:hidden 2xl:inline">
              Serenity AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 min-w-0 justify-center mx-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={isActive(item) ? "default" : "ghost"}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center gap-1.5 px-2 text-sm transition-all duration-200 xl:px-3 ${
                    isActive(item)
                      ? 'bg-serenity-500 text-white shadow-lg'
                      : 'hover:bg-serenity-50 text-serenity-700 dark:hover:bg-serenity-900 dark:text-serenity-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Dark Mode Toggle */}
          <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0 md:gap-2">
            <button
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-serenity-100 dark:hover:bg-serenity-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="ml-1 hidden shrink-0 items-center gap-2 md:flex">
            {!user ? (
              <>
                <Button
                  variant="ghost"
                  className="text-serenity-700 hover:bg-serenity-50"
                  onClick={signIn}
                >
                  Sign In
                </Button>
                <Button onClick={handleGetStarted} className="rounded-full bg-emerald-700 text-white shadow-sm hover:bg-emerald-800">
                  Get Started
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open account menu"
                    className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 pr-2 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                  >
                    {accountAvatar()}
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl p-2">
                  <DropdownMenuLabel className="py-2">
                    <span className="block truncate text-sm font-semibold">{displayName}</span>
                    <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">{user.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer rounded-lg py-2 text-rose-600 focus:text-rose-700">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="shrink-0 md:hidden">
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
                  variant={isActive(item) ? "default" : "ghost"}
                  onClick={() => {
                    handleNavClick(item);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full justify-start space-x-2 ${
                    isActive(item)
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
                    {accountAvatar()}
                    <span className="text-sm text-serenity-700 font-medium truncate">{user.email}</span>
                  </div>
                  <Button variant="outline" className="w-full border-serenity-300 text-serenity-700 hover:bg-serenity-50" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              )}
              {!user && (
                <Button onClick={handleGetStarted} className="w-full bg-emerald-700 text-white hover:bg-emerald-800">
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
