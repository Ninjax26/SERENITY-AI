import { Mail, Newspaper } from "lucide-react";

const Press = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
    <div className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Press room</p>
      <h1 className="mt-4 text-balance font-serif text-5xl font-bold tracking-tight sm:text-6xl">The Serenity AI story, without the spin.</h1>
      <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">Serenity AI is a student-built wellness platform exploring how conversation, reflection, and simple tracking tools can live in one thoughtful experience.</p>
    </div>
    <div className="mt-12 grid gap-5 md:grid-cols-3">
      <div className="rounded-3xl bg-[#173f36] p-6 text-white md:col-span-2"><Newspaper className="h-6 w-6 text-emerald-200" /><p className="mt-10 text-xs font-bold uppercase tracking-[0.15em] text-emerald-200">Current status</p><h2 className="mt-2 font-serif text-3xl font-bold">Building in public, one release at a time.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-white/65">There are no published press releases yet. Product facts and availability should be verified directly with the team.</p></div>
      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900"><Mail className="h-6 w-6 text-emerald-700" /><h2 className="mt-10 font-serif text-2xl font-bold">Media enquiry</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">For interviews, project details, or verified assets, contact the founders.</p><a href="/contact" className="mt-5 inline-flex font-bold text-emerald-700 dark:text-emerald-300">Contact us</a></div>
    </div>
  </div>
);

export default Press;
