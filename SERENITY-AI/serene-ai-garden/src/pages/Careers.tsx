import { ArrowRight, HeartHandshake, Mail } from "lucide-react";

const Careers = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Careers</p>
    <h1 className="mt-4 max-w-3xl text-balance font-serif text-5xl font-bold tracking-tight sm:text-6xl">Help us make digital wellbeing feel more human.</h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Serenity AI is an early-stage project. We are not actively hiring right now, but we are always interested in meeting thoughtful builders who care about responsible technology.</p>
    <div className="mt-12 grid gap-5 md:grid-cols-2">
      <div className="rounded-[1.75rem] bg-[#dff0e8] p-7 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50">
        <HeartHandshake className="h-7 w-7" /><h2 className="mt-8 font-serif text-2xl font-bold">What we value</h2><p className="mt-3 leading-7 opacity-75">Empathy in the details, honest communication, responsible AI, and the patience to build things well.</p>
      </div>
      <div className="rounded-[1.75rem] bg-white p-7 shadow-sm dark:bg-slate-900">
        <Mail className="h-7 w-7 text-emerald-700" /><h2 className="mt-8 font-serif text-2xl font-bold">Introduce yourself</h2><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">Share what you care about and the kind of problems you enjoy working on.</p><a href="/contact" className="mt-6 inline-flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">Contact the team <ArrowRight className="h-4 w-4" /></a>
      </div>
    </div>
  </div>
);

export default Careers;
