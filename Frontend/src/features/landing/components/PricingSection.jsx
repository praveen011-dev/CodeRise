import React from "react";
import { CheckCircle, XCircle, DollarSign } from "lucide-react";

function PricingSection({id}) {
  return (
    <section id={id} className="py-12 md:py-16 text-foreground relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-25"
        style={{
          background:
            "linear-gradient(to bottom, var(--site-gradient-start) 0%, var(--site-gradient-via) 50%, var(--site-gradient-end) 100%)",
          backgroundAttachment: "fixed",
        }}
      ></div>
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", // Dotted pattern
          backgroundSize: "20px 20px", // Size of the dots grid
        }}
      ></div>
      <div
        className="absolute inset-0 z-0 opacity-15"
        style={{
          background:
            "radial-gradient(circle at top, var(--tw-color-cyan-500)/0.15 0%, transparent 30%), radial-gradient(circle at bottom, var(--tw-color-emerald-500)/0.15 0%, transparent 30%)",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 leading-tight">
          Simple & Transparent{" "}
          <span className="text-purple-600 dark:text-purple-400">Pricing</span>
          <p className="text-base md:text-lg text-muted-foreground mt-3 font-normal max-w-3xl mx-auto">
            Choose the plan that best fits your coding journey. No hidden fees,
            just clear benefits.
          </p>
        </h2>
        {/* Pricing Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Basic Tier Card */}
          <div
            className="p-6 rounded-2xl shadow-xl flex flex-col items-center
              border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.1)] backdrop-blur-xl
              dark:border-[rgba(255,255,255,0.15)] dark:bg-[rgba(0,0,0,0.3)]"
          >
            {" "}
            {/* Light mode specific values added */}
            <h3 className="text-2xl font-bold mb-3 text-primary">Basic</h3>
            <p className="text-4xl md:text-5xl font-extrabold mb-3">
              $0<span className="text-base text-muted-foreground">/month</span>
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Start your coding adventure
            </p>
            <ul className="text-left text-sm text-foreground space-y-2 mb-6">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Access to 50
                Problems
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Basic Editor
                Features
              </li>
              <li className="flex items-center gap-1.5">
                <XCircle className="text-destructive w-4 h-4" /> No Premium
                Content
              </li>
            </ul>
            <button className="px-6 py-2 text-base bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105 mt-auto">
              Get Started - Free
            </button>
          </div>

          {/* Pro Tier Card - Highlighted */}
          <div
            className="p-6 rounded-2xl shadow-2xl flex flex-col items-center relative overflow-hidden transform scale-105
              border-2 border-primary bg-[rgba(255,255,255,0.2)] backdrop-blur-xl
              dark:border-2 dark:border-primary dark:bg-[rgba(0,0,0,0.4)]"
          >
            {" "}
            {/* Light mode specific values added */}
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-lg">
              Most Popular
            </span>
            <h3 className="text-2xl font-bold mb-3 text-primary">Pro</h3>
            <p className="text-4xl md:text-5xl font-extrabold mb-3">
              $9<span className="text-base text-muted-foreground">/month</span>
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Unlock your full potential
            </p>
            <ul className="text-left text-sm text-foreground space-y-2 mb-6">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Unlimited
                Problems
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Advanced
                Editor Features
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Premium
                Content & Editorials
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Community
                Access
              </li>
            </ul>
            <button className="px-6 py-2 text-base bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105 mt-auto">
              Choose Pro
            </button>
          </div>

          {/* Enterprise Tier Card */}
          <div
            className="p-6 rounded-2xl shadow-xl flex flex-col items-center
              border border-[rgba(0,0,0,0.1)] bg-[rgba(255,255,255,0.1)] backdrop-blur-xl
              dark:border-[rgba(255,255,255,0.15)] dark:bg-[rgba(0,0,0,0.3)]"
          >
            {" "}
            {/* Light mode specific values added */}
            <h3 className="text-2xl font-bold mb-3 text-primary">Enterprise</h3>
            <p className="text-4xl md:text-5xl font-extrabold mb-3">
              $49<span className="text-base text-muted-foreground">/month</span>
            </p>
            <p className="text-sm text-muted-foreground mb-5">
              Tailored for teams
            </p>
            <ul className="text-left text-sm text-foreground space-y-2 mb-6">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> All Pro
                Features
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Team
                Management
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="text-green-500 w-4 h-4" /> Dedicated
                Support
              </li>
            </ul>
            <button className="px-6 py-2 text-base bg-accent text-accent-foreground rounded-full font-bold shadow-lg hover:bg-accent/90 transition-transform duration-300 hover:scale-105 mt-auto">
              Contact Now
            </button>
          </div>
        </div>{" "}
      </div>{" "}
    </section>
  );
}

export default PricingSection;
