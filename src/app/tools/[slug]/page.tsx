import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPage } from "@/components/tools/tool-page";
import { getToolBySlug, getToolsByCategory, toolHref } from "@/config/tools";
import { getToolContent } from "@/data/content";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return getToolsByCategory("tools").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug("tools", slug);
  if (!tool) return {};
  return buildMetadata({ title: tool.seoTitle, description: tool.seoDescription, path: toolHref(tool), defaultImage: false });
}

export default async function UtilityToolPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const tool = getToolBySlug("tools", slug);
  const content = tool ? await getToolContent(tool.id) : undefined;
  if (!tool || !content) notFound();
  return <ToolPage tool={tool} content={content} />;
}
