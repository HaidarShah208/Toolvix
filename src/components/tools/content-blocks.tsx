import { Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";
import type { ContentSection, Formula, WorkedExample } from "@/types";

export function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
      {children}
    </h2>
  );
}

/** Concise answer placed right under the H1 for readers and answer engines. */
export function DirectAnswer({ children, label = "Quick answer" }: { children: ReactNode; label?: string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary-soft/60 px-5 py-4">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-primary-soft-foreground uppercase">
        <Lightbulb className="size-4" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1.5 leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

export function FormulaBlock({ formula }: { formula: Formula }) {
  return (
    <figure className="rounded-2xl border border-border bg-surface p-5">
      <figcaption className="text-sm font-semibold text-foreground">{formula.label}</figcaption>
      <div className="mt-3 overflow-x-auto rounded-xl bg-surface-muted px-4 py-3">
        <code className="font-mono text-base whitespace-pre-wrap text-foreground sm:text-lg">{formula.expression}</code>
      </div>
      {formula.variables?.length ? (
        <dl className="mt-3 grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
          {formula.variables.map((v) => (
            <div key={v.symbol} className="contents">
              <dt className="font-mono font-semibold text-foreground">{v.symbol}</dt>
              <dd className="text-muted">{v.meaning}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {formula.note ? <p className="mt-3 text-sm text-muted">{formula.note}</p> : null}
    </figure>
  );
}

export function ExampleBlock({ example }: { example: WorkedExample }) {
  return (
    <div className="min-w-0 rounded-2xl border border-border bg-surface p-5">
      <h3 className="font-semibold text-foreground">{example.title}</h3>
      <ol className="mt-3 space-y-1.5 text-sm text-muted">
        {example.steps.map((s, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="tabular mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-foreground ring-1 ring-border">
              {i + 1}
            </span>
            <span className="min-w-0 font-mono [overflow-wrap:anywhere]">{s}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 border-t border-border pt-3 text-sm font-medium [overflow-wrap:anywhere] text-foreground">{example.result}</p>
    </div>
  );
}

export function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="tabular flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {i + 1}
          </span>
          <span className="min-w-0 pt-0.5 leading-relaxed text-muted">{s}</span>
        </li>
      ))}
    </ol>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="prose-content">
      {items.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Renders question-led sections as sibling <section>s with linkable H2s. */
export function ContentSections({ sections }: { sections: ContentSection[] }) {
  return (
    <>
      {sections.map((s) => {
        const ListTag = s.ordered ? "ol" : "ul";
        const id = slugify(s.heading);
        return (
          <section key={s.heading} aria-labelledby={id} className="space-y-4">
            <SectionHeading id={id}>{s.heading}</SectionHeading>
            <div className="prose-content">
              {s.paragraphs?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              {s.list?.length ? (
                <ListTag>
                  {s.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ListTag>
              ) : null}
            </div>
          </section>
        );
      })}
    </>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <aside
      aria-label="Disclaimer"
      className="flex gap-3 rounded-2xl border border-warning/30 bg-warning-soft px-5 py-4 text-sm text-foreground"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
      <div>
        <p className="font-semibold">Disclaimer</p>
        <p className="mt-1 leading-relaxed text-muted">{children}</p>
      </div>
    </aside>
  );
}
