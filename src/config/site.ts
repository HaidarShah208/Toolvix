function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Canonical production origin. Every canonical URL, the sitemap and robots.txt use it. */
const PRODUCTION_URL = "https://www.toolvix.store";

/**
 * Resolves the site origin. A production build never falls back to
 * localhost: a missing or localhost NEXT_PUBLIC_SITE_URL would otherwise leak
 * into canonicals and the sitemap and make Search Console reject every URL.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const isLocal = !fromEnv || /localhost|127\.0\.0\.1|example\.com/.test(fromEnv);
  if (process.env.NODE_ENV === "production") {
    return normalizeUrl(isLocal ? PRODUCTION_URL : fromEnv);
  }
  return normalizeUrl(fromEnv || "http://localhost:3000");
}

const siteUrl = resolveSiteUrl();

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
