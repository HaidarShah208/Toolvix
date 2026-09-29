import { absoluteUrl, siteConfig } from "@/config/site";
import type { FAQ, Guide, Tool } from "@/types";

/**
 * JSON-LD builders. Only properties that truthfully describe the page are
 * emitted: no ratings, reviews or prices.
 */

type Json = Record<string, unknown>;

const ORG_ID = `${siteConfig.url}/#organization`;
const WEBSITE_ID = `${siteConfig.url}/#website`;

export function organizationSchema(): Json {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    email: siteConfig.contactEmail,
  };
}

export function websiteSchema(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]): Json {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function webPageSchema({
  name,
  description,
  path,
  type = "WebPage",
}: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
}): Json {
  return {
    "@type": type,
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export function faqSchema(faqs: FAQ[]): Json | null {
  if (faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function toolSchema(tool: Tool, path: string): Json {
  return {
    "@type": "WebApplication",
    "@id": `${absoluteUrl(path)}#app`,
    name: tool.name,
    description: tool.seoDescription,
    url: absoluteUrl(path),
    applicationCategory: tool.category === "calculators" ? "EducationalApplication" : "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Works in current versions of Chrome, Edge, Firefox and Safari.",
    isAccessibleForFree: true,
    publisher: { "@id": ORG_ID },
  };
}

export function articleSchema(guide: Guide, path: string): Json {
  return {
    "@type": "Article",
    "@id": `${absoluteUrl(path)}#article`,
    headline: guide.title,
    description: guide.description,
    url: absoluteUrl(path),
    mainEntityOfPage: { "@id": `${absoluteUrl(path)}#webpage` },
    datePublished: guide.published,
    dateModified: guide.updated,
    inLanguage: "en",
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    image: absoluteUrl(`${path}/opengraph-image`),
  };
}

export function itemListSchema(name: string, items: { name: string; path: string }[]): Json {
  return {
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

/** Wraps nodes in a single @graph document. Null entries are skipped. */
export function graph(...nodes: (Json | null)[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes.filter(Boolean) };
}
