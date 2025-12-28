"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const current = resolvedTheme || theme;

  const toggle = () => {
    // add a temporary class to body to enable CSS transition
    if (typeof document !== "undefined") {
      const el = document.body;
      el.classList.add("theme-transition");
      // remove class after the transition duration plus small buffer
      window.setTimeout(() => el.classList.remove("theme-transition"), 300);
    }

    if (current === "dark") setTheme("light");
    else setTheme("dark");
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label="Toggle theme">
      {current === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  );
}

export default ThemeToggle;
