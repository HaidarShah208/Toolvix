import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, { box: string; icon: typeof Info; label: string }> = {
  info: { box: "border-primary/25 bg-primary-soft text-primary-soft-foreground", icon: Info, label: "Note" },
  success: { box: "border-success/30 bg-success-soft text-success", icon: CheckCircle2, label: "Success" },
  warning: { box: "border-warning/30 bg-warning-soft text-warning", icon: AlertTriangle, label: "Warning" },
  danger: { box: "border-danger/30 bg-danger-soft text-danger", icon: XCircle, label: "Error" },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
  live = false,
}: {
  tone?: Tone;
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Announce to screen readers when it appears. */
  live?: boolean;
}) {
  const t = tones[tone];
  const IconCmp = t.icon;
  return (
    <div
      role={live ? (tone === "danger" ? "alert" : "status") : undefined}
      className={cn("flex gap-3 rounded-xl border px-4 py-3 text-sm", t.box, className)}
    >
      <IconCmp className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        <span className="sr-only">{t.label}: </span>
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className="leading-relaxed [&_p+p]:mt-1">{children}</div> : null}
      </div>
    </div>
  );
}
