"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";
import { searchIndex, searchTools, type SearchItem } from "@/lib/search";

const SUGGESTED = ["percentage-calculator", "bmi-calculator", "age-calculator", "qr-code-generator", "word-counter", "password-generator"];
const suggestions = SUGGESTED.map((id) => searchIndex.find((i) => i.id === id)).filter(
  (i): i is SearchItem => Boolean(i),
);

/**
 * Combobox search over the tool index. `inline` shows results in a popover
 * (hero, 404); `panel` shows them as a list below the input (dialog).
 */
export function SearchBox({
  variant = "inline",
  autoFocus,
  onNavigate,
  size = "md",
  placeholder = "Search a calculator or tool…",
}: {
  variant?: "inline" | "panel";
  autoFocus?: boolean;
  onNavigate?: () => void;
  size?: "md" | "lg";
  placeholder?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => (query.trim() ? searchTools(query, 8) : suggestions), [query]);
  const showList = variant === "panel" || (open && (results.length > 0 || query.trim() !== ""));

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (results.length ? (a + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[active];
      if (item && (query.trim() === "" || showList)) go(item.href);
      else if (query.trim()) go(`/search?q=${encodeURIComponent(query.trim())}`);
    } else if (e.key === "Escape" && variant === "inline") {
      setOpen(false);
    }
  }

  const activeId = showList && results[active] ? `${listId}-${active}` : undefined;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search
          className={cn(
            "pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-subtle",
            size === "lg" ? "size-5" : "size-4.5",
          )}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search calculators, tools and guides"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          spellCheck={false}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          className={cn(
            "w-full rounded-2xl border border-border-strong bg-surface text-foreground shadow-soft outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 [&::-webkit-search-cancel-button]:hidden",
            size === "lg" ? "h-14 pr-4 pl-12 text-base" : "h-12 pr-4 pl-11 text-base sm:text-sm",
          )}
        />
      </div>

      {/* {showList ? (
        <div
          className={cn(
            variant === "inline" &&
              "absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-lift",
            variant === "panel" && "mt-3",
          )}
        >
          {query.trim() === "" ? (
            <p className="px-4 pt-3 pb-1 text-xs font-semibold tracking-wide text-subtle uppercase">Popular</p>
          ) : null}
          <ul id={listId} role="listbox" aria-label="Search results" className="max-h-[min(60vh,26rem)] overflow-y-auto p-2">
            {results.map((item, i) => (
              <li
                key={item.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(item.href)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5",
                  i === active ? "bg-primary-soft" : "hover:bg-surface-muted",
                )}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-primary ring-1 ring-border">
                  <Icon name={item.icon} className="size-4.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{item.title}</span>
                  <span className="block truncate text-xs text-muted">{item.description}</span>
                </span>
                <span className="hidden shrink-0 text-xs text-subtle min-[420px]:inline">{item.kind}</span>
              </li>
            ))}
          </ul>
          {query.trim() !== "" && results.length === 0 ? (
            <p className="px-4 pb-4 text-sm text-muted">
              No matches for “{query.trim()}”. Try a simpler word such as “interest”, “date” or “text”.
            </p>
          ) : null}
          {query.trim() !== "" ? (
            <Link
              href={`/search?q=${encodeURIComponent(query.trim())}`}
              onClick={() => onNavigate?.()}
              className="flex items-center justify-between border-t border-border px-4 py-3 text-sm font-medium text-primary hover:bg-surface-muted"
            >
              See all results for “{query.trim()}”
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      ) : null} */}
    </div>
  );
}
