import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/types";
import { SectionHeading } from "./content-blocks";

/** FAQ list using native <details>, so answers are in the HTML and work without JavaScript. */
export function FAQSection({
  faqs,
  title = "Frequently asked questions",
  id = "faq",
}: {
  faqs: FAQ[];
  title?: string;
  id?: string;
}) {
  if (faqs.length === 0) return null;
  return (
    <section aria-labelledby={id} className="space-y-4">
      <SectionHeading id={id}>{title}</SectionHeading>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
        {faqs.map((f, i) => (
          <details key={f.question} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 font-medium text-foreground hover:bg-surface-muted [&::-webkit-details-marker]:hidden">
              <h3 className="text-base">{f.question}</h3>
              <ChevronDown
                className="mt-0.5 size-5 shrink-0 text-subtle transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <p className="px-5 pb-5 leading-relaxed text-muted">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
