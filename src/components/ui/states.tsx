import { AlertTriangle, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({
  title,
  children,
  action,
  icon,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted text-subtle">
        {icon ?? <SearchX className="size-6" aria-hidden="true" />}
      </span>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      {children ? <div className="mt-2 max-w-md text-sm text-muted">{children}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-danger/30 bg-danger-soft px-6 py-12 text-center">
      <AlertTriangle className="size-8 text-danger" aria-hidden="true" />
      <h2 className="mt-4 text-lg font-semibold text-foreground">{title}</h2>
      {children ? <div className="mt-2 max-w-md text-sm text-muted">{children}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/** Skeleton used while a tool's code loads; sized to avoid layout shift. */
export function LoadingState({ className, label = "Loading tool…" }: { className?: string; label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6", className)}
    >
      <span className="sr-only">{label}</span>
      <div className="animate-pulse space-y-4" aria-hidden="true">
        <div className="h-10 rounded-xl bg-surface-muted" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-16 rounded-xl bg-surface-muted" />
          <div className="h-16 rounded-xl bg-surface-muted" />
        </div>
        <div className="h-40 rounded-xl bg-surface-muted" />
      </div>
    </div>
  );
}
