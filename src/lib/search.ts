import { guideHref, guides } from "@/config/guides";
import { categories, groupLabels, toolHref, tools } from "@/config/tools";
import type { IconName } from "@/types";

export interface SearchItem {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "Calculator" | "Tool" | "Guide";
  icon: IconName;
  /** Lower-cased searchable fields, weighted separately. */
  fields: { title: string; keywords: string; category: string; description: string };
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
}

export const searchIndex: SearchItem[] = [
  ...tools.map<SearchItem>((t) => ({
    id: t.id,
    title: t.name,
    description: t.description,
    href: toolHref(t),
    kind: t.category === "calculators" ? "Calculator" : "Tool",
    icon: t.icon,
    fields: {
      title: normalize(t.name),
      keywords: normalize(t.keywords.join(" ")),
      category: normalize(`${categories[t.category].name} ${groupLabels[t.group].name}`),
      description: normalize(t.description),
    },
  })),
  ...guides.map<SearchItem>((g) => ({
    id: `guide:${g.slug}`,
    title: g.title,
    description: g.description,
    href: guideHref(g.slug),
    kind: "Guide",
    icon: "book-open",
    fields: {
      title: normalize(g.title),
      keywords: normalize(g.relatedTools.join(" ").replace(/-/g, " ")),
      category: "guides guide how to",
      description: normalize(g.description),
    },
  })),
];

function scoreItem(item: SearchItem, terms: string[], phrase: string): number {
  const { title, keywords, category, description } = item.fields;
  let score = 0;
  if (title === phrase) score += 100;
  else if (title.startsWith(phrase)) score += 60;
  else if (title.includes(phrase)) score += 40;
  if (keywords.includes(phrase)) score += 25;

  for (const term of terms) {
    const inTitle = title.split(" ").some((w) => w.startsWith(term));
    const inKeywords = keywords.includes(term);
    const inCategory = category.includes(term);
    const inDescription = description.includes(term);
    if (!inTitle && !inKeywords && !inCategory && !inDescription) return 0;
    if (inTitle) score += 12;
    if (inKeywords) score += 8;
    if (inCategory) score += 4;
    if (inDescription) score += 2;
  }
  // Tools rank above guides for the same match strength.
  if (item.kind !== "Guide") score += 1;
  return score;
}

export function searchTools(query: string, limit = 12): SearchItem[] {
  const phrase = normalize(query);
  if (!phrase) return [];
  const terms = phrase.split(" ").filter(Boolean);
  return searchIndex
    .map((item) => ({ item, score: scoreItem(item, terms, phrase) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((r) => r.item);
}
