"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Reserved ad placement. Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT and
 * a slot ID are configured, so layouts stay clean by default. When enabled it
 * reserves height (no layout shift), is clearly labeled, and sits between
 * content sections — never inside a calculator.
 */
export function AdSlot({
  slot,
  className,
  minHeight = 250,
}: {
  /** Placement; each maps to a NEXT_PUBLIC_AD_SLOT_* env var holding the AdSense slot ID. */
  slot: "belowTool" | "inContent" | "sidebar";
  className?: string;
  minHeight?: number;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slotIds = {
    belowTool: process.env.NEXT_PUBLIC_AD_SLOT_BELOW_TOOL,
    inContent: process.env.NEXT_PUBLIC_AD_SLOT_IN_CONTENT,
    sidebar: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR,
  };
  const slotId = slotIds[slot];
  const pushed = useRef(false);
  const enabled = Boolean(client && slotId && process.env.NODE_ENV === "production");

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers or network failures must never break the page.
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside aria-label="Advertisement" className={cn("my-10", className)}>
      <p className="mb-1 text-center text-[11px] tracking-wide text-subtle uppercase">Advertisement</p>
      <ins
        className="adsbygoogle block overflow-hidden rounded-xl bg-surface-muted"
        style={{ display: "block", minHeight }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
