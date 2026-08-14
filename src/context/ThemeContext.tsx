import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "gold" | "silver" | "green" | "red";

const STORAGE_KEY = "desmohair-theme";
const THEMES: Theme[] = ["light", "gold", "silver", "green", "red"];

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Deterministic on first render (matches SSR). The stored theme is read
  // after mount so client/server hydration never mismatch.
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && THEMES.includes(stored)) {
        setThemeState(stored);
      }
    } catch (e) {
      console.error("Error reading localStorage:", e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const body = document.body;

    body.classList.remove("theme-light", "theme-gold", "theme-silver", "theme-green", "theme-red", "theme-dark");
    root.classList.remove("dark");

    body.classList.add(`theme-${theme}`);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
