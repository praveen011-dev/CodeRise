import React from "react";
import { Button } from "@/components/ui/button";

function HeroSection() {
  return (
    <section className="bg-gradient-to-bl from-green-600 via-slate-900 to-black text-white py-20 md:py-32 border-red-500">
      {" "}
      {/* Example background and padding */}
      <div className="container mx-auto text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to CodeRise!
        </h1>
        <p className="text-lg md:text-l text-slate-300 mb-10 max-w-2xl mx-auto">
          Practice coding problems, sharpen your skills, and prepare for
          interviews with our community-driven platform.{" "}
        </p>
        <div className="space-x-4">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            className="text-white bg-orange-600 border-slate-400 hover:bg-slate-700 hover:text-white"
          >
            Browse Problems
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
