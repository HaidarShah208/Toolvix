"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/states";
import { searchTools } from "@/lib/search";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [lastInitial, setLastInitial] = useState(initial);

  // Keep the box in sync when the URL changes (e.g. header search, back button).
  if (initial !== lastInitial) {
    setLastInitial(initial);
    setQuery(initial);
  }

  const results = useMemo(() => searchTools(query, 50), [query]);

  function update(value: string) {
    setQuery(value);
    const q = value.trim();
    router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="relative max-w-2xl">
        <label htmlFor="search-page-input" className="sr-only">
          Search calculators, tools and guides
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-subtle" aria-hidden="true" />
        <input
          id="search-page-input"
          type="search"
          value={query}
          onChange={(e) => update(e.target.value)}
          placeholder="e.g. percentage, interest, text, image"
          autoComplete="off"
          className="h-14 w-full rounded-2xl border border-border-strong bg-surface pr-4 pl-12 text-base text-foreground shadow-soft outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20"
        />
      </form>

      <p className="text-sm text-muted" aria-live="polite">
        {query.trim()
          ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${query.trim()}”`
          : "Type to search all calculators, tools and guides."}
      </p>

      {query.trim() && results.length === 0 ? (
        <EmptyState title="No matching tools">
          Try a broader word such as “interest”, “convert”, “date” or “text”, or browse{" "}
          <Link href="/calculators" className="text-primary underline underline-offset-4">
            calculators
          </Link>{" "}
          and{" "}
          <Link href="/tools" className="text-primary underline underline-offset-4">
            tools
          </Link>
          .
        </EmptyState>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                href={r.href}
                className="flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-4 hover:border-primary/40 hover:bg-surface-muted"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
                  <Icon name={r.icon} className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-foreground">{r.title}</span>
                    <span className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-muted ring-1 ring-border">
                      {r.kind}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm text-muted">{r.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
