import { ArrowUpRight, Heart, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";

const groups = [
  { title: "Explore", links: [["AI Companion", "/aicompanion"], ["Mood Tracking", "/moodtracking"], ["Smart Journal", "/smartjournaling"], ["Mindfulness", "/mindfulnesstools"], ["Insights", "/wellnessinsights"]] },
  { title: "Community", links: [["Serenity Circle", "/community"], ["Help Center", "/helpcenter"], ["Contact", "/contact"], ["Crisis Resources", "/crisis-resources"]] },
  { title: "Serenity AI", links: [["About", "/about"], ["Careers", "/careers"], ["Blog", "/blog"], ["Press", "/press"], ["Privacy", "/privacypolicy"], ["Terms", "/terms"]] },
];

const Footer = () => (
  <footer className="border-t border-emerald-950/10 bg-[#173f36] px-4 py-14 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div className="max-w-lg">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/serenity-logo.png" alt="" className="h-10 w-10" />
            <span className="font-serif text-2xl font-bold">Serenity AI</span>
          </Link>
          <p className="mt-5 text-balance text-lg leading-8 text-emerald-50/75">A calm digital space for reflection, emotional awareness, and everyday wellbeing.</p>
          <Link to="/crisis-resources" className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold transition hover:bg-white/15">
            <LifeBuoy className="h-4 w-4 text-emerald-200" /> Need immediate support? <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200">{group.title}</h2>
              <ul className="mt-5 space-y-3">
                {group.links.map(([label, href]) => (
                  <li key={href}><Link to={href} className="text-sm text-white/70 transition hover:text-white">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Serenity AI. Built with care for everyday wellbeing.</p>
        <p className="inline-flex items-center gap-1.5"><Heart className="h-3.5 w-3.5 text-rose-300" /> Support, not a substitute for professional medical care.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
