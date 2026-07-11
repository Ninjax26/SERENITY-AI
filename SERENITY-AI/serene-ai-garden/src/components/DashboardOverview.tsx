import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, BookOpen, Brain, CalendarDays, Heart, MessageCircle, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Button } from "@/components/ui/button";

interface MoodRow {
  id: string;
  mood: number;
  emoji: string;
  note: string | null;
  factors: string[] | null;
  created_at: string;
}

interface JournalRow {
  id: string;
  title: string;
  content: string;
  word_count: number | null;
  sentiment: string | null;
  created_at: string;
}

type Range = 7 | 30 | "all";

const DashboardOverview = () => {
  const [moodEntries, setMoodEntries] = useState<MoodRow[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalRow[]>([]);
  const [chatCount, setChatCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<Range>(30);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!mounted) return;
      if (userError || !user) {
        setError("Sign in to view your wellness insights.");
        setLoading(false);
        return;
      }

      const [moodData, journalData, chatData] = await Promise.all([
        supabase.from("mood_entries").select("id,mood,emoji,note,factors,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(365),
        supabase.from("journal_entries").select("id,title,content,word_count,sentiment,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(365),
        supabase.from("chat_messages").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      if (!mounted) return;

      const requestError = moodData.error || journalData.error || chatData.error;
      if (requestError) {
        console.error("Wellness dashboard query failed", requestError);
        setError(`Wellness data could not be loaded (${requestError.code || "database error"}). Check your Supabase tables and RLS policies.`);
      } else {
        setMoodEntries((moodData.data || []) as MoodRow[]);
        setJournalEntries((journalData.data || []) as JournalRow[]);
        setChatCount(chatData.count || 0);
      }
      setLoading(false);
    };

    fetchDashboardData();
    return () => { mounted = false; };
  }, [refreshKey]);

  const cutoff = useMemo(() => {
    if (range === "all") return 0;
    const date = new Date();
    date.setDate(date.getDate() - range);
    return date.getTime();
  }, [range]);

  const filteredMoods = useMemo(
    () => moodEntries.filter((entry) => new Date(entry.created_at).getTime() >= cutoff),
    [cutoff, moodEntries],
  );
  const filteredJournals = useMemo(
    () => journalEntries.filter((entry) => new Date(entry.created_at).getTime() >= cutoff),
    [cutoff, journalEntries],
  );

  const moodChartData = useMemo(
    () => [...filteredMoods].reverse().map((entry) => ({
      date: new Date(entry.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      mood: entry.mood,
      note: entry.note || "No note",
    })),
    [filteredMoods],
  );

  const factorData = useMemo(() => {
    const counts = new Map<string, number>();
    filteredMoods.forEach((entry) => entry.factors?.forEach((factor) => counts.set(factor, (counts.get(factor) || 0) + 1)));
    return [...counts.entries()]
      .map(([factor, count]) => ({ factor, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [filteredMoods]);

  const averageMood = filteredMoods.length
    ? filteredMoods.reduce((sum, entry) => sum + entry.mood, 0) / filteredMoods.length
    : 0;
  const goodDays = filteredMoods.filter((entry) => entry.mood >= 4).length;
  const totalWords = filteredJournals.reduce((sum, entry) => sum + (entry.word_count || 0), 0);
  const latestMood = filteredMoods[0];

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-900" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />)}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Brain className="mx-auto h-10 w-10 text-emerald-600" />
        <h1 className="mt-4 font-serif text-3xl font-bold">Insights need a data connection</h1>
        <p className="mt-3 leading-7 text-muted-foreground">{error}</p>
        <Button className="mt-6 rounded-full bg-emerald-700 hover:bg-emerald-800" onClick={() => setRefreshKey((key) => key + 1)}><RefreshCw className="mr-2 h-4 w-4" />Try again</Button>
      </div>
    );
  }

  const metrics = [
    { label: "Average mood", value: averageMood ? averageMood.toFixed(1) : "--", detail: `${filteredMoods.length} check-ins`, icon: Heart, tone: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200" },
    { label: "Good days", value: goodDays.toString(), detail: "Mood rated 4 or 5", icon: TrendingUp, tone: "bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-200" },
    { label: "Journal words", value: totalWords.toLocaleString(), detail: `${filteredJournals.length} entries`, icon: BookOpen, tone: "bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200" },
    { label: "Chat messages", value: chatCount.toLocaleString(), detail: "All-time history", icon: MessageCircle, tone: "bg-violet-50 text-violet-900 dark:bg-violet-950/60 dark:text-violet-200" },
  ];

  return (
    <main className="min-w-0 bg-[#f5f8f6] pb-16 dark:bg-slate-950">
      <section className="border-b border-emerald-950/10 bg-[#173f36] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Wellness insights</p>
            <h1 className="mt-3 text-balance font-serif text-4xl font-bold tracking-tight sm:text-5xl">Your patterns, made visible.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/70 sm:text-base">A private view of your mood check-ins, writing habits, and conversations.</p>
          </div>
          <div className="flex w-full rounded-full bg-white/10 p-1 sm:w-auto">
            {([7, 30, "all"] as Range[]).map((option) => (
              <button key={option} onClick={() => setRange(option)} className={`flex-1 rounded-full px-4 py-2 text-xs font-bold transition sm:flex-none ${range === option ? "bg-white text-emerald-900 shadow" : "text-white/65 hover:text-white"}`}>
                {option === "all" ? "All time" : `${option} days`}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto min-w-0 max-w-7xl space-y-5 px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => { const Icon = metric.icon; return (
            <article key={metric.label} className={`min-w-0 rounded-2xl p-5 ${metric.tone}`}>
              <div className="flex items-center justify-between"><p className="text-sm font-bold opacity-75">{metric.label}</p><Icon className="h-5 w-5 opacity-60" /></div>
              <p className="mt-7 truncate font-serif text-4xl font-bold">{metric.value}</p>
              <p className="mt-1 text-xs opacity-60">{metric.detail}</p>
            </article>
          ); })}
        </div>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[1.45fr_.75fr]">
          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">Mood rhythm</p><h2 className="mt-1 font-serif text-2xl font-bold">How your days have felt</h2></div>
              {latestMood && <span className="text-3xl" title="Latest mood">{latestMood.emoji}</span>}
            </div>
            {moodChartData.length ? (
              <div className="mt-6 h-72 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={moodChartData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                    <defs><linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16866a" stopOpacity={0.35} /><stop offset="95%" stopColor="#16866a" stopOpacity={0.02} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    <Area type="monotone" dataKey="mood" stroke="#16866a" strokeWidth={3} fill="url(#moodFill)" activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart icon={Heart} title="No mood check-ins yet" description="Log how today feels and your trend will begin here." href="/moodtracking" action="Track your mood" />
            )}
          </section>

          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-sky-700 dark:text-sky-300">Influences</p>
            <h2 className="mt-1 font-serif text-2xl font-bold">What shows up most</h2>
            {factorData.length ? (
              <div className="mt-6 h-72 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={factorData} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#94a3b8" opacity={0.2} />
                    <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="factor" width={72} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{ fill: "rgba(148,163,184,.08)" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="count" fill="#3d8cba" radius={[0, 8, 8, 0]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyChart icon={Sparkles} title="No factors logged" description="Add influences such as sleep, work, or exercise to a mood entry." href="/moodtracking" action="Add a check-in" />
            )}
          </section>
        </div>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[1fr_.72fr]">
          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-700 dark:text-amber-300">Recent writing</p><h2 className="mt-1 font-serif text-2xl font-bold">Journal activity</h2></div><Link to="/smartjournaling" className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Open journal</Link></div>
            {filteredJournals.length ? <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">{filteredJournals.slice(0, 4).map((entry) => (
              <article key={entry.id} className="flex min-w-0 items-start gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"><BookOpen className="h-4 w-4" /></div>
                <div className="min-w-0 flex-1"><h3 className="truncate font-bold">{entry.title}</h3><p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{entry.content}</p></div>
                <div className="shrink-0 text-right text-xs text-muted-foreground"><p>{new Date(entry.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p><p className="mt-1">{entry.word_count || 0} words</p></div>
              </article>
            ))}</div> : <EmptyChart icon={BookOpen} title="Your journal is waiting" description="A few honest lines are enough to start seeing a writing rhythm." href="/smartjournaling" action="Write an entry" compact />}
          </section>

          <aside className="rounded-3xl bg-[#173f36] p-6 text-white sm:p-7">
            <CalendarDays className="h-6 w-6 text-emerald-200" />
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">A gentle observation</p>
            <h2 className="mt-2 font-serif text-2xl font-bold">Consistency matters more than volume.</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">Short, regular check-ins create a clearer picture than trying to capture everything at once.</p>
            <Link to="/moodtracking" className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-emerald-900">Check in today <ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>
      </div>
    </main>
  );
};

const EmptyChart = ({ icon: Icon, title, description, href, action, compact = false }: { icon: typeof Heart; title: string; description: string; href: string; action: string; compact?: boolean }) => (
  <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-10" : "h-72"}`}>
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"><Icon className="h-5 w-5" /></div>
    <h3 className="mt-3 font-bold">{title}</h3>
    <p className="mt-1 max-w-xs text-sm leading-6 text-muted-foreground">{description}</p>
    <Link to={href} className="mt-4 text-sm font-bold text-emerald-700 dark:text-emerald-300">{action} →</Link>
  </div>
);

export default DashboardOverview;
