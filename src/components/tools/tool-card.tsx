import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { guideHref } from "@/config/guides";
import { toolHref } from "@/config/tools";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils/cn";
import type { GuideMeta, Tool } from "@/types";

export function ToolCard({ tool, compact = false }: { tool: Tool; compact?: boolean }) {
  return (
    <Link
      href={toolHref(tool)}
      className={cn(
        "group flex h-full min-w-0 flex-col rounded-2xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift",
        compact ? "gap-2 p-4" : "gap-3 p-5",
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground",
          compact ? "size-9" : "size-11",
        )}
      >
        <Icon name={tool.icon} className={compact ? "size-4.5" : "size-5.5"} />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold text-foreground">{tool.name}</span>
        <span className={cn("mt-1 block text-sm leading-relaxed text-muted", compact && "line-clamp-2")}>
          {tool.description}
        </span>
      </span>
      {!compact ? (
        <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary">
          Use tool
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      ) : null}
    </Link>
  );
}

export function ToolGrid({ tools, compact }: { tools: Tool[]; compact?: boolean }) {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 lg:grid-cols-3", !compact && "xl:grid-cols-4")}>
      {tools.map((t) => (
        <li key={t.id} className="min-w-0">
          <ToolCard tool={t} compact={compact} />
        </li>
      ))}
    </ul>
  );
}

export function GuideCard({ guide }: { guide: GuideMeta }) {
  return (
    <Link
      href={guideHref(guide.slug)}
      className="group flex h-full min-w-0 flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift"
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-primary uppercase">
        <BookOpen className="size-3.5" aria-hidden="true" />
        Guide
      </span>
      <span className="font-semibold text-foreground">{guide.title}</span>
      <span className="text-sm leading-relaxed text-muted">{guide.description}</span>
      <span className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-primary">
        Read guide
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function GuideGrid({ guides }: { guides: GuideMeta[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 lg:grid-cols-3">
      {guides.map((g) => (
        <li key={g.slug} className="min-w-0">
          <GuideCard guide={g} />
        </li>
      ))}
    </ul>
  );
}
