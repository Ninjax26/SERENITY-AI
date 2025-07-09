import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Terms from "./pages/Terms";
import CrisisResources from "./pages/CrisisResources";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Blog from "./pages/Blog";
import Community from "./pages/Community";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MoodTracking from "./pages/MoodTracking";
import SmartJournaling from "./pages/SmartJournaling";
import WellnessInsights from "./pages/WellnessInsights";
import MindfulnessTools from "./pages/MindfulnessTools";
import AICompanion from "./pages/AICompanion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/community" element={<Community />} />
          <Route path="/helpcenter" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/moodtracking" element={<MoodTracking />} />
          <Route path="/smartjournaling" element={<SmartJournaling />} />
          <Route path="/wellnessinsights" element={<WellnessInsights />} />
          <Route path="/mindfulnesstools" element={<MindfulnessTools />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/crisis-resources" element={<CrisisResources />} />
          <Route path="/aicompanion" element={<AICompanion />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
