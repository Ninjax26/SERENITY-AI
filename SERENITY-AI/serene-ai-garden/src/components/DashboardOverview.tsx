
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Heart, Calendar, Target, Award, Zap, BookOpen } from 'lucide-react';
import { startOfWeek, endOfWeek, isWithinInterval, subWeeks, format, subDays, isSameDay } from 'date-fns';

const DashboardOverview = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [chatSessions, setChatSessions] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (!data.user) setDataLoading(false); // Fix: allow sign-in prompt to show when signed out
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setDataLoading(false); // Fix: allow sign-in prompt to show when signed out
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    setDataLoading(true);
    // Fetch mood entries
    supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data: moods }) => {
        setMoodEntries(moods || []);
      });
    // Fetch journal entries
    supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data: journals }) => {
        setJournalEntries(journals || []);
        setDataLoading(false);
      });
    // Fetch chat sessions (AI conversations)
    supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data: chats }) => {
        setChatSessions(chats || []);
      });
  }, [user]);

  // Helper: get entries in current week
  const getThisWeek = (entries) => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    return entries.filter(e => isWithinInterval(new Date(e.created_at), { start: weekStart, end: weekEnd }));
  };
  // Helper: get entries in last week
  const getLastWeek = (entries) => {
    const now = new Date();
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    return entries.filter(e => isWithinInterval(new Date(e.created_at), { start: lastWeekStart, end: lastWeekEnd }));
  };

  // Calculate stats
  const averageMood = moodEntries.length > 0
    ? (moodEntries.reduce((sum, entry) => sum + (entry.mood || 0), 0) / moodEntries.length).toFixed(1)
    : 'N/A';
  const daysTracked = new Set(moodEntries.map(e => new Date(e.created_at).toDateString())).size;
  const wordsJournaled = journalEntries.reduce((sum, entry) => sum + (entry.word_count || 0), 0);
  // Calculate streak (consecutive days with entries)
  let streak = 0;
  if (moodEntries.length > 0) {
    let prev = new Date(moodEntries[0].created_at);
    streak = 1;
    for (let i = 1; i < moodEntries.length; i++) {
      const curr = new Date(moodEntries[i].created_at);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff <= 1.1 && diff >= 0.9) {
        streak++;
        prev = curr;
      } else {
        break;
      }
    }
  }

  // Weekly Wellness Goals
  const journalThisWeek = getThisWeek(journalEntries).length;
  const moodThisWeek = getThisWeek(moodEntries).length;
  const chatThisWeek = getThisWeek(chatSessions).length;
  // If you track mindfulness, add here
  const mindfulnessThisWeek = 0;
  const wellnessGoals = [
    { name: 'Daily Journaling', progress: Math.min((journalThisWeek/7)*100, 100), target: 7, current: journalThisWeek, icon: BookOpen, color: 'calm' },
    { name: 'Mood Tracking', progress: Math.min((moodThisWeek/7)*100, 100), target: 7, current: moodThisWeek, icon: Heart, color: 'wellness' },
    { name: 'AI Conversations', progress: Math.min((chatThisWeek/5)*100, 100), target: 5, current: chatThisWeek, icon: BarChart3, color: 'serenity' },
    { name: 'Mindfulness', progress: Math.min((mindfulnessThisWeek/10)*100, 100), target: 10, current: mindfulnessThisWeek, icon: Zap, color: 'calm' }
  ];

  // This Week's Insights
  const avgMoodThisWeek = getThisWeek(moodEntries).length > 0 ? (getThisWeek(moodEntries).reduce((sum, e) => sum + (e.mood || 0), 0) / getThisWeek(moodEntries).length) : 0;
  const avgMoodLastWeek = getLastWeek(moodEntries).length > 0 ? (getLastWeek(moodEntries).reduce((sum, e) => sum + (e.mood || 0), 0) / getLastWeek(moodEntries).length) : 0;
  const moodTrend = avgMoodLastWeek === 0 ? 0 : ((avgMoodThisWeek - avgMoodLastWeek) / avgMoodLastWeek) * 100;
  const journalConsistency = `${journalThisWeek}/7 days`;
  const aiConvos = `${chatThisWeek} sessions`;
  const weeklyInsights = [
    {
      title: 'Emotional Trend',
      value: `${moodTrend >= 0 ? '+' : ''}${moodTrend.toFixed(0)}%`,
      description: moodTrend >= 0 ? 'Your mood has improved this week' : 'Your mood has decreased this week',
      color: 'text-wellness-600',
      icon: TrendingUp
    },
    {
      title: 'Journal Consistency',
      value: journalConsistency,
      description: 'Great job staying consistent with journaling',
      color: 'text-calm-600',
      icon: Calendar
    },
    {
      title: 'AI Conversations',
      value: aiConvos,
      description: 'You engaged meaningfully with your AI companion',
      color: 'text-serenity-600',
      icon: Heart
    }
  ];

  // Achievements
  const hasFirstJournal = journalEntries.length > 0;
  const has7DayStreak = streak >= 7;
  const has1000Words = wordsJournaled >= 1000;
  const has30DayStreak = streak >= 30;
  const achievements = [
    { name: 'First Steps', description: 'Completed your first journal entry', earned: hasFirstJournal },
    { name: 'Week Warrior', description: 'Tracked mood for 7 consecutive days', earned: has7DayStreak },
    { name: 'Deep Thinker', description: 'Wrote 1000+ words in journal', earned: has1000Words },
    { name: 'Mindful Month', description: 'Complete 30 days of consistent tracking', earned: has30DayStreak }
  ];

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  if (loading || dataLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-serenity-50 via-white to-calm-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Profile Welcome Section */}
        <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-serenity-100 to-calm-100 rounded-xl shadow animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-serenity-700 mb-1">
              Hi {user?.user_metadata?.full_name || user?.email || 'there'},
            </h2>
            <p className="text-gray-600 text-lg">How are you doing today?</p>
          </div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-serenity-400 to-calm-400 flex items-center justify-center text-3xl">
            <span role="img" aria-label="wave">👋</span>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-serenity-500 to-calm-500 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-serenity-600 to-calm-600 bg-clip-text text-transparent">
              Wellness Dashboard
            </h1>
          </div>
          <p className="text-gray-600">Your personal insights and progress overview</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="wellness-card animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-wellness-500 to-wellness-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-wellness-600 mb-1">{averageMood}</div>
              <p className="text-sm text-gray-600">Average Mood</p>
            </CardContent>
          </Card>

          <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-serenity-500 to-serenity-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-serenity-600 mb-1">{daysTracked}</div>
              <p className="text-sm text-gray-600">Days Tracked</p>
            </CardContent>
          </Card>

          <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-calm-500 to-calm-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-calm-600 mb-1">{wordsJournaled}</div>
              <p className="text-sm text-gray-600">Words Journaled</p>
            </CardContent>
          </Card>

          <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.3s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-serenity-500 to-wellness-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-serenity-600 mb-1">{streak}</div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Goals */}
          <div className="lg:col-span-2">
            <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-serenity-500" />
                  <span>Weekly Wellness Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {wellnessGoals.map((goal, index) => {
                  const Icon = goal.icon;
                  return (
                    <div key={goal.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-${goal.color}-100 rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 text-${goal.color}-600`} />
                          </div>
                          <span className="font-medium text-gray-800">{goal.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {goal.current}/{goal.target}
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Weekly Insights */}
            <Card className="wellness-card mt-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-wellness-500" />
                  <span>This Week's Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {weeklyInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <div key={insight.title} className="text-center">
                        <Icon className={`w-8 h-8 ${insight.color} mx-auto mb-2`} />
                        <div className={`text-xl font-bold ${insight.color} mb-1`}>
                          {insight.value}
                        </div>
                        <h3 className="font-medium text-gray-800 mb-1">{insight.title}</h3>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div className="lg:col-span-1">
            <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.5s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-calm-500" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.name} className={`p-3 rounded-lg border ${achievement.earned ? 'bg-wellness-50 border-wellness-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${achievement.earned ? 'bg-wellness-500' : 'bg-gray-300'}`}>
                        {achievement.earned ? (
                          <span className="text-white text-xs">✓</span>
                        ) : (
                          <span className="text-gray-500 text-xs">•</span>
                        )}
                      </div>
                      <span className={`font-medium ${achievement.earned ? 'text-wellness-700' : 'text-gray-600'}`}>
                        {achievement.name}
                      </span>
                    </div>
                    <p className={`text-sm ${achievement.earned ? 'text-wellness-600' : 'text-gray-500'} ml-8`}>
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Mood Streak Tracker */}
            <Card className="wellness-card mt-6 animate-fade-in" style={{animationDelay: '0.7s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-serenity-500" />
                  <span>Mood Streak Tracker</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {Array.from({ length: 30 }, (_, i) => {
                    const day = subDays(new Date(), 29 - i);
                    const entry = moodEntries.find(e => isSameDay(new Date(e.created_at), day));
                    let color = 'bg-gray-100';
                    let emoji = '';
                    if (entry) {
                      if (entry.mood >= 4) { color = 'bg-green-400'; emoji = '😊'; }
                      else if (entry.mood === 3) { color = 'bg-yellow-300'; emoji = '😐'; }
                      else { color = 'bg-red-300'; emoji = '🙁'; }
                    }
                    return (
                      <div key={i} className={`aspect-square rounded text-xs flex items-center justify-center ${color}`} title={format(day, 'MMM d')}>
                        {entry ? emoji : ''}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{format(subDays(new Date(), 29), 'MMM d')}</span>
                  <span>{format(new Date(), 'MMM d')}</span>
                </div>
                <p className="text-xs text-gray-600 text-center mt-2">
                  Your last 30 days of mood tracking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
