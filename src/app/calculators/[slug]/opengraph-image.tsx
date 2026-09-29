import { getToolBySlug, getToolsByCategory } from "@/config/tools";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Calculator preview card";

export function generateStaticParams() {
  return getToolsByCategory("calculators").map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getToolBySlug("calculators", slug);
  return renderOgImage({
    eyebrow: "Free online calculator",
    title: tool?.name ?? "Calculator",
    description: tool?.description,
  });
}
