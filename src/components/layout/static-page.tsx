import type { ReactNode } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, graph, webPageSchema } from "@/lib/seo/schema";
import { Breadcrumbs } from "./breadcrumbs";

export function StaticPage({
  title,
  description,
  path,
  intro,
  updated,
  schemaType = "WebPage",
  children,
}: {
  title: string;
  description: string;
  path: string;
  intro?: ReactNode;
  updated?: string;
  schemaType?: "WebPage" | "AboutPage" | "ContactPage";
  children: ReactNode;
}) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: title, path },
  ];
  return (
    <>
      <JsonLd data={graph(webPageSchema({ name: title, description, path, type: schemaType }), breadcrumbSchema(crumbs))} />
      <div className="container-page pt-6 sm:pt-8">
        <Breadcrumbs items={crumbs} />
        <article className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
          {updated ? (
            <p className="mt-3 text-sm text-subtle">
              Last updated <time dateTime={updated}>{updated}</time>
            </p>
          ) : null}
          {intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p> : null}
          <div className="prose-content mt-8">{children}</div>
        </article>
      </div>
    </>
  );
}
