import { ArrowRight, Gauge, Gift, MousePointerClick, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SearchBox } from "@/components/layout/search-box";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/tools/content-blocks";
import { FAQSection } from "@/components/tools/faq-section";
import { GuideGrid, ToolGrid } from "@/components/tools/tool-card";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { getPopularGuides } from "@/config/guides";
import { siteConfig } from "@/config/site";
import { categories, getTool, getToolsByCategory, toolHref } from "@/config/tools";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqSchema, graph, organizationSchema, webPageSchema, websiteSchema } from "@/lib/seo/schema";
import type { FAQ, Tool, ToolCategory } from "@/types";

export const metadata = buildMetadata({
  title: `${siteConfig.name} – Free Calculators & Online Tools`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
  defaultImage: false,
});

const POPULAR = [
  "age-calculator",
  "percentage-calculator",
  "bmi-calculator",
  "gpa-calculator",
  "loan-calculator",
  "qr-code-generator",
  "word-counter",
  "password-generator",
];

const TRY = ["bmi-calculator", "percentage-calculator", "qr-code-generator"];

const benefits = [
  {
    icon: Gauge,
    title: "Fast",
    text: "Results update as you type. Pages are lightweight and each tool loads only the code it needs.",
  },
  {
    icon: Gift,
    title: "Free",
    text: "Every calculator and tool is free to use, with no account, trial or usage limit.",
  },
  {
    icon: MousePointerClick,
    title: "Easy to use",
    text: "Clear labels, sensible defaults and the working shown next to each answer, on any screen size.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-friendly",
    text: "Your numbers, text and images are processed in your browser and never uploaded to our servers.",
  },
];

const faqs: FAQ[] = [
  {
    question: `What is ${siteConfig.name}?`,
    answer: `${siteConfig.name} is a collection of free online calculators and everyday tools, from percentage and loan calculators to word counters, QR code generators and image resizers.`,
  },
  {
    question: "Do I need to create an account?",
    answer: "No. Every tool works immediately in your browser without signing up.",
  },
  {
    question: "Is my data sent to a server?",
    answer:
      "No. Calculations, text tools, image tools and generators all run locally on your device. We don't receive or store what you type or upload.",
  },
  {
    question: "How are the results calculated?",
    answer:
      "Each tool uses the standard formula for its task, and the page explains it with worked examples. Financial and health tools give estimates based on the assumptions shown.",
  },
  {
    question: "Can I use the tools on mobile?",
    answer: "Yes. The site is designed for phones first and works on tablets and desktops too.",
  },
];

const categoryBlurbs: Record<ToolCategory, { featured: string[]; blurb: string }> = {
  calculators: {
    featured: ["percentage-calculator", "gpa-calculator", "loan-calculator", "compound-interest-calculator", "bmi-calculator", "date-difference-calculator"],
    blurb:
      "Percentages, grades, loans, interest, health and dates. Each calculator shows the formula and the steps behind your answer.",
  },
  tools: {
    featured: ["word-counter", "qr-code-generator", "password-generator", "unit-converter", "image-resizer", "json-formatter"],
    blurb:
      "Text, image, conversion and developer utilities that run on your device, so nothing you paste or upload leaves your browser.",
  },
};

function pick(ids: string[]): Tool[] {
  return ids.map(getTool).filter((t): t is Tool => Boolean(t));
}

export default function HomePage() {
  const popular = pick(POPULAR);
  const tryTools = pick(TRY);
  const counts = {
    calculators: getToolsByCategory("calculators").length,
    tools: getToolsByCategory("tools").length,
  };

  return (
    <>
      <JsonLd
        data={graph(
          websiteSchema(),
          organizationSchema(),
          webPageSchema({ name: `${siteConfig.name} – Free Calculators & Online Tools`, description: siteConfig.description, path: "/" }),
          faqSchema(faqs),
        )}
      />

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <div className="bg-grid absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="container-page py-14 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted shadow-sm">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              {counts.calculators} calculators · {counts.tools} tools · no sign-up
            </p>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              Free Calculators &amp; Online Tools
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted">
              Calculate, convert, generate and simplify everyday tasks with fast, free online tools.
            </p>
            <div className="mx-auto mt-8 max-w-xl text-left">
              <SearchBox size="lg" />
              <p className="mt-3 text-center text-sm text-subtle">
                Try:{" "}
                {tryTools.map((t, i) => (
                  <span key={t.id}>
                    <Link href={toolHref(t)} className="text-muted underline decoration-border-strong underline-offset-4 hover:text-foreground">
                      {t.name.replace(" Generator", " generator").replace(" Calculator", " calculator")}
                    </Link>
                    {i < tryTools.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
            <div className="mt-8 flex flex-col justify-center gap-3 min-[420px]:flex-row">
              <ButtonLink href="/calculators" size="lg">
                Explore Calculators
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href="/tools" size="lg" variant="outline">
                Browse All Tools
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page mt-16 space-y-20 sm:mt-20 sm:space-y-24">
        {/* Popular tools */}
        <section aria-labelledby="popular" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionHeading id="popular">Popular tools</SectionHeading>
              <p className="mt-1 text-muted">The calculators and utilities people use most.</p>
            </div>
          </div>
          <ToolGrid tools={popular} />
        </section>

        {/* Categories */}
        <section aria-labelledby="categories" className="space-y-6">
          <SectionHeading id="categories">Browse by category</SectionHeading>
          <div className="grid gap-5 lg:grid-cols-2">
            {(["calculators", "tools"] as const).map((cat) => {
              const info = categories[cat];
              const items = pick(categoryBlurbs[cat].featured);
              return (
                <div key={cat} className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft sm:p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon name={cat === "calculators" ? "calculator" : "wrench"} className="size-5.5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{info.name}</h3>
                      <p className="text-sm text-subtle">{counts[cat]} available</p>
                    </div>
                  </div>
                  <p className="mt-4 leading-relaxed text-muted">{categoryBlurbs[cat].blurb}</p>
                  <ul className="mt-5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
                    {items.map((t) => (
                      <li key={t.id}>
                        <Link
                          href={toolHref(t)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground hover:bg-surface-muted"
                        >
                          <Icon name={t.icon} className="size-4 shrink-0 text-primary" />
                          <span className="min-w-0">{t.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={info.href} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    View all {info.shortName.toLowerCase()}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why */}
        <section aria-labelledby="why" className="space-y-6">
          <div className="max-w-2xl">
            <SectionHeading id="why">Why use {siteConfig.name}</SectionHeading>
            <p className="mt-1 text-muted">Simple tools that do one job well and respect your privacy.</p>
          </div>
          <ul className="grid gap-4 min-[500px]:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <li key={b.title} className="rounded-2xl border border-border bg-surface p-5">
                <b.icon className="size-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-semibold text-foreground">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Guides */}
        <section aria-labelledby="guides" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <SectionHeading id="guides">Popular guides</SectionHeading>
              <p className="mt-1 text-muted">Understand the math behind the answer.</p>
            </div>
            <Link href="/guides" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              All guides
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <GuideGrid guides={getPopularGuides().slice(0, 6)} />
        </section>

        <div className="mx-auto max-w-3xl">
          <FAQSection faqs={faqs} />
        </div>
      </div>
    </>
  );
}
