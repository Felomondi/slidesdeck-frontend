import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function FloatingThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme") as Theme | null;
    const initialTheme = saved ?? "light";
    // Apply theme immediately on initialization
    if (typeof window !== "undefined") {
      applyTheme(initialTheme);
    }
    return initialTheme;
  });

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="fixed top-3 right-4 z-50">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle color mode"
        className="
          inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium shadow-sm
          border transition backdrop-blur
          bg-sky-100/80  border-sky-300  text-sky-900  hover:bg-sky-100/95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70
          dark:bg-sky-900/60 dark:border-sky-500/40 dark:text-sky-100 dark:hover:bg-sky-900/70
          dark:focus-visible:ring-sky-600/60
        "
      >
        {theme === "dark" ? (
          <>
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </>
        )}
      </button>
    </div>
  );
}