import { getGuideMeta } from "@/config/guides";
import type { Guide, GuideContent } from "@/types";

type Loader = () => Promise<{ default: GuideContent }>;

const loaders: Record<string, Loader> = {
  "how-to-calculate-percentage": () => import("./how-to-calculate-percentage"),
  "how-to-calculate-bmi": () => import("./how-to-calculate-bmi"),
  "how-to-calculate-gpa": () => import("./how-to-calculate-gpa"),
  "how-to-calculate-cgpa": () => import("./how-to-calculate-cgpa"),
  "how-to-calculate-compound-interest": () => import("./how-to-calculate-compound-interest"),
  "how-to-calculate-loan-payment": () => import("./how-to-calculate-loan-payment"),
  "how-to-calculate-age": () => import("./how-to-calculate-age"),
  "how-to-calculate-simple-interest": () => import("./how-to-calculate-simple-interest"),
  "how-to-calculate-discount": () => import("./how-to-calculate-discount"),
  "how-to-calculate-daily-calories": () => import("./how-to-calculate-daily-calories"),
  "how-to-create-a-strong-password": () => import("./how-to-create-a-strong-password"),
  "how-to-convert-celsius-to-fahrenheit": () => import("./how-to-convert-celsius-to-fahrenheit"),
};

export async function getGuide(slug: string): Promise<Guide | undefined> {
  const meta = getGuideMeta(slug);
  const load = loaders[slug];
  if (!meta || !load) return undefined;
  const content = (await load()).default;
  return { ...meta, ...content };
}

export const guideContentSlugs = Object.keys(loaders);
