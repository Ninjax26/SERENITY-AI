import { ArrowUpRight, Github, HelpCircle, Linkedin, MessageCircle } from "lucide-react";

const Contact = () => (
  <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
    <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Contact</p><h1 className="mt-4 text-balance font-serif text-5xl font-bold tracking-tight sm:text-6xl">A real person is on the other side.</h1><p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">The previous contact form was not connected to a delivery service, so we removed the dead end. Use one of the verified channels below to reach the project team.</p></div>
    <div className="mt-12 grid gap-5 md:grid-cols-2">
      <a href="https://github.com/Ninjax26" target="_blank" rel="noreferrer" className="group rounded-[1.75rem] bg-[#173f36] p-7 text-white transition hover:-translate-y-1"><Github className="h-7 w-7 text-emerald-200" /><h2 className="mt-10 font-serif text-2xl font-bold">Project and technical questions</h2><p className="mt-3 leading-7 text-white/65">Connect with Apoorv through GitHub for repository and development enquiries.</p><span className="mt-6 inline-flex items-center gap-2 font-bold">Open GitHub <ArrowUpRight className="h-4 w-4" /></span></a>
      <a href="https://www.linkedin.com/in/apoorv-pal-1219a52bb/" target="_blank" rel="noreferrer" className="group rounded-[1.75rem] bg-[#e5eef7] p-7 text-sky-950 transition hover:-translate-y-1 dark:bg-sky-950 dark:text-sky-50"><Linkedin className="h-7 w-7" /><h2 className="mt-10 font-serif text-2xl font-bold">Partnerships and general enquiries</h2><p className="mt-3 leading-7 opacity-70">Reach out through LinkedIn for collaboration, feedback, or project conversations.</p><span className="mt-6 inline-flex items-center gap-2 font-bold">Open LinkedIn <ArrowUpRight className="h-4 w-4" /></span></a>
    </div>
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900"><span className="inline-flex items-center gap-3 font-bold"><HelpCircle className="h-5 w-5 text-emerald-600" /> Looking for product help?</span><a href="/helpcenter" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300">Visit the Help Center <MessageCircle className="h-4 w-4" /></a></div>
  </div>
);

export default Contact;
