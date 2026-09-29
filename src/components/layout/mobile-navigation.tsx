"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/types";
import { MobileNavLinks } from "./nav-links";

export interface MobileQuickLink {
  href: string;
  name: string;
  icon: IconName;
}

export function MobileNavigation({ quickLinks }: { quickLinks: MobileQuickLink[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close when the route changes (e.g. browser back).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    // Close if the viewport grows past the breakpoint where the desktop nav shows.
    const mq = window.matchMedia("(min-width: 64rem)");
    const onResize = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  const panel = (
    <div
      id={panelId}
      className="fixed inset-x-0 top-16 bottom-0 z-50 overflow-y-auto border-t border-border bg-background lg:hidden"
    >
      <nav aria-label="Mobile" className="container-page flex flex-col gap-6 py-6">
        <MobileNavLinks onNavigate={() => setOpen(false)} />
        <div>
          <p className="px-4 text-xs font-semibold tracking-wide text-subtle uppercase">Popular</p>
          <ul className="mt-2 grid grid-cols-1 gap-1 min-[400px]:grid-cols-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-surface-muted"
                >
                  <Icon name={l.icon} className="size-4 text-primary" />
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );

  return (
    <div className="lg:hidden">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <X /> : <Menu />}
      </Button>
      {/* Portaled to <body>: the header's backdrop-filter would otherwise become the
          containing block for this fixed panel and collapse it to zero height. */}
      {open ? createPortal(panel, document.body) : null}
    </div>
  );
}
