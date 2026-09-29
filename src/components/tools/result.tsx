import { AlertCircle, Calculator } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/** Placeholder shown in the results panel before there is anything to show. */
export function ResultEmpty({ children = "Enter your values to see the result." }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border-strong px-4 py-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-surface text-subtle ring-1 ring-border">
        <Calculator className="size-5" aria-hidden="true" />
      </span>
      <p className="max-w-xs text-sm text-muted">{children}</p>
    </div>
  );
}

/** Friendly validation message in the results panel. */
export function ResultError({ children }: { children: ReactNode }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 leading-relaxed">{children}</div>
    </div>
  );
}

/** The main answer, displayed prominently. */
export function ResultHighlight({
  label,
  value,
  sub,
  badge,
}: {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="tabular mt-1 text-3xl font-semibold tracking-tight [overflow-wrap:anywhere] text-foreground sm:text-4xl">
        {value}
      </p>
      {badge ? <div className="mt-3">{badge}</div> : null}
      {sub ? <p className="mt-2 text-sm text-muted">{sub}</p> : null}
    </div>
  );
}

export interface StatItem {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
}

export function StatGrid({ items, columns = 2 }: { items: StatItem[]; columns?: 2 | 3 }) {
  return (
    <dl className={cn("grid grid-cols-1 gap-3 min-[400px]:grid-cols-2", columns === 3 && "sm:grid-cols-3")}>
      {items.map((item, i) => (
        <div key={i} className="min-w-0 rounded-xl border border-border bg-surface px-4 py-3">
          <dt className="text-xs font-medium text-muted">{item.label}</dt>
          <dd className="tabular mt-1 text-lg font-semibold [overflow-wrap:anywhere] text-foreground">{item.value}</dd>
          {item.hint ? <dd className="mt-0.5 text-xs text-subtle">{item.hint}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

/** Step-by-step working that shows how the answer was reached. */
export function ResultSteps({ title = "How we got this", steps }: { title?: string; steps: ReactNode[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ol className="mt-2 space-y-1.5 text-sm text-muted">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="tabular mt-px flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
              {i + 1}
            </span>
            <span className="min-w-0 [overflow-wrap:anywhere]">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ResultActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "success" | "warning" | "danger";
}) {
  const tones = {
    neutral: "bg-surface-muted text-foreground ring-border",
    primary: "bg-primary-soft text-primary-soft-foreground ring-primary/20",
    success: "bg-success-soft text-success ring-success/25",
    warning: "bg-warning-soft text-warning ring-warning/25",
    danger: "bg-danger-soft text-danger ring-danger/25",
  } as const;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", tones[tone])}>
      {children}
    </span>
  );
}

/** Responsive table; scrolls inside its own box so the page never scrolls sideways. */
export function DataTable({
  caption,
  columns,
  rows,
  className,
}: {
  caption: string;
  columns: { key: string; label: string; align?: "left" | "right" }[];
  rows: Record<string, ReactNode>[];
  className?: string;
}) {
  return (
    <div className={cn("max-h-[28rem] overflow-auto rounded-xl border border-border bg-surface", className)}>
      <table className="w-full min-w-max border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="sticky top-0 bg-surface-muted">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "border-b border-border px-3 py-2 font-semibold whitespace-nowrap text-foreground",
                  c.align === "right" ? "text-right" : "text-left",
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={cn(
                    "tabular px-3 py-2 whitespace-nowrap text-muted",
                    c.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
