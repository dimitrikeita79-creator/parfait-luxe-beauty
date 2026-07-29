import { createContext, useContext, useEffect, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region src/context/ThemeContext.tsx
var STORAGE_KEY = "desmohair-theme";
var ThemeContext = createContext(void 0);
function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState(() => {
		if (typeof window !== "undefined") try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored && (stored === "light" || stored === "gold" || stored === "silver")) return stored;
		} catch (e) {
			console.error("Error reading localStorage:", e);
		}
		return "light";
	});
	useEffect(() => {
		const applyTheme = () => {
			if (typeof document !== "undefined") {
				const body = document.body;
				body.classList.remove("theme-light", "theme-gold", "theme-silver");
				body.classList.add(`theme-${theme}`);
				try {
					localStorage.setItem(STORAGE_KEY, theme);
				} catch (e) {
					console.error("Error saving to localStorage:", e);
				}
			}
		};
		applyTheme();
	}, [theme]);
	const setTheme = (next) => {
		console.log("Setting theme to:", next);
		setThemeState(next);
	};
	return /* @__PURE__ */ jsx(ThemeContext.Provider, {
		value: {
			theme,
			setTheme
		},
		children
	});
}
function useTheme() {
	const ctx = useContext(ThemeContext);
	if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
	return ctx;
}
//#endregion
export { useTheme as n, ThemeProvider as t };
