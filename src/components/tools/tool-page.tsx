import { ArrowRight, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Icon } from "@/components/ui/icon";
import { categories, getRelatedTools, groupLabels, toolHref } from "@/config/tools";
import { breadcrumbSchema, faqSchema, graph, toolSchema, webPageSchema, type Crumb } from "@/lib/seo/schema";
import type { Tool, ToolContent } from "@/types";
import {
  ContentSections,
  DirectAnswer,
  Disclaimer,
  ExampleBlock,
  FormulaBlock,
  Paragraphs,
  SectionHeading,
  slugify,
  StepList,
} from "./content-blocks";
import { FAQSection } from "./faq-section";
import { RelatedGuides, RelatedTools } from "./related";
import { widgets } from "./widgets";

export function ToolPage({ tool, content }: { tool: Tool; content: ToolContent }) {
  const category = categories[tool.category];
  const path = toolHref(tool);
  const Widget = widgets[tool.id];
  const related = getRelatedTools(tool, 6);
  const lowerName = tool.name.charAt(0) + tool.name.slice(1).toLowerCase();

  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: category.shortName, path: category.href },
    { name: tool.name, path },
  ];

  const toc: { id: string; label: string }[] = [
    { id: "how-to-use", label: "How to use" },
    { id: "how-it-works", label: "How it works" },
    ...(content.formulas?.length ? [{ id: "formula", label: content.formulas.length > 1 ? "Formulas" : "Formula" }] : []),
    ...(content.examples?.length ? [{ id: "examples", label: "Examples" }] : []),
    ...(content.sections ?? []).map((s) => ({ id: slugify(s.heading), label: s.heading })),
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: tool.seoTitle, description: tool.seoDescription, path }),
          breadcrumbSchema(crumbs),
          toolSchema(tool, path),
          faqSchema(content.faqs),
        )}
      />
      <div className="container-page pt-6 pb-4 sm:pt-8">
        <Breadcrumbs items={crumbs} />

        <header className="mt-6 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
              <Icon name={tool.icon} className="size-5.5" />
            </span>
            <Link
              href={category.href}
              className="text-sm font-medium text-muted hover:text-foreground"
            >
              {groupLabels[tool.group].name} {tool.category === "calculators" ? "calculator" : "tool"}
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
            {tool.name}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{content.intro}</p>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <li className="flex items-center gap-1.5">
              <Zap className="size-4 text-primary" aria-hidden="true" /> Free, no sign-up
            </li>
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-success" aria-hidden="true" /> Processed in your browser
            </li>
          </ul>
        </header>

        <div className="mt-6 max-w-3xl">
          <DirectAnswer>{content.directAnswer}</DirectAnswer>
        </div>

        <div className="mt-6">{Widget ? <Widget /> : null}</div>

        <AdSlot slot="belowTool" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="min-w-0 space-y-12">
            <section aria-labelledby="how-to-use" className="space-y-4">
              <SectionHeading id="how-to-use">How to use the {lowerName}</SectionHeading>
              <StepList steps={content.howToUse} />
            </section>

            <section aria-labelledby="how-it-works" className="space-y-4">
              <SectionHeading id="how-it-works">How it works</SectionHeading>
              <Paragraphs items={content.howItWorks} />
            </section>

            {content.formulas?.length ? (
              <section aria-labelledby="formula" className="space-y-4">
                <SectionHeading id="formula">{content.formulas.length > 1 ? "Formulas" : "Formula"}</SectionHeading>
                <div className="grid gap-4">
                  {content.formulas.map((f) => (
                    <FormulaBlock key={f.label} formula={f} />
                  ))}
                </div>
              </section>
            ) : null}

            {content.examples?.length ? (
              <section aria-labelledby="examples" className="space-y-4">
                <SectionHeading id="examples">Worked examples</SectionHeading>
                <div className="grid gap-4 md:grid-cols-2">
                  {content.examples.map((ex) => (
                    <ExampleBlock key={ex.title} example={ex} />
                  ))}
                </div>
              </section>
            ) : null}

            {content.sections?.length ? <ContentSections sections={content.sections} /> : null}

            <AdSlot slot="inContent" />

            <FAQSection faqs={content.faqs} />

            {content.disclaimer ? <Disclaimer>{content.disclaimer}</Disclaimer> : null}
          </article>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start" aria-label="On this page">
            <div className="space-y-6 rounded-2xl border border-border bg-surface p-5">
              <nav aria-label="Table of contents">
                <p className="text-sm font-semibold text-foreground">On this page</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-muted hover:text-foreground">
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t border-border pt-5">
                <p className="text-sm font-semibold text-foreground">Related</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {related.slice(0, 4).map((t) => (
                    <li key={t.id}>
                      <Link href={toolHref(t)} className="text-muted hover:text-foreground">
                        {t.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={category.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  All {category.shortName.toLowerCase()}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 space-y-14">
          <RelatedTools tools={related} title={tool.category === "calculators" ? "Related calculators" : "Related tools"} />
          <RelatedGuides slugs={tool.relatedGuides} />
        </div>
      </div>
    </>
  );
}
