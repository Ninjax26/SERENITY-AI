import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from "@/components/ui/button";
import DashboardOverview from '../components/DashboardOverview';
import Navigation from '../components/Navigation';

const WellnessInsights = () => {
  const [user, setUser] = useState<import('@supabase/supabase-js').User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="max-w-3xl mx-auto py-12 px-4 text-center">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="max-w-3xl mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-700 mb-4">You must be signed in to access Wellness Insights.</p>
          <Button onClick={signIn} className="bg-gradient-to-r from-serenity-500 to-calm-500 text-white">Sign In with Google</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <DashboardOverview />
    </div>
  );
};

export default WellnessInsights; 
