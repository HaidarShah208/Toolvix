import { getGuideMeta } from "@/config/guides";
import type { GuideMeta, Tool } from "@/types";
import { SectionHeading } from "./content-blocks";
import { GuideGrid, ToolGrid } from "./tool-card";

export function RelatedTools({ tools, title = "Related tools" }: { tools: Tool[]; title?: string }) {
  if (tools.length === 0) return null;
  return (
    <section aria-labelledby="related-tools" className="space-y-4">
      <SectionHeading id="related-tools">{title}</SectionHeading>
      <ToolGrid tools={tools} compact />
    </section>
  );
}

export function RelatedGuides({ slugs, title = "Related guides" }: { slugs: string[]; title?: string }) {
  const guides = slugs.map(getGuideMeta).filter((g): g is GuideMeta => Boolean(g));
  if (guides.length === 0) return null;
  return (
    <section aria-labelledby="related-guides" className="space-y-4">
      <SectionHeading id="related-guides">{title}</SectionHeading>
      <GuideGrid guides={guides} />
    </section>
  );
}
