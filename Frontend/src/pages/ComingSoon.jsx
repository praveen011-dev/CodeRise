import React from "react";
import { Link } from "react-router-dom"; // For navigation to homepage
import { Button } from "@/components/ui/button"; // Assuming Shadcn Button component
import { Loader2 } from "lucide-react"; // Example icon for loading/coming soon

function ComingSoonPage() {
  return (
    <section className="min-h-screen py-16 md:py-24 text-foreground relative overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Consistent Linear Background Gradient - from site-gradient vars */}
      <div
        className="absolute inset-0 z-0 opacity-25"
        style={{
          background:
            "linear-gradient(to bottom, var(--site-gradient-start) 0%, var(--site-gradient-via) 50%, var(--site-gradient-end) 100%)",
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Consistent Dotted Background Pattern - from body::before */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Section-specific Radial Gradient Background for unique depth */}
      {/* Adds a subtle blue/green glow specific to this page */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at center, var(--tw-color-cyan-500)/0.2 0%, transparent 40%), radial-gradient(circle at bottom left, var(--tw-color-indigo-500)/0.15 0%, transparent 40%)",
        }}
      ></div>

      {/* Main Content Area - Styled like a prominent glassmorphic card */}
      <div className="relative p-10 md:p-16 rounded-2xl border border-[rgba(255,255,255,0.15)] shadow-2xl bg-[rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col items-center max-w-md mx-auto z-10">
        {/* Large spinning icon */}
        <Loader2 className="w-16 h-16 text-primary mb-4 animate-spin" />
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4">
          Coming Soon!
        </h1>
        {/* Descriptive paragraph */}
        <p className="text-lg text-muted-foreground mb-8">
          We're working hard to bring you this exciting new feature. Stay tuned
          for updates!
        </p>
        {/* Call-to-action button to return home */}
        <Link to="/">
          <Button
            size="lg"
            className="px-8 py-3 text-lg bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105"
          >
            Back to Homepage
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default ComingSoonPage;
