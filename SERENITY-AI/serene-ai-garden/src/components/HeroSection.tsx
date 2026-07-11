import { ArrowRight, BookOpen, Heart, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => (
  <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[#f5f8f3] dark:border-white/10 dark:bg-slate-950">
    <div className="editorial-grid absolute inset-0 opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
    <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#c6e8db] blur-3xl dark:bg-emerald-900/30" />
    <div className="absolute -left-28 bottom-0 h-72 w-72 rounded-full bg-[#dceaf5] blur-3xl dark:bg-sky-900/20" />

    <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-emerald-800 shadow-sm dark:border-emerald-300/15 dark:bg-white/5 dark:text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" /> A quieter place for your mind
        </div>
        <h1 className="mt-7 text-balance font-serif text-5xl font-bold leading-[0.98] tracking-[-0.04em] text-[#163b33] dark:text-white sm:text-6xl lg:text-7xl">
          Meet yourself with a little more kindness.
        </h1>
        <p className="mt-7 max-w-2xl text-balance text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
          Talk things through, notice emotional patterns, and build mindful routines with one calm digital companion.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onGetStarted} size="lg" className="group h-13 rounded-full bg-[#176b57] px-7 text-base text-white shadow-lg shadow-emerald-900/10 hover:bg-[#125444]">
            Talk to Serenity <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <a href="/crisis-resources" className="inline-flex h-13 items-center justify-center rounded-full border border-slate-300 bg-white/70 px-7 text-sm font-bold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-800 dark:border-slate-700 dark:bg-white/5 dark:text-slate-200">
            Find immediate support
          </a>
        </div>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Your entries stay with your account</span>
          <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> Built for reflection, not diagnosis</span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
        <div className="absolute -inset-5 rotate-2 rounded-[2.25rem] bg-[#bddfce]/60 dark:bg-emerald-800/20" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-2xl shadow-emerald-950/10 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">Today’s check-in</p>
              <p className="mt-1 font-serif text-xl font-bold">How are you, really?</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><Heart className="h-5 w-5" /></div>
          </div>
          <div className="mt-5 rounded-2xl bg-[#f2f7f4] p-4 dark:bg-slate-800">
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">“I’ve had a full day and I’m not sure why I still feel behind.”</p>
          </div>
          <div className="mt-3 rounded-2xl border border-emerald-100 bg-white p-4 dark:border-emerald-900 dark:bg-slate-900">
            <div className="flex gap-3">
              <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">That sounds exhausting. We can slow this down together. What part of today is still asking for your attention?</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#173f36] p-4 text-white"><BookOpen className="h-5 w-5 text-emerald-200" /><p className="mt-7 text-sm font-bold">Write it out</p><p className="mt-1 text-xs text-white/60">A private journal space</p></div>
            <div className="rounded-2xl bg-[#e5edf7] p-4 text-slate-800 dark:bg-sky-950 dark:text-white"><Sparkles className="h-5 w-5 text-sky-700 dark:text-sky-300" /><p className="mt-7 text-sm font-bold">Reset gently</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Breathing and focus tools</p></div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
