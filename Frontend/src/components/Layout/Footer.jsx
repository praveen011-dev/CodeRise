import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from "lucide-react";

function Footer() {
  return (
    <footer className="pt-24 md:pt-32 pb-8 text-foreground relative overflow-hidden">
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
          backgroundImage:
            "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundAttachment: "fixed",
        }}
      ></div>

      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at bottom center, var(--tw-color-blue-500)/0.2 0%, transparent 40%), radial-gradient(circle at top right, var(--tw-color-green-500)/0.15 0%, transparent 40%)",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="relative py-16 md:py-20 px-8 md:px-12 rounded-4xl border border-[rgba(255,255,255,0.15)] shadow-2xl bg-[rgba(0,0,0,0.3)] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between text-center md:text-left mb-16 md:mb-22">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2 leading-tight">
              Ready to Start Your{" "}
              <span className="text-yellow-600 dark:text-yellow-400">
                Coding Journey?
              </span>
            </h2>
            <p className="text-lg md:text-md text-muted-foreground max-w-2xl mx-auto md:mx-0">
              Join CodeRise today and unlock your potential with thousands of
              problems, real-time feedback, and a supportive community.
            </p>
          </div>
          <div className="mt-8 md:mt-0 flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="px-8 py-3 text-lg bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:bg-primary/90 transition-transform duration-300 hover:scale-105"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg border-2 border-primary text-primary rounded-full font-bold shadow-lg hover:bg-primary/10 transition-transform duration-300 hover:scale-105"
            >
              Connnect now
            </Button>
          </div>
        </div>

        {/* Main Footer Content - Links, Social, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-12 md:pb-16 border-b border-border/50">
          {/* Logo/Description */}
          <div className="col-span-full lg:col-span-1 text-center md:text-left">
            <Link
              to="/"
              className="text-2xl font-bold text-foreground mb-4 inline-block"
            >
              CodeRise
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto md:mx-0">
              Your ultimate platform for mastering coding challenges and
              boosting your career.
            </p>
          </div>

          {/* Navigation Links Group 1 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/problems"
                  className="hover:text-primary transition-colors"
                >
                  Problem Set
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/playlists"
                  className="hover:text-primary transition-colors"
                >
                  Playlists
                </Link>
              </li>
              <li>
                <Link
                  to="/contributions"
                  className="hover:text-primary transition-colors"
                >
                  Contributions
                </Link>
              </li>
            </ul>
          </div>

          {/* Navigation Links Group 2 */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="hover:text-primary transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social Links */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a
                  href="mailto:support@coderise.com"
                  className="hover:text-primary transition-colors"
                >
                  support@coderise.com
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary transition-colors"
                >
                  +91 9999999999
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Delhi, India</span>
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a
                href="https://www.linkedin.com/in/praveen011/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/PalPraveen011"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/praveen011-dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">
          © 2025 CodeRise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
