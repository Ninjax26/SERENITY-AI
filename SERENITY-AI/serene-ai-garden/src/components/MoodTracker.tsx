import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, Heart, Loader2, Sparkles, Trash2, TrendingUp } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MoodEntryRow, User } from "@/lib/types";

interface MoodEntry {
  id: string;
  mood: number;
  emoji: string;
  note: string;
  date: Date;
  factors: string[];
}

const moodOptions = [
  { value: 1, emoji: "😢", label: "Heavy", prompt: "Be gentle with yourself", color: "#e36d6d" },
  { value: 2, emoji: "🙁", label: "Low", prompt: "A small step is enough", color: "#df9655" },
  { value: 3, emoji: "😐", label: "Steady", prompt: "Notice what is present", color: "#d2ae45" },
  { value: 4, emoji: "😊", label: "Good", prompt: "Let the good moment land", color: "#52a879" },
  { value: 5, emoji: "😄", label: "Bright", prompt: "Carry this energy forward", color: "#16866a" },
];

const factors = [
  ["Sleep", "☾"], ["Exercise", "↗"], ["Work", "⌘"], ["Social", "◌"],
  ["Weather", "☀"], ["Health", "+"], ["Family", "⌂"], ["Stress", "~"],
] as const;

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchMoodEntries = useCallback(async (userId: string) => {
    const { data, error } = await supabase.from("mood_entries").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
    if (error) {
      setMoodEntries([]);
      toast({ title: "Mood history unavailable", description: error.message, variant: "destructive" });
      return;
    }
    setMoodEntries((data || []).map((row: MoodEntryRow) => ({
      id: row.id, mood: row.mood, emoji: row.emoji, note: row.note || "", date: new Date(row.created_at), factors: row.factors || [],
    })));
  }, [toast]);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const nextUser = data.session?.user || null;
      setUser(nextUser);
      setLoading(false);
      if (nextUser) fetchMoodEntries(nextUser.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user || null);
      setLoading(false);
      if (session?.user) fetchMoodEntries(session.user.id);
      else setMoodEntries([]);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [fetchMoodEntries]);

  const saveMood = async () => {
    if (selectedMood === null) return;
    if (!user) {
      toast({ title: "Sign in required", description: "Sign in before saving a mood check-in.", variant: "destructive" });
      return;
    }
    const option = moodOptions.find((mood) => mood.value === selectedMood);
    if (!option) return;
    setSubmitting(true);
    const { error } = await supabase.from("mood_entries").insert({
      user_id: user.id, mood: option.value, emoji: option.emoji, note: moodNote.trim(), factors: selectedFactors, created_at: new Date().toISOString(),
    });
    if (error) toast({ title: "Check-in not saved", description: error.message, variant: "destructive" });
    else {
      await fetchMoodEntries(user.id);
      setSelectedMood(null); setMoodNote(""); setSelectedFactors([]);
      toast({ title: "Check-in saved", description: "Your emotional timeline has been updated." });
    }
    setSubmitting(false);
  };

  const deleteEntry = async (entry: MoodEntry) => {
    if (!user || !window.confirm("Delete this mood check-in?")) return;
    const { error } = await supabase.from("mood_entries").delete().eq("id", entry.id).eq("user_id", user.id);
    if (error) toast({ title: "Entry not deleted", description: error.message, variant: "destructive" });
    else setMoodEntries((entries) => entries.filter((item) => item.id !== entry.id));
  };

  const toggleFactor = (factor: string) => setSelectedFactors((current) => current.includes(factor) ? current.filter((item) => item !== factor) : [...current, factor]);
  const average = moodEntries.length ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length : 0;
  const recent = moodEntries.slice(0, 7).reverse();
  const commonFactor = useMemo(() => {
    const counts = new Map<string, number>();
    moodEntries.forEach((entry) => entry.factors.forEach((factor) => counts.set(factor, (counts.get(factor) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || "No pattern yet";
  }, [moodEntries]);
  const selected = moodOptions.find((mood) => mood.value === selectedMood);

  return (
    <main className="min-h-screen bg-[#f3f7f4] pb-16 text-slate-900 dark:bg-slate-950 dark:text-white">
      <section className="relative overflow-hidden bg-[#173f36] text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_80%_20%,#7dd3b0_0,transparent_28%),radial-gradient(circle_at_15%_80%,#6ca8cc_0,transparent_24%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
          <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">Emotional check-in</p><h1 className="mt-3 text-balance font-serif text-4xl font-bold tracking-tight sm:text-5xl">Name the feeling. Notice the pattern.</h1><p className="mt-3 max-w-2xl text-emerald-50/70">A few honest seconds can make the shape of your week easier to understand.</p></div>
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur">
            <Stat value={moodEntries.length.toString()} label="check-ins" />
            <Stat value={average ? average.toFixed(1) : "--"} label="average" />
            <Stat value={moodEntries.filter((entry) => entry.mood >= 4).length.toString()} label="bright days" />
          </div>
        </div>
      </section>

      <div className="mx-auto grid min-w-0 max-w-7xl gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] lg:px-8">
        <section className="min-w-0 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Right now</p><h2 className="mt-1 font-serif text-2xl font-bold">How does today feel?</h2></div><Heart className="h-6 w-6 text-rose-400" /></div>

          <div className="mt-6 grid grid-cols-5 gap-2">
            {moodOptions.map((mood) => {
              const active = selectedMood === mood.value;
              return <button key={mood.value} type="button" onClick={() => setSelectedMood(mood.value)} aria-label={mood.label} className={`group rounded-2xl border px-1 py-3 text-center transition duration-200 sm:px-2 ${active ? "-translate-y-1 border-transparent text-white shadow-lg" : "border-slate-200 bg-slate-50 hover:-translate-y-0.5 hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-800"}`} style={active ? { backgroundColor: mood.color } : undefined}><span className="block text-2xl transition group-hover:scale-110 sm:text-3xl">{mood.emoji}</span><span className="mt-1 block truncate text-[10px] font-bold sm:text-xs">{mood.label}</span></button>;
            })}
          </div>

          <div className={`mt-5 overflow-hidden rounded-2xl transition-all ${selected ? "max-h-24 border border-emerald-100 bg-emerald-50 p-4 opacity-100 dark:border-emerald-900 dark:bg-emerald-950/40" : "max-h-0 opacity-0"}`}><p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{selected?.prompt}</p><p className="mt-1 text-xs text-emerald-700/70 dark:text-emerald-300/60">What seems to be influencing this feeling?</p></div>

          <div className="mt-6"><p className="text-sm font-bold">What shaped today?</p><div className="mt-3 grid grid-cols-4 gap-2">{factors.map(([factor, symbol]) => { const active = selectedFactors.includes(factor); return <button key={factor} type="button" onClick={() => toggleFactor(factor)} className={`relative rounded-xl border px-2 py-3 text-xs font-semibold transition ${active ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "border-slate-200 text-slate-500 hover:border-slate-300 dark:border-slate-700"}`}><span className="mb-1 block text-base">{symbol}</span>{factor}{active && <Check className="absolute right-1.5 top-1.5 h-3 w-3" />}</button>; })}</div></div>

          <div className="mt-6"><div className="flex items-center justify-between"><label htmlFor="mood-note" className="text-sm font-bold">One line about today</label><span className="text-xs text-muted-foreground">{moodNote.length}/280</span></div><Textarea id="mood-note" value={moodNote} onChange={(event) => setMoodNote(event.target.value)} maxLength={280} placeholder="What happened, or what do you need?" className="mt-3 min-h-28 resize-none" /></div>
          {!user && !loading && <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">Sign in from the header to save check-ins across devices.</p>}
          <Button onClick={saveMood} disabled={!selected || submitting || loading} className="mt-5 h-12 w-full rounded-full bg-emerald-700 text-white hover:bg-emerald-800">{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}{submitting ? "Saving check-in..." : "Save today’s check-in"}</Button>
        </section>

        <div className="min-w-0 space-y-5">
          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-700 dark:text-sky-300">Last seven check-ins</p><h2 className="mt-1 font-serif text-2xl font-bold">Your recent rhythm</h2></div><TrendingUp className="h-5 w-5 text-sky-600" /></div>
            {recent.length ? <div className="mt-8 flex h-48 items-end justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">{recent.map((entry) => <div key={entry.id} className="flex min-w-0 flex-1 flex-col items-center justify-end"><span className="mb-2 text-xl">{entry.emoji}</span><div className="w-full max-w-12 rounded-t-xl transition-all" style={{ height: `${24 + entry.mood * 20}px`, backgroundColor: moodOptions[entry.mood - 1]?.color }} /><span className="mt-2 text-[10px] text-muted-foreground">{entry.date.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2)}</span></div>)}</div> : <EmptyState />}
            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-slate-800"><span className="text-muted-foreground">Most common influence</span><span className="font-bold">{commonFactor}</span></div>
          </section>

          <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-7">
            <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700 dark:text-amber-300">Timeline</p><h2 className="mt-1 font-serif text-2xl font-bold">Recent reflections</h2></div><CalendarDays className="h-5 w-5 text-amber-600" /></div>
            {moodEntries.length ? <div className="mt-5 max-h-80 divide-y divide-slate-100 overflow-y-auto pr-1 dark:divide-slate-800">{moodEntries.slice(0, 12).map((entry) => <article key={entry.id} className="group flex items-start gap-3 py-4 first:pt-0"><span className="text-2xl">{entry.emoji}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h3 className="font-bold">{moodOptions[entry.mood - 1]?.label || "Check-in"}</h3><span className="text-xs text-muted-foreground">{entry.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span></div><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{entry.note || "No note added"}</p>{entry.factors.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{entry.factors.map((factor) => <span key={factor} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold dark:bg-slate-800">{factor}</span>)}</div>}</div><button type="button" onClick={() => deleteEntry(entry)} aria-label="Delete check-in" className="rounded-lg p-2 text-slate-300 opacity-0 transition hover:bg-rose-50 hover:text-rose-500 group-hover:opacity-100 focus:opacity-100 dark:hover:bg-rose-950"><Trash2 className="h-4 w-4" /></button></article>)}</div> : <EmptyState />}
          </section>
        </div>
      </div>
    </main>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => <div className="min-w-20 rounded-xl px-3 py-2 text-center"><p className="font-serif text-2xl font-bold">{value}</p><p className="text-[10px] uppercase tracking-wide text-white/55">{label}</p></div>;
const EmptyState = () => <div className="flex h-48 flex-col items-center justify-center text-center"><Heart className="h-7 w-7 text-emerald-500" /><p className="mt-3 font-bold">Your timeline starts here</p><p className="mt-1 max-w-xs text-sm text-muted-foreground">Save a check-in to begin seeing your emotional rhythm.</p><ArrowRight className="mt-3 h-4 w-4 text-emerald-600" /></div>;

export default MoodTracker;
