import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { GuideGrid } from "@/components/tools/tool-card";
import { SectionHeading } from "@/components/tools/content-blocks";
import { FAQSection } from "@/components/tools/faq-section";
import { guideHref, guides } from "@/config/guides";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema, graph, itemListSchema, webPageSchema } from "@/lib/seo/schema";
import type { FAQ, GuideMeta } from "@/types";

const title = "Calculation Guides – Formulas Explained Step by Step";
const description =
  "Plain-English guides to percentages, GPA, BMI, interest, loan payments, calories and more, each with formulas, worked examples and a matching calculator.";

export const metadata = buildMetadata({ title, description, path: "/guides" });

const topics: { name: string; slugs: string[] }[] = [
  {
    name: "Math & money",
    slugs: [
      "how-to-calculate-percentage",
      "how-to-calculate-discount",
      "how-to-calculate-simple-interest",
      "how-to-calculate-compound-interest",
      "how-to-calculate-loan-payment",
    ],
  },
  { name: "School & university", slugs: ["how-to-calculate-gpa", "how-to-calculate-cgpa"] },
  { name: "Health", slugs: ["how-to-calculate-bmi", "how-to-calculate-daily-calories"] },
  {
    name: "Everyday",
    slugs: ["how-to-calculate-age", "how-to-convert-celsius-to-fahrenheit", "how-to-create-a-strong-password"],
  },
];

const faqs: FAQ[] = [
  {
    question: "Who writes these guides?",
    answer:
      "The guides are written and reviewed by the Toolora team. Each one explains the standard formula, walks through examples with the numbers shown, and links to a calculator that does the same arithmetic.",
  },
  {
    question: "Can I use the formulas for homework or work?",
    answer:
      "Yes. The formulas are the standard ones taught in schools and used in finance and health. For graded work or official figures, follow the exact method your teacher, school or provider specifies.",
  },
  {
    question: "Why do some guides include a disclaimer?",
    answer:
      "Health and finance results depend on personal circumstances, so those guides explain the general method and recommend confirming decisions with a qualified professional or your lender.",
  },
];

export default function GuidesPage() {
  const bySlug = new Map(guides.map((g) => [g.slug, g]));
  return (
    <>
      <JsonLd
        data={graph(
          webPageSchema({ name: title, description, path: "/guides", type: "CollectionPage" }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          itemListSchema(
            "Guides",
            guides.map((g) => ({ name: g.title, path: guideHref(g.slug) })),
          ),
          faqSchema(faqs),
        )}
      />
      <div className="container-page pt-6 sm:pt-8">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]}
        />
        <header className="mt-6 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Guides</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            Short, practical explanations of the calculations behind our tools. Each guide starts with a direct answer,
            then shows the formula, a step-by-step method and worked examples you can check by hand.
          </p>
        </header>

        <div className="mt-12 space-y-14">
          {topics.map((topic) => {
            const items = topic.slugs.map((s) => bySlug.get(s)).filter((g): g is GuideMeta => Boolean(g));
            const id = topic.name.toLowerCase().replace(/[^a-z]+/g, "-");
            return (
              <section key={topic.name} aria-labelledby={id} className="space-y-4">
                <SectionHeading id={id}>{topic.name}</SectionHeading>
                <GuideGrid guides={items} />
              </section>
            );
          })}
          <FAQSection faqs={faqs} title="About our guides" />
        </div>
      </div>
    </>
  );
}
