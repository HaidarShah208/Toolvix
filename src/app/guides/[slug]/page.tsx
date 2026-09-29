import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/ad-slot";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
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
} from "@/components/tools/content-blocks";
import { FAQSection } from "@/components/tools/faq-section";
import { RelatedGuides, RelatedTools } from "@/components/tools/related";
import { Icon } from "@/components/ui/icon";
import { getGuideMeta, guideHref, guides } from "@/config/guides";
import { getTool, toolHref } from "@/config/tools";
import { getGuide } from "@/data/guides";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema, faqSchema, graph, webPageSchema } from "@/lib/seo/schema";
import type { Guide, Tool } from "@/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideMeta(slug);
  if (!guide) return {};
  return buildMetadata({
    title: guide.seoTitle,
    description: guide.description,
    path: guideHref(slug),
    type: "article",
    publishedTime: guide.published,
    modifiedTime: guide.updated,
    defaultImage: false,
  });
}

function readingMinutes(guide: Guide): number {
  const text = [
    guide.directAnswer,
    guide.intro,
    ...guide.steps,
    ...(guide.examples ?? []).flatMap((e) => [e.title, ...e.steps, e.result]),
    ...guide.sections.flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.list ?? [])]),
    ...guide.faqs.flatMap((f) => [f.question, f.answer]),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 230));
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const path = guideHref(slug);
  const tools = guide.relatedTools.map(getTool).filter((t): t is Tool => Boolean(t));
  const primaryTool = tools[0];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path },
  ];
  const toc = [
    { id: "steps", label: "Step by step" },
    ...(guide.formulas?.length ? [{ id: "formula", label: "Formula" }] : []),
    ...(guide.examples?.length ? [{ id: "examples", label: "Examples" }] : []),
    ...guide.sections.map((s) => ({ id: slugify(s.heading), label: s.heading })),
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: guide.seoTitle, description: guide.description, path }),
          breadcrumbSchema(crumbs),
          articleSchema(guide, path),
          faqSchema(guide.faqs),
        )}
      />
      <div className="container-page pt-6 pb-4 sm:pt-8">
        <Breadcrumbs items={crumbs} />
        <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="min-w-0 space-y-12">
            <header className="space-y-5">
              <h1 className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl">
                {guide.title}
              </h1>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-subtle">
                <li className="flex items-center gap-1.5">
                  <CalendarDays className="size-4" aria-hidden="true" />
                  Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
                </li>
                <li className="flex items-center gap-1.5">
                  <Clock className="size-4" aria-hidden="true" />
                  {readingMinutes(guide)} min read
                </li>
              </ul>
              <DirectAnswer label="Short answer">{guide.directAnswer}</DirectAnswer>
              <Paragraphs items={[guide.intro]} />
            </header>

            <section aria-labelledby="steps" className="space-y-4">
              <SectionHeading id="steps">Step by step</SectionHeading>
              <StepList steps={guide.steps} />
            </section>

            {guide.formulas?.length ? (
              <section aria-labelledby="formula" className="space-y-4">
                <SectionHeading id="formula">{guide.formulas.length > 1 ? "Formulas" : "Formula"}</SectionHeading>
                <div className="grid gap-4">
                  {guide.formulas.map((f) => (
                    <FormulaBlock key={f.label} formula={f} />
                  ))}
                </div>
              </section>
            ) : null}

            {primaryTool ? <ToolCallout tool={primaryTool} /> : null}

            {guide.examples?.length ? (
              <section aria-labelledby="examples" className="space-y-4">
                <SectionHeading id="examples">Worked examples</SectionHeading>
                <div className="grid gap-4 md:grid-cols-2">
                  {guide.examples.map((ex) => (
                    <ExampleBlock key={ex.title} example={ex} />
                  ))}
                </div>
              </section>
            ) : null}

            <ContentSections sections={guide.sections} />

            <AdSlot slot="inContent" />

            <FAQSection faqs={guide.faqs} />

            {guide.disclaimer ? <Disclaimer>{guide.disclaimer}</Disclaimer> : null}
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
              {tools.length ? (
                <div className="border-t border-border pt-5">
                  <p className="text-sm font-semibold text-foreground">Tools for this guide</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {tools.map((t) => (
                      <li key={t.id}>
                        <Link href={toolHref(t)} className="flex items-center gap-2 text-muted hover:text-foreground">
                          <Icon name={t.icon} className="size-4 text-primary" />
                          {t.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>
        </div>

        <div className="mt-16 space-y-14">
          <RelatedTools tools={tools} title="Related tools" />
          <RelatedGuides slugs={guide.relatedGuides} title="Keep reading" />
        </div>
      </div>
    </>
  );
}

function ToolCallout({ tool }: { tool: Tool }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft sm:flex-row sm:items-center">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
        <Icon name={tool.icon} className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-foreground">Skip the arithmetic</p>
        <p className="mt-0.5 text-sm text-muted">{tool.description}</p>
      </div>
      <Link
        href={toolHref(tool)}
        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
      >
        Open {tool.name}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
