import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

interface PageMetaInput {
  /** Page title without the brand; the root template appends " | Toolvix". */
  title: string;
  description: string;
  /** Path of the canonical URL, e.g. "/calculators/bmi-calculator". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
  /** Use the title as-is, without the brand template. */
  absoluteTitle?: boolean;
  /**
   * Set false when the route segment has its own opengraph-image file. Other
   * pages fall back to the site-wide card, because a page-level openGraph
   * object replaces the inherited one.
   */
  defaultImage?: boolean;
}

const fallbackImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} – Free calculators and online tools` };

/**
 * Builds consistent per-page metadata: unique title and description, a
 * self-referencing canonical (never including query strings), Open Graph and
 * Twitter cards. OG images come from the `opengraph-image` file conventions.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
  noIndex,
  absoluteTitle,
  defaultImage = true,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      ...(defaultImage ? { images: [fallbackImage] } : {}),
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(defaultImage ? { images: [fallbackImage.url] } : {}),
      ...(siteConfig.twitterHandle ? { site: siteConfig.twitterHandle } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}
