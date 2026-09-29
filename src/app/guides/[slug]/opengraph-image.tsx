import { getGuideMeta, guides } from "@/config/guides";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Guide preview card";

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuideMeta(slug);
  return renderOgImage({
    eyebrow: "Guide",
    title: guide?.title ?? "Guide",
    description: guide?.description,
  });
}
