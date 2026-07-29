import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "gold" | "light" | "silver";

const STORAGE_KEY = "desmohair-theme";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as Theme;
        if (stored && (stored === "light" || stored === "gold" || stored === "silver")) {
          return stored;
        }
      } catch (e) {
        console.error("Error reading localStorage:", e);
      }
    }
    return "light";
  });

  useEffect(() => {
    const applyTheme = () => {
      if (typeof document !== "undefined") {
        const body = document.body;
        
        // Remove all theme classes
        body.classList.remove("theme-light", "theme-gold", "theme-silver");
        
        // Add current theme class
        body.classList.add(`theme-${theme}`);
        
        // Save to localStorage
        try {
          localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
      }
    };

    applyTheme();
  }, [theme]);

  const setTheme = (next: Theme) => {
    console.log("Setting theme to:", next);
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
