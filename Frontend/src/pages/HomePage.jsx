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
      <AboutSection id="about"/>
      <PricingSection id="pricing"/>
    </div>
  );
}

export default HomePage;
