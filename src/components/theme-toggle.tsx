"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="h-9 w-9 rounded-full bg-muted border border-border flex items-center justify-center opacity-70">
        <span className="sr-only">Carregando tema</span>
      </button>
    );
  }

  const isDark = resolvedTheme === "dark" || theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 rounded-full bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 border border-slate-300 dark:border-white/10 flex items-center justify-center transition-all cursor-pointer shadow-sm"
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-[#ccff00]" />
      ) : (
        <Moon className="h-4 w-4 text-emerald-800" />
      )}
    </button>
  );
}
