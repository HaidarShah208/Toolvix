import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { getGuideMeta } from "@/config/guides";
import {
  categories,
  getPopularTools,
  getToolsByCategory,
  groupLabels,
  groupTools,
  toolHref,
} from "@/config/tools";
import { breadcrumbSchema, faqSchema, graph, itemListSchema, webPageSchema } from "@/lib/seo/schema";
import type { FAQ, GuideMeta, ToolCategory } from "@/types";
import { Paragraphs, SectionHeading } from "./content-blocks";
import { FAQSection } from "./faq-section";
import { GuideGrid, ToolGrid } from "./tool-card";

export interface CategoryPageCopy {
  title: string;
  description: string;
  h1: string;
  intro: string[];
  guideSlugs: string[];
  faqs: FAQ[];
}

export function CategoryPage({ category, copy }: { category: ToolCategory; copy: CategoryPageCopy }) {
  const info = categories[category];
  const all = getToolsByCategory(category);
  const featured = getPopularTools(category);
  const groups = groupTools(all);
  const other = category === "calculators" ? "tools" : "calculators";
  const otherInfo = categories[other];
  const guides = copy.guideSlugs.map(getGuideMeta).filter((g): g is GuideMeta => Boolean(g));
  const crumbs = [
    { name: "Home", path: "/" },
    { name: info.shortName, path: info.href },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: copy.title, description: copy.description, path: info.href, type: "CollectionPage" }),
          breadcrumbSchema(crumbs),
          itemListSchema(
            info.name,
            all.map((t) => ({ name: t.name, path: toolHref(t) })),
          ),
          faqSchema(copy.faqs),
        )}
      />
      <div className="container-page pt-6 sm:pt-8">
        <Breadcrumbs items={crumbs} />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{copy.h1}</h1>
          <div className="mt-4 text-lg">
            <Paragraphs items={copy.intro} />
          </div>
        </header>

        {/* Jump links to each group */}
        <nav aria-label={`${info.shortName} categories`} className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {groups.map(({ group, tools }) => (
              <li key={group}>
                <a
                  href={`#${group}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-surface-muted"
                >
                  {groupLabels[group].name}
                  <span className="tabular text-xs text-subtle">{tools.length}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 space-y-16">
          <section aria-labelledby="featured" className="space-y-4">
            <SectionHeading id="featured">Most used</SectionHeading>
            <ToolGrid tools={featured} />
          </section>

          <section aria-labelledby="all" className="space-y-10">
            <SectionHeading id="all">All {info.shortName.toLowerCase()}</SectionHeading>
            {groups.map(({ group, tools }) => (
              <div key={group} id={group} className="scroll-mt-24 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{groupLabels[group].name}</h3>
                  <p className="text-sm text-muted">{groupLabels[group].description}</p>
                </div>
                <ToolGrid tools={tools} compact />
              </div>
            ))}
          </section>

          {guides.length ? (
            <section aria-labelledby="guides" className="space-y-4">
              <SectionHeading id="guides">Helpful guides</SectionHeading>
              <GuideGrid guides={guides} />
            </section>
          ) : null}

          <FAQSection faqs={copy.faqs} />

          <section
            aria-labelledby="explore-other"
            className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="max-w-xl">
              <h2 id="explore-other" className="text-lg font-semibold text-foreground">
                Looking for {otherInfo.name.toLowerCase()}?
              </h2>
              <p className="mt-1 text-sm text-muted">{otherInfo.description}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {getPopularTools(other)
                  .slice(0, 4)
                  .map((t) => (
                    <li key={t.id}>
                      <Link
                        href={toolHref(t)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-1.5 text-sm text-foreground hover:bg-border"
                      >
                        <Icon name={t.icon} className="size-3.5 text-primary" />
                        {t.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <Link
              href={otherInfo.href}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border-strong px-4 text-sm font-medium text-foreground hover:bg-surface-muted"
            >
              Browse {otherInfo.shortName.toLowerCase()}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>
    </>
  );
}
