import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const PublicPageFrame = ({ children }: { children: ReactNode }) => (
  <div className="public-page min-h-screen bg-[#f5f8f3] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Navigation />
    <main className="min-h-[65vh]">{children}</main>
    <Footer />
  </div>
);

export default PublicPageFrame;
