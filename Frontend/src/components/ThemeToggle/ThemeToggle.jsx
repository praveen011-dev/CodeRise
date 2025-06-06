import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Make sure lucide-react is installed: npm install lucide-react

// Assuming you have Shadcn's Button component available.
// If not, you'll need to install it: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    // This part is crucial for setting the 'dark' class on the HTML element
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    // Replaced the custom slider button with a Shadcn-style icon button
    <Button
      variant="ghost" // Makes the button transparent/minimal
      size="icon" // Makes it a square icon button
      onClick={toggleTheme}
      className="h-9 w-9" // Adjust size slightly if needed (h-8 w-8 or h-10 w-10)
      aria-label="Toggle theme" // Accessibility improvement
    >
      {/* Sun icon for light mode */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
      {/* Moon icon for dark mode */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
      {/* sr-only for accessibility, screen readers will read this */}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
