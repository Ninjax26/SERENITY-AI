import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, Heart, Brain, BookOpen, MessageCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const DashboardOverview = () => {
  const [moodEntries, setMoodEntries] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [moodData, journalData, chatData] = await Promise.all([
        supabase.from('mood_entries').select('*').eq('user_id', user.id),
        supabase.from('journal_entries').select('*').eq('user_id', user.id),
        supabase.from('chat_messages').select('*').eq('user_id', user.id)
      ]);

      setMoodEntries(moodData.data || []);
      setJournalEntries(journalData.data || []);
      setChatCount(chatData.data?.length || 0);
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const averageMood = moodEntries.length > 0
    ? (moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length).toFixed(1)
    : '0.0';

  const goodDays = moodEntries.filter(e => e.mood >= 4).length;
  const totalWords = journalEntries.reduce((sum, entry) => sum + (entry.word_count || 0), 0);

  if (loading) {
    return <div className="text-center py-12">Loading your wellness insights...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Wellness Journey</h2>
        <p className="text-gray-600">Track your progress and insights over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-serenity-50 to-serenity-100 dark:from-serenity-900/20 dark:to-serenity-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-serenity-700 dark:text-serenity-300 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-serenity-600 dark:text-serenity-400">{averageMood}/5</div>
            <p className="text-xs text-serenity-600/60 dark:text-serenity-400/60 mt-1">Based on {moodEntries.length} entries</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-calm-50 to-calm-100 dark:from-calm-900/20 dark:to-calm-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-calm-700 dark:text-calm-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Good Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-calm-600 dark:text-calm-400">{goodDays}</div>
            <p className="text-xs text-calm-600/60 dark:text-calm-400/60 mt-1">Days with mood ≥ 4</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-wellness-50 to-wellness-100 dark:from-wellness-900/20 dark:to-wellness-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-wellness-700 dark:text-wellness-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-wellness-600 dark:text-wellness-400">{journalEntries.length}</div>
            <p className="text-xs text-wellness-600/60 dark:text-wellness-400/60 mt-1">{totalWords} words written</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              AI Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{chatCount}</div>
            <p className="text-xs text-blue-600/60 dark:text-blue-400/60 mt-1">Messages exchanged</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Mood Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Start tracking your mood to see trends</p>
            ) : (
              <div className="space-y-3">
                {moodEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.emoji}</span>
                      <div>
                        <p className="font-medium text-sm">{entry.note || "No note"}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-serenity-600">{entry.mood}/5</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Recent Journal Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {journalEntries.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Start journaling to see your entries here</p>
            ) : (
              <div className="space-y-3">
                {journalEntries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{entry.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {entry.content?.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(entry.created_at).toLocaleDateString()} • {entry.word_count} words
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-serenity-500/10 to-calm-500/10 dark:from-serenity-500/20 dark:to-calm-500/20">
        <CardHeader>
          <CardTitle className="text-serenity-700 dark:text-serenity-300">Wellness Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• Try to maintain a consistent sleep schedule for better mood stability</li>
            <li>• Regular journaling can help process emotions and reduce stress</li>
            <li>• Taking breaks for mindfulness exercises can improve focus</li>
            <li>• Talking to your AI companion about your feelings can provide perspective</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
