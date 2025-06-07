import { useState, useEffect } from "react";

const useThemeDetector = () => {
  const [theme, setTheme] = useState("light"); // Default to light

  useEffect(() => {
    const checkTheme = () => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    };

    // Initial check when the component mounts
    checkTheme();

    // Set up a MutationObserver to watch for changes to the 'class' attribute on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          checkTheme(); // Re-check theme if 'class' attribute changes
        }
      });
    });

    // Start observing the html element for attribute changes
    observer.observe(document.documentElement, { attributes: true });

    // Cleanup the observer when the component unmounts
    return () => {
      observer.disconnect();
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return { theme };
};

export default useThemeDetector;
