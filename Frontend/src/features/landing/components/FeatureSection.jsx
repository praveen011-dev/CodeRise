import React from "react";
import {
  Code2,
  Zap,
  LayoutDashboard,
  Users,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
function FeatureSection() {
  const { user } = useAuthStore();

  return (
    <section className="py-10 md:py-14 bg-background text-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-25"
        style={{
          background:
            "linear-gradient(to bottom, var(--site-gradient-start) 0%, var(--site-gradient-via) 50%, var(--site-gradient-end) 100%)",
          backgroundAttachment: "fixed",
        }}
      ></div>

      {/* Dotted Background Pattern  */}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", // Dotted pattern
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-10 leading-tight">
          Powerful <span className="text-primary">Features</span> at Your
          Fingertips
          <p className="text-base text-muted-foreground mt-3 font-normal max-w-2xl mx-auto">
            Our platform is designed to make your coding journey efficient,
            engaging, and effective.
          </p>
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Feature Card 1: Interactive Editor */}
          <div className="p-4 md:p-5 rounded-xl border border-[var(--hero-hexagon-border)] shadow-lg bg-[var(--hero-hexagon-bg)] backdrop-blur-xl flex flex-col items-start min-h-[200px]">
            <Code2 className="text-primary w-8 h-8 mb-2" />
            <h3 className="text-xl font-bold mb-1">Interactive Code Editor</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Practice directly in your browser with a powerful, real-time code
              editor supporting multiple languages. Get instant syntax
              highlighting and smart suggestions.
            </p>
            <Link to="/problems">
              <button className="self-start px-4 py-3 text-xs bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors mt-auto cursor-pointer">
                Start Coding
              </button>
            </Link>
          </div>

          {/* Feature Card 2: Instant Feedback & Debugging */}
          <div className="p-4 md:p-5 rounded-xl border border-[var(--hero-hexagon-border)] shadow-lg bg-[var(--hero-hexagon-bg)] backdrop-blur-xl flex flex-col items-start min-h-[200px]">
            <Zap className="text-yellow-500 w-8 h-8 mb-2" />
            <h3 className="text-xl font-bold mb-1">
              Instant Feedback & Debugging
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              Run your solutions against comprehensive test cases and receive
              immediate, detailed feedback to debug and refine your code. this
              will boost your problem-solving skills.
            </p>
            <Link to="/problems">
              <button className="self-start px-4 py-3 text-xs bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/90 transition-colors mt-auto cursor-pointer">
                See How It Works
              </button>
            </Link>
          </div>

          {/* Feature Card 3: Personalized Progress */}
          <div className="p-4 md:p-5 rounded-xl border border-[var(--hero-hexagon-border)] shadow-lg bg-[var(--hero-hexagon-bg)] backdrop-blur-xl flex flex-col items-start min-h-[200px]">
            <LayoutDashboard className="text-blue-500 w-8 h-8 mb-2" />
            <h3 className="text-xl font-bold mb-1">Personalized Progress</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Track your solved problems, submission history, and performance
              trends with intuitive dashboards and contribution heatmaps.
            </p>
            <Link to="/profile">
              <button className="self-start px-4 py-3 text-xs bg-accent text-accent-foreground rounded-full font-semibold hover:bg-accent/90 transition-colors mt-auto cursor-pointer">
                View Dashboard
              </button>
            </Link>
          </div>

          {/* Feature Card 4: Vibrant Community */}
          <div className="p-4 md:p-5 rounded-xl border border-[var(--hero-hexagon-border)] shadow-lg bg-[var(--hero-hexagon-bg)] backdrop-blur-xl flex flex-col items-start min-h-[200px]">
            <Users className="text-pink-500 w-8 h-8 mb-2" />
            <h3 className="text-xl font-bold mb-1">Vibrant Community</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Connect with fellow coders, share insights, ask questions, and
              learn from diverse solutions in our active community forums.
            </p>
            <Link to="join">
              <button className="self-start px-4 py-3 text-xs bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors mt-auto cursor-pointer">
                Join the Community
              </button>
            </Link>
          </div>

          {/* Example 5th Card */}
          <div className="p-4 md:p-5 rounded-xl border border-[var(--hero-hexagon-border)] shadow-lg bg-[var(--hero-hexagon-bg)] backdrop-blur-xl flex flex-col items-start min-h-[200px]">
            <TrendingUp className="text-green-500 w-8 h-8 mb-2" />
            <h3 className="text-xl font-bold mb-1">Interview Preparation</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Access curated problem sets for interview prep, mock tests, and
              company-specific challenges to ace your next job.
            </p>
            <Link to="preapare">
              <button className="self-start px-4 py-3 text-xs bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/90 transition-colors mt-auto cursor-pointer">
                Prepare Now
              </button>
            </Link>
          </div>

          {/* Optional 6th Card */}

          <div className="p-4 md:p-5 rounded-xl border border-[var(--hero-hexagon-border)] shadow-lg bg-[var(--hero-hexagon-bg)] backdrop-blur-xl flex flex-col items-start min-h-[200px]">
            <Lightbulb className="text-indigo-400 w-8 h-8 mb-2" />
            <h3 className="text-xl font-bold mb-1">Detailed Editorials</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Learn optimal solutions with comprehensive editorials and
              explanations for every problem, guiding you through complex logic.
            </p>
            <Link to="/problems">
              <button className="self-start px-4 py-3 text-xs bg-accent text-accent-foreground rounded-full font-semibold hover:bg-accent/90 transition-colors mt-auto cursor-pointer">
                Learn More
              </button>
            </Link>
          </div>
        </div>
        <div className="text-center mt-16 md:mt-20">
          {" "}
          <button className="px-8 py-3 text-lg bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105">
            Start Your Coding Journey
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
