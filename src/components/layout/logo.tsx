import Link from "next/link";
import { siteConfig } from "@/config/site";

export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-primary" />
      <path
        d="M10 9.5v7.25a6 6 0 0 0 12 0V9.5"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-primary-foreground"
      />
      <circle cx="16" cy="23.5" r="1.75" className="fill-primary-foreground" opacity="0.7" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2.5 rounded-lg text-lg font-semibold tracking-tight text-foreground"
      aria-label={`${siteConfig.name} home`}
    >
      <LogoMark />
      <span>{siteConfig.name}</span>
    </Link>
  );
}
