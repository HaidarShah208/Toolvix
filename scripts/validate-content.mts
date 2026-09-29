/**
 * Registry integrity check: every tool has a widget and page content, all
 * related links resolve, and SEO titles/descriptions are unique and sized
 * sensibly. Run with `npm run validate` (Node 22.18+ strips TypeScript types).
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { guides } from "../src/config/guides.ts";
import { tools } from "../src/config/tools.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "src");
const errors: string[] = [];
const warnings: string[] = [];

const toolIds = new Set(tools.map((t) => t.id));
const guideSlugs = new Set(guides.map((g) => g.slug));

if (toolIds.size !== tools.length) errors.push("Duplicate tool ids");
if (guideSlugs.size !== guides.length) errors.push("Duplicate guide slugs");

for (const t of tools) {
  const widgetDir = t.category === "calculators" ? "calculators" : "utilities";
  if (!existsSync(join(root, "components", widgetDir, `${t.id}.tsx`))) errors.push(`${t.id}: missing widget`);
  if (!existsSync(join(root, "data", "content", `${t.id}.ts`))) errors.push(`${t.id}: missing content`);
  if (t.slug !== t.id) errors.push(`${t.id}: slug must equal id`);
  for (const r of t.relatedTools) if (!toolIds.has(r)) errors.push(`${t.id}: unknown related tool ${r}`);
  for (const g of t.relatedGuides) if (!guideSlugs.has(g)) errors.push(`${t.id}: unknown related guide ${g}`);
  if (t.relatedTools.includes(t.id)) errors.push(`${t.id}: relates to itself`);
}

for (const g of guides) {
  if (!existsSync(join(root, "data", "guides", `${g.slug}.ts`))) errors.push(`${g.slug}: missing guide content`);
  for (const r of g.relatedTools) if (!toolIds.has(r)) errors.push(`${g.slug}: unknown related tool ${r}`);
  for (const r of g.relatedGuides) if (!guideSlugs.has(r)) errors.push(`${g.slug}: unknown related guide ${r}`);
}

const pages = [
  ...tools.map((t) => ({ id: t.id, title: t.seoTitle, description: t.seoDescription })),
  ...guides.map((g) => ({ id: g.slug, title: g.seoTitle, description: g.description })),
];
const seenTitles = new Map<string, string>();
const seenDescriptions = new Map<string, string>();
for (const p of pages) {
  const other = seenTitles.get(p.title);
  if (other) errors.push(`Duplicate title: ${p.id} and ${other}`);
  seenTitles.set(p.title, p.id);
  const otherD = seenDescriptions.get(p.description);
  if (otherD) errors.push(`Duplicate description: ${p.id} and ${otherD}`);
  seenDescriptions.set(p.description, p.id);
  // " | Toolora" adds 10 characters.
  if (p.title.length + 10 > 70) warnings.push(`${p.id}: title is ${p.title.length + 10} chars`);
  if (p.description.length < 70 || p.description.length > 170)
    warnings.push(`${p.id}: description is ${p.description.length} chars`);
}

// Orphan check: every tool must be linked from at least one other tool or guide.
const linked = new Set([...tools.flatMap((t) => t.relatedTools), ...guides.flatMap((g) => g.relatedTools)]);
for (const t of tools) if (!linked.has(t.id)) warnings.push(`${t.id}: not linked from any other tool or guide`);

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(`error ${e}`);
console.log(`\n${tools.length} tools, ${guides.length} guides — ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
