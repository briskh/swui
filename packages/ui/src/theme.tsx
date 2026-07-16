import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme: "light",
      setTheme: () => undefined
    }),
    []
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("Theme context is missing");
  }
  return value;
}

/** Theme switching is disabled; the app uses light mode only. */
export function ThemeControl(_props: { compact?: boolean }) {
  return null;
}
