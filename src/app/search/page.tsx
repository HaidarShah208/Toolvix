import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { LoadingState } from "@/components/ui/states";
import { buildMetadata } from "@/lib/seo/metadata";
import { SearchResults } from "./search-results";

// Search result pages are thin and duplicate-prone, so they are kept out of the index.
export const metadata = buildMetadata({
  title: "Search Calculators & Tools",
  description: "Search every calculator, online tool and guide on Toolora by name, topic or keyword.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <div className="container-page pt-6 sm:pt-8">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Search", path: "/search" },
        ]}
      />
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Search</h1>
      <p className="mt-2 text-muted">Find a calculator, tool or guide by name, topic or keyword.</p>
      <div className="mt-6">
        <Suspense fallback={<LoadingState label="Loading search…" />}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
