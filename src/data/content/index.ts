import type { ToolContent } from "@/types";

type Loader = () => Promise<{ default: ToolContent }>;

/** Page copy for each tool, loaded lazily so each route only bundles its own content. */
const loaders: Record<string, Loader> = {
  "age-calculator": () => import("./age-calculator"),
  "percentage-calculator": () => import("./percentage-calculator"),
  "gpa-calculator": () => import("./gpa-calculator"),
  "cgpa-calculator": () => import("./cgpa-calculator"),
  "bmi-calculator": () => import("./bmi-calculator"),
  "loan-calculator": () => import("./loan-calculator"),
  "salary-calculator": () => import("./salary-calculator"),
  "discount-calculator": () => import("./discount-calculator"),
  "tip-calculator": () => import("./tip-calculator"),
  "simple-interest-calculator": () => import("./simple-interest-calculator"),
  "compound-interest-calculator": () => import("./compound-interest-calculator"),
  "average-calculator": () => import("./average-calculator"),
  "ratio-calculator": () => import("./ratio-calculator"),
  "fraction-calculator": () => import("./fraction-calculator"),
  "date-difference-calculator": () => import("./date-difference-calculator"),
  "time-calculator": () => import("./time-calculator"),
  "calorie-calculator": () => import("./calorie-calculator"),
  "pace-calculator": () => import("./pace-calculator"),
  "qr-code-generator": () => import("./qr-code-generator"),
  "word-counter": () => import("./word-counter"),
  "character-counter": () => import("./character-counter"),
  "case-converter": () => import("./case-converter"),
  "password-generator": () => import("./password-generator"),
  "unit-converter": () => import("./unit-converter"),
  "length-converter": () => import("./length-converter"),
  "weight-converter": () => import("./weight-converter"),
  "temperature-converter": () => import("./temperature-converter"),
  "time-zone-converter": () => import("./time-zone-converter"),
  "image-resizer": () => import("./image-resizer"),
  "image-compressor": () => import("./image-compressor"),
  "json-formatter": () => import("./json-formatter"),
  "json-validator": () => import("./json-validator"),
  "uuid-generator": () => import("./uuid-generator"),
  "lorem-ipsum-generator": () => import("./lorem-ipsum-generator"),
  "random-number-generator": () => import("./random-number-generator"),
  "color-converter": () => import("./color-converter"),
  "text-reverser": () => import("./text-reverser"),
  "text-cleaner": () => import("./text-cleaner"),
};

export async function getToolContent(id: string): Promise<ToolContent | undefined> {
  const load = loaders[id];
  return load ? (await load()).default : undefined;
}

export const toolContentIds = Object.keys(loaders);
