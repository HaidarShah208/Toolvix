"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBox } from "./search-box";

/** Site-wide search in a modal <dialog>. Opens with the header button, Ctrl/⌘ + K or "/". */
export function SearchDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K /"
        className="h-10 w-10 justify-center px-0 text-muted md:w-56 md:justify-start md:px-3"
      >
        <Search />
        <span className="hidden md:inline">Search tools…</span>
        <span className="sr-only md:hidden">Search</span>
      </Button>
      <dialog
        ref={ref}
        aria-label="Search"
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === ref.current) setOpen(false);
        }}
        className="m-0 mx-auto mt-[8vh] w-[calc(100%-2rem)] max-w-xl rounded-2xl border border-border bg-surface p-0 text-foreground shadow-lift backdrop:bg-slate-950/50 backdrop:backdrop-blur-[2px]"
      >
        {open ? (
          <div className="p-4 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold">Search Toolora</h2>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close search">
                <X />
              </Button>
            </div>
            <SearchBox variant="panel" autoFocus onNavigate={() => setOpen(false)} />
          </div>
        ) : null}
      </dialog>
    </>
  );
}
