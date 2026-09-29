import { getToolBySlug, getToolsByCategory } from "@/config/tools";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Online tool preview card";

export function generateStaticParams() {
  return getToolsByCategory("tools").map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug("tools", slug);
  return renderOgImage({
    eyebrow: "Free online tool",
    title: tool?.name ?? "Online tool",
    description: tool?.description,
  });
}
