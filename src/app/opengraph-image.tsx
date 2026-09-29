import { siteConfig } from "@/config/site";
import { ogContentType, ogSize, renderOgImage } from "@/lib/seo/og";

export const alt = `${siteConfig.name} – Free calculators and online tools`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Calculators · Converters · Generators",
    title: "Free Calculators & Online Tools",
    description: "Calculate, convert, generate and simplify everyday tasks with fast, free tools that run in your browser.",
  });
}
