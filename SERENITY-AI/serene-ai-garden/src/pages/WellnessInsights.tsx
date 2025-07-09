import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from "@/components/ui/button";

const WellnessInsights = () => {
  const [user, setUser] = useState<any>(null);
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
    return <div className="max-w-3xl mx-auto py-12 px-4 text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-gray-700 mb-4">You must be signed in to access Wellness Insights.</p>
        <Button onClick={signIn} className="bg-gradient-to-r from-serenity-500 to-calm-500 text-white">Sign In with Google</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Wellness Insights</h1>
      <p className="text-gray-700 mb-2">Get personalized insights to improve your well-being.</p>
      <p className="text-gray-600">This is a placeholder Wellness Insights page. Insights coming soon.</p>
    </div>
  );
};

export default WellnessInsights; 