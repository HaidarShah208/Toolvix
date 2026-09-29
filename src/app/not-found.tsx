import type { Metadata } from "next";
import { SearchBox } from "@/components/layout/search-box";
import { SectionHeading } from "@/components/tools/content-blocks";
import { ToolGrid } from "@/components/tools/tool-card";
import { ButtonLink } from "@/components/ui/button";
import { categories, getPopularTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="container-page pt-12 sm:pt-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">Error 404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-3 text-muted">
          The link may be out of date or mistyped. Search for the tool you need, or pick one of the popular ones below.
        </p>
        <div className="mx-auto mt-8 max-w-xl text-left">
          <SearchBox size="lg" />
        </div>
        <div className="mt-6 flex flex-col justify-center gap-3 min-[420px]:flex-row">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href={categories.calculators.href} variant="outline">
            All calculators
          </ButtonLink>
          <ButtonLink href={categories.tools.href} variant="outline">
            All tools
          </ButtonLink>
        </div>
      </div>
      <section aria-labelledby="popular-404" className="mt-16 space-y-5">
        <SectionHeading id="popular-404">Popular tools</SectionHeading>
        <ToolGrid tools={getPopularTools().slice(0, 8)} />
      </section>
    </div>
  );
}
