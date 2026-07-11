import { ArrowUpRight, BarChart3, BookOpen, Brain, Calendar, MessageCircle } from "lucide-react";

interface FeatureShowcaseProps {
  onFeatureClick: (featureId: string) => void;
}

const features = [
  { id: "chat", title: "Talk it through", eyebrow: "AI companion", description: "A thoughtful conversation space for sorting through what you feel, one message at a time.", icon: MessageCircle, tone: "bg-[#dff0e8] text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100", number: "01" },
  { id: "mood", title: "Notice the pattern", eyebrow: "Mood tracker", description: "Log the day in seconds and look back at the emotional rhythms that are easy to miss.", icon: Calendar, tone: "bg-[#e5eef7] text-sky-950 dark:bg-sky-950 dark:text-sky-100", number: "02" },
  { id: "journal", title: "Make room to reflect", eyebrow: "Smart journal", description: "Keep private entries, import past writing, and return to the thoughts that matter.", icon: BookOpen, tone: "bg-[#f1e8dc] text-amber-950 dark:bg-amber-950 dark:text-amber-100", number: "03" },
  { id: "mindfulness", title: "Come back to now", eyebrow: "Mindfulness", description: "Use focused exercises, breathing tools, and gentle games when your mind needs a reset.", icon: Brain, tone: "bg-[#ebe7f3] text-violet-950 dark:bg-violet-950 dark:text-violet-100", number: "04" },
  { id: "dashboard", title: "See your progress", eyebrow: "Wellness insights", description: "Bring your check-ins together into a simple view of your recent wellbeing activity.", icon: BarChart3, tone: "bg-[#e5eee9] text-teal-950 dark:bg-teal-950 dark:text-teal-100", number: "05" },
];

const FeatureShowcase = ({ onFeatureClick }: FeatureShowcaseProps) => (
  <section className="bg-white px-4 py-20 dark:bg-slate-950 sm:px-6 sm:py-28 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-6 border-b border-slate-200 pb-10 dark:border-slate-800 md:grid-cols-[.8fr_1.2fr] md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Your wellbeing toolkit</p>
          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">Different days need different kinds of care.</h2>
        </div>
        <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300 md:justify-self-end">Choose a space that fits the moment. Each tool works on its own, and together they help you build a clearer picture over time.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <button key={feature.id} onClick={() => onFeatureClick(feature.id)} className={`group min-h-64 rounded-[1.6rem] p-6 text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${feature.tone} ${index < 2 ? "lg:col-span-3" : "lg:col-span-2"}`}>
              <div className="flex items-start justify-between">
                <span className="text-xs font-black tracking-[0.2em] opacity-45">{feature.number}</span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 transition group-hover:rotate-6 group-hover:scale-110 dark:bg-white/10"><Icon className="h-5 w-5" /></span>
              </div>
              <div className="mt-12">
                <p className="text-xs font-bold uppercase tracking-[0.14em] opacity-60">{feature.eyebrow}</p>
                <h3 className="mt-2 font-serif text-2xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 opacity-70">{feature.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold">Open tool <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeatureShowcase;
