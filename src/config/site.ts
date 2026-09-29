function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

const siteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);

export const siteConfig = {
  name: "Toolvix",
  tagline: "Free calculators and everyday online tools.",
  description:
    "Free online calculators and everyday tools for percentages, GPA, BMI, loans, text, images, JSON and more. Fast, simple and processed in your browser.",
  url: siteUrl,
  locale: "en_US",
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
    `hello@${new URL(siteUrl).hostname.replace(/^www\./, "")}`,
  twitterHandle: process.env.NEXT_PUBLIC_TWITTER_HANDLE || undefined,
} as const;

export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Content date used for static pages in the sitemap. */
export const STATIC_PAGES_UPDATED = "2026-09-29";
