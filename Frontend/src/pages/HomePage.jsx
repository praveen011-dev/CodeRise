import React from "react";
import HeroSection from "@/features/landing/components/HeroSection";
import FeatureSection from "@/features/landing/components/FeatureSection";
import AboutSection from "@/features/landing/components/AboutSection";
import PricingSection from "@/features/landing/components/PricingSection";

function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <AboutSection />
      <PricingSection />
      {/* You will add other sections of your landing page here later, like: */}
    </div>
  );
}

export default HomePage;
