"use client";

import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "studio-theme";

/**
 * Light/dark toggle. The icons are shown/hidden purely with CSS
 * (`dark:hidden` / `hidden dark:block`), so server and client markup always
 * match — the `.dark` class on <html> is set before paint by the inline
 * script in the root layout.
 */
export default function ThemeToggle() {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // Storage unavailable (e.g. private mode) — theme still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="rounded-lg border border-border p-2 text-foreground transition hover:bg-muted"
    >
      <Sun className="h-4 w-4 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-4 w-4 dark:block" aria-hidden="true" />
    </button>
  );
}
