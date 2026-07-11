import { ArrowUpRight, BookOpen, Feather, Sparkles } from "lucide-react";

const notes = [
  { title: "Why small check-ins matter", description: "A practical look at noticing emotions without turning every day into a self-improvement project.", icon: Sparkles, label: "Reflection" },
  { title: "Designing a kinder AI companion", description: "The product questions behind tone, boundaries, and building support without pretending to replace care.", icon: Feather, label: "Behind the product" },
  { title: "Journaling when you don’t know what to write", description: "Simple ways to begin with what is present, instead of waiting for the perfect insight.", icon: BookOpen, label: "Practice" },
];

const Blog = () => (
  <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
    <div className="grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Field notes</p><h1 className="mt-4 font-serif text-5xl font-bold tracking-tight sm:text-6xl">Ideas for a steadier inner life.</h1></div>
      <p className="text-lg leading-8 text-slate-600 dark:text-slate-300">The Serenity journal is being prepared. These are the first topics on our desk, and published articles will appear here when they are ready.</p>
    </div>
    <div className="mt-12 grid gap-5 md:grid-cols-3">
      {notes.map((note, index) => { const Icon = note.icon; return <article key={note.title} className="flex min-h-72 flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><Icon className="h-6 w-6 text-emerald-700 dark:text-emerald-300" /><span className="text-xs font-black text-slate-300">0{index + 1}</span></div><p className="mt-10 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">{note.label}</p><h2 className="mt-2 font-serif text-2xl font-bold">{note.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{note.description}</p><span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-bold text-slate-400">Coming soon <ArrowUpRight className="h-4 w-4" /></span></article>; })}
    </div>
  </div>
);

export default Blog;
