import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Crumb } from "@/lib/seo/schema";

/** Visible breadcrumb trail. Pair with `breadcrumbSchema` for structured data. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-subtle">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex min-w-0 items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="truncate font-medium text-muted">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="hover:text-foreground">
                    {c.name}
                  </Link>
                  <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
