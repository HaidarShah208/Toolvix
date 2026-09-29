import type { MetadataRoute } from "next";
import { guideHref, guides } from "@/config/guides";
import { absoluteUrl, STATIC_PAGES_UPDATED } from "@/config/site";
import { categories, toolHref, tools } from "@/config/tools";

/**
 * Generated from the tool and guide registries, so new pages are included
 * automatically. Only canonical, indexable URLs are listed (no /search).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const latestTool = tools.reduce((max, t) => (t.updated > max ? t.updated : max), STATIC_PAGES_UPDATED);
  const latestGuide = guides.reduce((max, g) => (g.updated > max ? g.updated : max), STATIC_PAGES_UPDATED);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latestTool, changeFrequency: "weekly", priority: 1 },
    ...Object.values(categories).map((c) => ({
      url: absoluteUrl(c.href),
      lastModified: latestTool,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    { url: absoluteUrl("/guides"), lastModified: latestGuide, changeFrequency: "weekly", priority: 0.8 },
    ...["/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"].map((path) => ({
      url: absoluteUrl(path),
      lastModified: STATIC_PAGES_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: absoluteUrl(toolHref(t)),
    lastModified: t.updated,
    changeFrequency: "monthly",
    priority: t.popular ? 0.9 : 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: absoluteUrl(guideHref(g.slug)),
    lastModified: g.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...toolPages, ...guidePages];
}
