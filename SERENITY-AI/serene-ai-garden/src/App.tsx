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

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
    Loading...
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
