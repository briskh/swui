import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "./components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./components/dropdown-menu";

export type Theme = "light" | "dark";
export type ThemePreference = "system" | Theme;

export const THEME_STORAGE_KEY = "swui-theme-preference";

/** Place this inline in the document head before the application bundle to prevent a theme flash. */
export const themeInitializationScript = `(function(){try{var key=${JSON.stringify(THEME_STORAGE_KEY)};var preference=localStorage.getItem(key);var theme=preference==='light'||preference==='dark'?preference:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var root=document.documentElement;root.dataset.theme=theme;root.classList.toggle('dark',theme==='dark');root.style.colorScheme=theme}catch(_){}})();`;

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readPreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

type ThemeContextValue = {
  theme: Theme;
  preference: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(() => (typeof window === "undefined" ? "system" : readPreference()));
  const [theme, setResolvedTheme] = useState<Theme>(() => (typeof window === "undefined" ? "light" : preference === "system" ? getSystemTheme() : preference));

  useEffect(() => {
    const resolved = preference === "system" ? getSystemTheme() : preference;
    setResolvedTheme(resolved);
    applyTheme(resolved);
    try {
      if (preference === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {}
  }, [preference]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (preference !== "system") return;
      const nextTheme = getSystemTheme();
      setResolvedTheme(nextTheme);
      applyTheme(nextTheme);
    };
    const onStorage = (event: StorageEvent) => event.key === THEME_STORAGE_KEY && setPreference(event.newValue === "light" || event.newValue === "dark" ? event.newValue : "system");
    query.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => { query.removeEventListener("change", onSystemChange); window.removeEventListener("storage", onStorage); };
  }, [preference]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      setTheme: setPreference
    }),
    [preference, theme]
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

export function ThemeControl() {
  const { preference, setTheme } = useTheme();
  const Icon = preference === "system" ? Monitor : preference === "dark" ? Moon : Sun;
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" aria-label="选择主题"><Icon aria-hidden="true" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="min-w-36"><DropdownMenuRadioGroup value={preference} onValueChange={(value) => setTheme(value as ThemePreference)}><DropdownMenuRadioItem value="system"><Monitor className="mr-2 size-4" aria-hidden="true" />跟随系统</DropdownMenuRadioItem><DropdownMenuRadioItem value="light"><Sun className="mr-2 size-4" aria-hidden="true" />浅色</DropdownMenuRadioItem><DropdownMenuRadioItem value="dark"><Moon className="mr-2 size-4" aria-hidden="true" />深色</DropdownMenuRadioItem></DropdownMenuRadioGroup></DropdownMenuContent></DropdownMenu>;
}
