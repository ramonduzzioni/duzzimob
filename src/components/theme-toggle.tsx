"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-70">
        <span className="sr-only">Carregando tema</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-9 w-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-foreground transition-all cursor-pointer"
      title="Alternar tema"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 text-[#ccff00]" />
      ) : (
        <Moon className="h-4 w-4 text-emerald-700" />
      )}
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
