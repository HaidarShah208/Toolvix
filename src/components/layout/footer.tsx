import Link from "next/link";
import { guideHref, getPopularGuides } from "@/config/guides";
import { siteConfig } from "@/config/site";
import { getPopularTools, toolHref } from "@/config/tools";
import { LogoMark } from "./logo";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div className="min-w-0">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-muted transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const calculators = getPopularTools("calculators").map((t) => ({ href: toolHref(t), label: t.name }));
  const tools = getPopularTools("tools").map((t) => ({ href: toolHref(t), label: t.name }));
  const guides = getPopularGuides().map((g) => ({ href: guideHref(g.slug), label: g.title }));
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="w-full px-4 py-12 sm:px-6 lg:px-10 xl:px-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
          <div className="shrink-0 lg:max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-semibold text-foreground">
              <LogoMark />
              {siteConfig.name}
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">{siteConfig.tagline}</p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:max-w-4xl lg:grid-cols-5">
            <FooterColumn title="Calculators" links={[...calculators, { href: "/calculators", label: "All calculators" }]} />
            <FooterColumn title="Tools" links={[...tools, { href: "/tools", label: "All tools" }]} />
            <FooterColumn title="Guides" links={[...guides, { href: "/guides", label: "All guides" }]} />
            <FooterColumn
              title="Company"
              links={[
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                { href: "/search", label: "Search" },
              ]}
            />
            <FooterColumn
              title="Legal"
              links={[
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Use" },
                { href: "/disclaimer", label: "Disclaimer" },
              ]}
            />
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Results are provided for general information. Always double-check important figures.</p>
        </div>
      </div>
    </footer>
  );
}
