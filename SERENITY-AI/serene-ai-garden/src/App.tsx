import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import NotFound from "./pages/NotFound";
import EnvWarning from "./components/EnvWarning";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import CrisisResources from "./pages/CrisisResources";
import PublicPageFrame from "./components/PublicPageFrame";

const AICompanion = lazy(() => import("./pages/AICompanion"));
const Community = lazy(() => import("./pages/Community"));
const MoodTracking = lazy(() => import("./pages/MoodTracking"));
const SmartJournaling = lazy(() => import("./pages/SmartJournaling"));
const WellnessInsights = lazy(() => import("./pages/WellnessInsights"));
const MindfulnessTools = lazy(() => import("./pages/MindfulnessTools"));
const Index = lazy(() => import("./pages/Index"));

// Page-shaped placeholder: stable layout that matches real pages without
// implying progress details or shifting content when the route arrives.
const PageLoader = () => (
  <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-10 sm:px-6" aria-hidden="true">
    <div className="h-8 w-56 rounded-lg bg-slate-200 dark:bg-slate-800" />
    <div className="mt-4 h-4 w-80 max-w-full rounded bg-slate-100 dark:bg-slate-800/60" />
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
      <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800/60" />
    </div>
    <span className="sr-only" role="status">Loading…</span>
  </div>
);

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <EnvWarning />
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/about" element={<PublicPageFrame><About /></PublicPageFrame>} />
          <Route path="/careers" element={<PublicPageFrame><Careers /></PublicPageFrame>} />
          <Route path="/press" element={<PublicPageFrame><Press /></PublicPageFrame>} />
          <Route path="/blog" element={<PublicPageFrame><Blog /></PublicPageFrame>} />
          <Route path="/community" element={<Community />} />
          <Route path="/helpcenter" element={<PublicPageFrame><HelpCenter /></PublicPageFrame>} />
          <Route path="/contact" element={<PublicPageFrame><Contact /></PublicPageFrame>} />
          <Route path="/privacypolicy" element={<PublicPageFrame><PrivacyPolicy /></PublicPageFrame>} />
          <Route path="/moodtracking" element={<MoodTracking />} />
          <Route path="/smartjournaling" element={<SmartJournaling />} />
          <Route path="/wellnessinsights" element={<WellnessInsights />} />
          <Route path="/mindfulnesstools" element={<MindfulnessTools />} />
          <Route path="/terms" element={<PublicPageFrame><Terms /></PublicPageFrame>} />
          <Route path="/crisis-resources" element={<PublicPageFrame><CrisisResources /></PublicPageFrame>} />
          <Route path="/aicompanion" element={<AICompanion />} />
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
