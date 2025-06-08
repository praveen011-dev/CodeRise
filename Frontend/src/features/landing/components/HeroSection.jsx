import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import "../../../index.css";
import { Link } from "react-router-dom";

const quotes = [
  "Practice makes progress.",
  "Consistency beats intensity.",
  "Every expert was once a beginner.",
];

function HeroSection() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-15 overflow-hidden">
      {/* AI Quote Rotator */}
      <div className="mt-6 mb-4 italic text-muted-foreground text-md transition-opacity duration-500 w-full text-center">
        “{quotes[quoteIndex]}”
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="mx-auto w-[90%] md:w-[70%] max-w-6xl text-center px-4 relative hero-hexagon "
      >
        <h1 className="text-4xl md:text-5xl mb-6 leading-tight text-foreground">
          {" "}
          Rise with every
          <span className="text-pink-600 dark:text-pink-400"> challenge</span>,
          <br></br> growing your
          <span className="text-yellow-600 dark:text-yellow-400">
            {" "}
            career.
          </span>{" "}
          <br />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="text-lg md:text-l text-muted-foreground mb-10 max-w-2xl mx-auto"
        >
          Practice coding problems, sharpen your skills, and prepare for
          interviews with our community-driven platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="space-x-4"
        >
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-[#ff4d91] hover:bg-[#ff267a] text-white shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer bubbleeffectbtn"
            >
              Get Started
            </Button>
          </Link>

          <Link to="/problems">
            <Button size="lg" className="bubbleeffectbtn">
              Browse Problems
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
