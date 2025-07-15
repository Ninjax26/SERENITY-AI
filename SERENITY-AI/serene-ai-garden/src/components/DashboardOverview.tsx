
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Heart, Calendar, Target, Award, Zap, BookOpen } from 'lucide-react';

const DashboardOverview = () => {
  const wellnessGoals = [
    { name: 'Daily Journaling', progress: 85, target: 7, current: 6, icon: BookOpen, color: 'calm' },
    { name: 'Mood Tracking', progress: 100, target: 7, current: 7, icon: Heart, color: 'wellness' },
    { name: 'AI Conversations', progress: 60, target: 5, current: 3, icon: BarChart3, color: 'serenity' },
    { name: 'Mindfulness', progress: 40, target: 10, current: 4, icon: Zap, color: 'calm' }
  ];

  const weeklyInsights = [
    {
      title: 'Emotional Trend',
      value: '+12%',
      description: 'Your mood has improved significantly this week',
      color: 'text-wellness-600',
      icon: TrendingUp
    },
    {
      title: 'Journal Consistency',
      value: '6/7 days',
      description: 'Great job staying consistent with journaling',
      color: 'text-calm-600',
      icon: Calendar
    },
    {
      title: 'AI Conversations',
      value: '8 sessions',
      description: 'You engaged meaningfully with your AI companion',
      color: 'text-serenity-600',
      icon: Heart
    }
  ];

  const achievements = [
    { name: 'First Steps', description: 'Completed your first journal entry', earned: true },
    { name: 'Week Warrior', description: 'Tracked mood for 7 consecutive days', earned: true },
    { name: 'Deep Thinker', description: 'Wrote 1000+ words in journal', earned: false },
    { name: 'Mindful Month', description: 'Complete 30 days of consistent tracking', earned: false }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-7xl mx-auto">
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
          <Card className="wellness-card bg-card text-card-foreground animate-fade-in">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-wellness-500 to-wellness-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-wellness-600 mb-1">4.2</div>
              <p className="text-sm text-gray-600">Average Mood</p>
            </CardContent>
          </Card>

          <Card className="wellness-card bg-card text-card-foreground animate-fade-in" style={{animationDelay: '0.1s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-serenity-500 to-serenity-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-serenity-600 mb-1">12</div>
              <p className="text-sm text-gray-600">Days Tracked</p>
            </CardContent>
          </Card>

          <Card className="wellness-card bg-card text-card-foreground animate-fade-in" style={{animationDelay: '0.2s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-calm-500 to-calm-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-calm-600 mb-1">847</div>
              <p className="text-sm text-gray-600">Words Journaled</p>
            </CardContent>
          </Card>

          <Card className="wellness-card bg-card text-card-foreground animate-fade-in" style={{animationDelay: '0.3s'}}>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-serenity-500 to-wellness-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-serenity-600 mb-1">7</div>
              <p className="text-sm text-gray-600">Day Streak</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Weekly Goals */}
          <div className="lg:col-span-2">
            <Card className="wellness-card bg-card text-card-foreground animate-fade-in" style={{animationDelay: '0.4s'}}>
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
            <Card className="wellness-card bg-card text-card-foreground animate-fade-in" style={{animationDelay: '0.5s'}}>
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

            {/* Mood Calendar Preview */}
            <Card className="wellness-card mt-6 animate-fade-in" style={{animationDelay: '0.7s'}}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-serenity-500" />
                  <span>Mood Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-gray-500 p-1">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 14 }, (_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded text-xs flex items-center justify-center">
                      {i < 7 ? ['😊', '😐', '😄', '😊', '😐', '😔', '😊'][i] : (i + 1)}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 text-center">
                  Your emotional journey visualized
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
