"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { THEME_STORAGE_KEY as KEY } from "@/lib/theme";

type Theme = "light" | "dark" | "system";
const listeners = new Set<() => void>();

function readTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(theme: Theme) {
  const dark =
    theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (readTheme() === "system") applyTheme("system");
    cb();
  };
  mq.addEventListener("change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(cb);
    mq.removeEventListener("change", onChange);
    window.removeEventListener("storage", onChange);
  };
}

const order: Theme[] = ["light", "dark", "system"];
const labels: Record<Theme, string> = { light: "Light", dark: "Dark", system: "System" };

/** Cycles light → dark → system. The initial class is set by an inline script in the layout. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);

  function cycle() {
    const next = order[(order.indexOf(theme) + 1) % order.length];
    try {
      if (next === "system") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      // Storage may be unavailable (private mode); the theme still applies for this page view.
    }
    applyTheme(next);
    listeners.forEach((l) => l());
  }

  const IconCmp = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={`Theme: ${labels[theme]}. Switch to ${labels[order[(order.indexOf(theme) + 1) % order.length]]}`}
      title={`Theme: ${labels[theme]}`}
    >
      <IconCmp />
    </Button>
  );
}
