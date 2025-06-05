import { create } from "zustand";

export const useThemeStore = create((_set, get) => {
  const defaultTheme = "dark";
  const saved =
    typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
  const initialTheme = saved || defaultTheme;

  if (typeof document !== "undefined") {
    document.documentElement.classList.add(initialTheme);
  }

  return {
    theme: initialTheme,
    toggleTheme: () => {
      const newTheme = get().theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newTheme);
    },
  };
});
