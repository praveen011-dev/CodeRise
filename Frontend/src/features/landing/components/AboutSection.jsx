import React from "react";

function AboutSection({ id }) {
  return (
    <section
      id={id}
      className="py-16 md:py-24 text-foreground relative overflow-hidden"
    >
      {" "}
      {/* NEW: Linear Background Gradient (from site-gradient vars) - Mimics body background */}
      <div
        className="absolute inset-0 z-0 opacity-25"
        style={{
          background:
            "linear-gradient(to bottom, var(--site-gradient-start) 0%, var(--site-gradient-via) 50%, var(--site-gradient-end) 100%)",
          backgroundAttachment: "fixed",
        }}
      ></div>
      {/* NEW: Dotted Background Pattern (from body::before)*/}
      <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            "radial-gradient(var(--foreground) 1px, transparent 1px)", // Dot color from --foreground
          backgroundSize: "20px 20px",
          backgroundAttachment: "fixed",
        }}
      ></div>
      {/* This can overlay the linear gradient and dotted pattern for more depth */}
      <div
        className="absolute inset-0 z-0 opacity-20" // Opacity from FeatureSection
        style={{
          background:
            "radial-gradient(circle at top right, var(--tw-color-blue-500) 0%, transparent 30%), radial-gradient(circle at bottom left, var(--tw-color-green-500) 0%, transparent 30%)",
        }}
      ></div>
      <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
        {" "}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">
          About{" "}
          <span className="text-blue-600 dark:text-yellow-400">CodeRise</span>{" "}
        </h2>
        <p className="text-lg md:text-md text-muted-foreground mb-6">
          CodeRise is more than just a platform; it's a community dedicated to
          empowering aspiring and experienced developers alike. Our mission is
          to provide an accessible and engaging environment for mastering coding
          challenges and advancing your career.
        </p>
        <p className="text-lg md:text-md text-muted-foreground mb-8">
          We believe in learning by doing, and our vast collection of problems,
          instant feedback system, and vibrant community support are designed to
          make your journey efficient and rewarding.
        </p>
        <button className="px-10 py-4 text-lg bg-accent text-accent-foreground rounded-full font-bold shadow-lg hover:bg-accent/90 transition-transform duration-300 hover:scale-105">
          Learn More About Us
        </button>
      </div>
    </section>
  );
}

export default AboutSection;
