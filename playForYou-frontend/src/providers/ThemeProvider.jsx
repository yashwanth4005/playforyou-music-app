import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
const THEME_STORAGE_KEY = "playforyou-theme";

function getInitialTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode: theme === "dark", setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
