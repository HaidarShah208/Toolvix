"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

/**
 * Standard frame for every interactive tool: an inputs panel and a results
 * panel. Wraps inputs in a <form> so Enter submits, and places Calculate /
 * Reset consistently. Pass `onSubmit` only for tools that need an explicit
 * calculate step; live tools can omit it.
 */
export function CalculatorShell({
  title,
  children,
  result,
  onSubmit,
  onReset,
  submitLabel = "Calculate",
  layout = "split",
  privacyNote = "Runs in your browser. Nothing you enter is sent to our servers.",
  toolbar,
  className,
}: {
  /** Accessible name for the tool region. */
  title: string;
  children: ReactNode;
  result?: ReactNode;
  onSubmit?: () => void;
  onReset?: () => void;
  submitLabel?: string;
  layout?: "split" | "stacked";
  privacyNote?: string | null;
  /** Controls rendered above the inputs, e.g. a mode switcher. */
  toolbar?: ReactNode;
  className?: string;
}) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit?.();
  }

  const split = layout === "split" && Boolean(result);

  return (
    <section
      aria-label={title}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-surface shadow-soft",
        className,
      )}
    >
      <div className={cn(split && "lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]")}>
        <form
          onSubmit={handleSubmit}
          noValidate
          className={cn("flex min-w-0 flex-col gap-5 p-5 sm:p-6", split && "lg:border-r lg:border-border")}
        >
          {toolbar}
          <div className="flex min-w-0 flex-col gap-4">{children}</div>
          {onSubmit || onReset ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {onSubmit ? (
                <Button type="submit" size="lg" className="min-w-36 flex-1 sm:flex-none">
                  {submitLabel}
                </Button>
              ) : null}
              {onReset ? (
                <Button type="button" variant="ghost" size="lg" onClick={onReset}>
                  <RotateCcw />
                  Reset
                </Button>
              ) : null}
            </div>
          ) : null}
          {privacyNote ? (
            <p className="flex items-center gap-2 text-xs text-subtle">
              <ShieldCheck className="size-4 shrink-0 text-success" aria-hidden="true" />
              {privacyNote}
            </p>
          ) : null}
        </form>
        {result ? (
          <div
            className={cn(
              "min-w-0 border-t border-border bg-surface-muted/60 p-5 sm:p-6",
              split && "lg:border-t-0",
            )}
          >
            <div aria-live="polite" className="flex min-w-0 flex-col gap-4">
              {result}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
