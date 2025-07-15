
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, TrendingUp, Smile, Frown, Meh, Heart, Zap } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useToast } from "@/hooks/use-toast";

interface MoodEntry {
  id: string;
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, TrendingUp, Smile, Frown, Meh, Heart, Zap } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: number;
  emoji: string;
  note: string;
  date: Date;
  factors: string[];
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    {
      id: '1',
      mood: 4,
      emoji: '😊',
      note: 'Had a great morning walk and productive work session',
      date: new Date(Date.now() - 86400000),
      factors: ['Exercise', 'Work']
    },
    {
      id: '2',
      mood: 3,
      emoji: '😐',
      note: 'Average day, feeling neutral',
      date: new Date(Date.now() - 172800000),
      factors: ['Sleep']
    }
  ]);

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
    { value: 2, emoji: '🙁', label: 'Sad', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Great', color: 'text-emerald-500' }
  ];

  const moodFactors = [
    'Sleep', 'Exercise', 'Work', 'Social', 'Weather', 'Health', 'Family', 'Stress'
  ];

  const handleMoodSubmit = () => {
    if (selectedMood === null) return;

    const selectedMoodOption = moodOptions.find(m => m.value === selectedMood);
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood,
      emoji: selectedMoodOption!.emoji,
      note: moodNote,
      date: new Date(),
      factors: selectedFactors
    };

    setMoodEntries([newEntry, ...moodEntries]);
    setSelectedMood(null);
    setMoodNote('');
    setSelectedFactors([]);
  };

  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 0;

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-wellness-500 to-serenity-500 rounded-full flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-wellness-600 to-serenity-600 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
          </div>
          <p className="text-gray-600">Track your emotional journey and discover patterns</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Input */}
          <div className="lg:col-span-1">
            <Card className="wellness-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-wellness-500" />
                  <span>How are you feeling today?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Selection */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Select your mood:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {moodOptions.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={selectedMood === mood.value ? "default" : "outline"}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`justify-start h-12 text-left ${
                          selectedMood === mood.value 
                            ? 'bg-wellness-500 text-white' 
                            : 'hover:bg-wellness-50 border-wellness-200'
                        }`}
                      >
                        <span className="text-2xl mr-3">{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Factors */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">What influenced your mood?:</p>
                  <div className="flex flex-wrap gap-2">
                    {moodFactors.map((factor) => (
                      <Badge
                        key={factor}
                        variant={selectedFactors.includes(factor) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedFactors.includes(factor)
                            ? 'bg-serenity-500 text-white'
                            : 'hover:bg-serenity-50 border-serenity-200 text-serenity-700'
                        }`}
                        onClick={() => toggleFactor(factor)}
                      >
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Add a note (optional):</p>
                  <Textarea
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="What happened today? How are you feeling?"
                    className="border-wellness-200 focus:border-wellness-400 focus:ring-wellness-400"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleMoodSubmit}
                  disabled={selectedMood === null}
                  className="w-full bg-gradient-to-r from-wellness-500 to-serenity-500 hover:from-wellness-600 hover:to-serenity-600 text-white"
                >
                  Log Mood Entry
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mood History & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics */}
            <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-serenity-500" />
                  <span>Your Mood Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-wellness-600 mb-1">
                      {averageMood.toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-600">Average Mood</p>
                    <div className="text-2xl mt-2">
                      {averageMood >= 4 ? '😊' : averageMood >= 3 ? '😐' : '🙁'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-serenity-600 mb-1">
                      {moodEntries.length}
                    </div>
                    <p className="text-sm text-gray-600">Days Tracked</p>
                    <div className="text-2xl mt-2">📅</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-calm-600 mb-1">
                      {moodEntries.filter(e => e.mood >= 4).length}
                    </div>
                    <p className="text-sm text-gray-600">Good Days</p>
                    <div className="text-2xl mt-2">✨</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-calm-500" />
                  <span>Recent Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {moodEntries.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{entry.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">
                              {moodOptions.find(m => m.value === entry.mood)?.label}
                            </span>
                            <span className="text-sm text-gray-500">
                              {entry.date.toLocaleDateString()}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-gray-600 text-sm mb-2">{entry.note}</p>
                          )}
                          {entry.factors.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {entry.factors.map((factor) => (
                                <Badge key={factor} variant="secondary" className="text-xs">
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;

  mood: number;
  emoji: string;
  note: string;
  date: Date;
  factors: string[];
}

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Fetch user and mood entries from Supabase
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (data.user) {
        fetchMoodEntries(data.user.id);
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMoodEntries(session.user.id);
      } else {
        setMoodEntries([]);
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const fetchMoodEntries = async (userId: string) => {
    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setMoodEntries(data.map((row: any) => ({
        id: row.id,
        mood: row.mood,
        emoji: row.emoji,
        note: row.note,
        date: new Date(row.created_at),
        factors: row.factors || [],
      })));
    } else {
      setMoodEntries([]);
    }
  };

  const moodOptions = [
    { value: 1, emoji: '😢', label: 'Very Sad', color: 'text-red-500' },
    { value: 2, emoji: '🙁', label: 'Sad', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Great', color: 'text-emerald-500' }
  ];

  const moodFactors = [
    'Sleep', 'Exercise', 'Work', 'Social', 'Weather', 'Health', 'Family', 'Stress'
  ];

  const handleMoodSubmit = async () => {
    if (selectedMood === null || !user) return;
    setSubmitting(true);
    const selectedMoodOption = moodOptions.find(m => m.value === selectedMood);
    const newEntry = {
      user_id: user.id,
      mood: selectedMood,
      emoji: selectedMoodOption!.emoji,
      note: moodNote,
      factors: selectedFactors,
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('mood_entries').insert(newEntry);
    setSubmitting(false);
    if (!error) {
      fetchMoodEntries(user.id);
      toast({ title: "Mood entry saved!", description: "Your mood has been logged." });
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setSelectedMood(null);
    setMoodNote('');
    setSelectedFactors([]);
  };

  const handleClearAll = async () => {
    if (!user) return;
    await supabase.from('mood_entries').delete().eq('user_id', user.id);
    setMoodEntries([]);
  };

  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 0;

  const toggleFactor = (factor: string) => {
    setSelectedFactors(prev => 
      prev.includes(factor) 
        ? prev.filter(f => f !== factor)
        : [...prev, factor]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wellness-50 via-white to-serenity-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-wellness-500 to-serenity-500 rounded-full flex items-center justify-center">
              <Smile className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-wellness-600 to-serenity-600 bg-clip-text text-transparent">
              Mood Tracker
            </h1>
          </div>
          <p className="text-gray-600">Track your emotional journey and discover patterns</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mood Input */}
          <div className="lg:col-span-1">
            <Card className="wellness-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-wellness-500" />
                  <span>How are you feeling today?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Selection */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Select your mood:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {moodOptions.map((mood) => (
                      <Button
                        key={mood.value}
                        variant={selectedMood === mood.value ? "default" : "outline"}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`justify-start h-12 text-left ${
                          selectedMood === mood.value 
                            ? 'bg-wellness-500 text-white' 
                            : 'hover:bg-wellness-50 border-wellness-200'
                        }`}
                      >
                        <span className="text-2xl mr-3">{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Factors */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">What influenced your mood?:</p>
                  <div className="flex flex-wrap gap-2">
                    {moodFactors.map((factor) => (
                      <Badge
                        key={factor}
                        variant={selectedFactors.includes(factor) ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedFactors.includes(factor)
                            ? 'bg-serenity-500 text-white'
                            : 'hover:bg-serenity-50 border-serenity-200 text-serenity-700'
                        }`}
                        onClick={() => toggleFactor(factor)}
                      >
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Add a note (optional):</p>
                  <Textarea
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="What happened today? How are you feeling?"
                    className="border-wellness-200 focus:border-wellness-400 focus:ring-wellness-400"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleMoodSubmit}
                  disabled={selectedMood === null || loading || submitting}
                  className="w-full bg-gradient-to-r from-wellness-500 to-serenity-500 hover:from-wellness-600 hover:to-serenity-600 text-white"
                >
                  {submitting ? "Saving..." : "Log Mood Entry"}
                </Button>
                <Button
                  onClick={handleClearAll}
                  className="w-full bg-red-500 hover:bg-red-600 text-white mt-2"
                  disabled={loading || !user}
                >
                  Clear All Mood Entries
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mood History & Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Analytics */}
            <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-serenity-500" />
                  <span>Your Mood Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-wellness-600 mb-1">
                      {averageMood.toFixed(1)}
                    </div>
                    <p className="text-sm text-gray-600">Average Mood</p>
                    <div className="text-2xl mt-2">
                      {averageMood >= 4 ? '😊' : averageMood >= 3 ? '😐' : '🙁'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-serenity-600 mb-1">
                      {moodEntries.length}
                    </div>
                    <p className="text-sm text-gray-600">Days Tracked</p>
                    <div className="text-2xl mt-2">📅</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-calm-600 mb-1">
                      {moodEntries.filter(e => e.mood >= 4).length}
                    </div>
                    <p className="text-sm text-gray-600">Good Days</p>
                    <div className="text-2xl mt-2">✨</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="wellness-card animate-fade-in" style={{animationDelay: '0.4s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-calm-500" />
                  <span>Recent Entries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {moodEntries.map((entry) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="text-3xl">{entry.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">
                              {moodOptions.find(m => m.value === entry.mood)?.label}
                            </span>
                            <span className="text-sm text-gray-500">
                              {entry.date.toLocaleDateString()}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="text-gray-600 text-sm mb-2">{entry.note}</p>
                          )}
                          {entry.factors.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {entry.factors.map((factor) => (
                                <Badge key={factor} variant="secondary" className="text-xs">
                                  {factor}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
