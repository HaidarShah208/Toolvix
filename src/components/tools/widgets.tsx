import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { LoadingState } from "@/components/ui/states";

/**
 * Maps each tool id to its interactive widget. `next/dynamic` code-splits
 * every widget so a page only ships the JavaScript for its own tool, while
 * still server-rendering the initial UI (no layout shift, crawlable labels).
 */
const loading = () => <LoadingState />;

export const widgets: Record<string, ComponentType> = {
  // Calculators
  "age-calculator": dynamic(() => import("@/components/calculators/age-calculator"), { loading }),
  "percentage-calculator": dynamic(() => import("@/components/calculators/percentage-calculator"), { loading }),
  "gpa-calculator": dynamic(() => import("@/components/calculators/gpa-calculator"), { loading }),
  "cgpa-calculator": dynamic(() => import("@/components/calculators/cgpa-calculator"), { loading }),
  "bmi-calculator": dynamic(() => import("@/components/calculators/bmi-calculator"), { loading }),
  "loan-calculator": dynamic(() => import("@/components/calculators/loan-calculator"), { loading }),
  "salary-calculator": dynamic(() => import("@/components/calculators/salary-calculator"), { loading }),
  "discount-calculator": dynamic(() => import("@/components/calculators/discount-calculator"), { loading }),
  "tip-calculator": dynamic(() => import("@/components/calculators/tip-calculator"), { loading }),
  "simple-interest-calculator": dynamic(() => import("@/components/calculators/simple-interest-calculator"), { loading }),
  "compound-interest-calculator": dynamic(() => import("@/components/calculators/compound-interest-calculator"), { loading }),
  "average-calculator": dynamic(() => import("@/components/calculators/average-calculator"), { loading }),
  "ratio-calculator": dynamic(() => import("@/components/calculators/ratio-calculator"), { loading }),
  "fraction-calculator": dynamic(() => import("@/components/calculators/fraction-calculator"), { loading }),
  "date-difference-calculator": dynamic(() => import("@/components/calculators/date-difference-calculator"), { loading }),
  "time-calculator": dynamic(() => import("@/components/calculators/time-calculator"), { loading }),
  "calorie-calculator": dynamic(() => import("@/components/calculators/calorie-calculator"), { loading }),
  "pace-calculator": dynamic(() => import("@/components/calculators/pace-calculator"), { loading }),

  // Utility tools
  "qr-code-generator": dynamic(() => import("@/components/utilities/qr-code-generator"), { loading }),
  "word-counter": dynamic(() => import("@/components/utilities/word-counter"), { loading }),
  "character-counter": dynamic(() => import("@/components/utilities/character-counter"), { loading }),
  "case-converter": dynamic(() => import("@/components/utilities/case-converter"), { loading }),
  "password-generator": dynamic(() => import("@/components/utilities/password-generator"), { loading }),
  "unit-converter": dynamic(() => import("@/components/utilities/unit-converter"), { loading }),
  "length-converter": dynamic(() => import("@/components/utilities/length-converter"), { loading }),
  "weight-converter": dynamic(() => import("@/components/utilities/weight-converter"), { loading }),
  "temperature-converter": dynamic(() => import("@/components/utilities/temperature-converter"), { loading }),
  "time-zone-converter": dynamic(() => import("@/components/utilities/time-zone-converter"), { loading }),
  "image-resizer": dynamic(() => import("@/components/utilities/image-resizer"), { loading }),
  "image-compressor": dynamic(() => import("@/components/utilities/image-compressor"), { loading }),
  "json-formatter": dynamic(() => import("@/components/utilities/json-formatter"), { loading }),
  "json-validator": dynamic(() => import("@/components/utilities/json-validator"), { loading }),
  "uuid-generator": dynamic(() => import("@/components/utilities/uuid-generator"), { loading }),
  "lorem-ipsum-generator": dynamic(() => import("@/components/utilities/lorem-ipsum-generator"), { loading }),
  "random-number-generator": dynamic(() => import("@/components/utilities/random-number-generator"), { loading }),
  "color-converter": dynamic(() => import("@/components/utilities/color-converter"), { loading }),
  "text-reverser": dynamic(() => import("@/components/utilities/text-reverser"), { loading }),
  "text-cleaner": dynamic(() => import("@/components/utilities/text-cleaner"), { loading }),
};
