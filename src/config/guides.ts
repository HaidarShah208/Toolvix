import type { GuideMeta } from "@/types";

const P = "2026-09-29";

/** Guide index. Full guide bodies live in `data/guides`. */
export const guides: GuideMeta[] = [
  {
    slug: "how-to-calculate-percentage",
    title: "How to Calculate Percentage",
    seoTitle: "How to Calculate Percentage – Formulas & Examples",
    description:
      "Learn the three percentage formulas: finding a percent of a number, what percent one number is of another, and percentage change.",
    relatedTools: ["percentage-calculator", "discount-calculator", "tip-calculator"],
    relatedGuides: ["how-to-calculate-discount", "how-to-calculate-simple-interest"],
    popular: true,
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-bmi",
    title: "How BMI Is Calculated",
    seoTitle: "How to Calculate BMI – Formula, Chart & Examples",
    description:
      "How body mass index is calculated in metric and imperial units, what the adult BMI categories mean and where BMI falls short.",
    relatedTools: ["bmi-calculator", "calorie-calculator", "weight-converter"],
    relatedGuides: ["how-to-calculate-daily-calories"],
    popular: true,
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-gpa",
    title: "How to Calculate GPA",
    seoTitle: "How to Calculate GPA – Step-by-Step With Credits",
    description:
      "Calculate a grade point average by converting letter grades to points, weighting them by credit hours and dividing by total credits.",
    relatedTools: ["gpa-calculator", "cgpa-calculator", "average-calculator"],
    relatedGuides: ["how-to-calculate-cgpa"],
    popular: true,
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-cgpa",
    title: "How to Calculate CGPA",
    seoTitle: "How to Calculate CGPA – Cumulative GPA Explained",
    description:
      "Combine semester GPAs into a cumulative GPA using credit weighting, and see why a simple average of GPAs can give the wrong answer.",
    relatedTools: ["cgpa-calculator", "gpa-calculator", "average-calculator"],
    relatedGuides: ["how-to-calculate-gpa"],
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-compound-interest",
    title: "How Compound Interest Works",
    seoTitle: "How to Calculate Compound Interest – Formula & Examples",
    description:
      "The compound interest formula explained, how compounding frequency changes growth, and how regular contributions add up over time.",
    relatedTools: ["compound-interest-calculator", "simple-interest-calculator", "loan-calculator"],
    relatedGuides: ["how-to-calculate-simple-interest", "how-to-calculate-loan-payment"],
    popular: true,
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-loan-payment",
    title: "How to Calculate a Loan Payment",
    seoTitle: "How to Calculate Loan Payments – Amortization Formula",
    description:
      "Use the amortization formula to calculate fixed loan payments, understand how each payment splits into interest and principal, and compare terms.",
    relatedTools: ["loan-calculator", "simple-interest-calculator", "compound-interest-calculator"],
    relatedGuides: ["how-to-calculate-compound-interest", "how-to-calculate-simple-interest"],
    popular: true,
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-age",
    title: "How to Calculate Age",
    seoTitle: "How to Calculate Age From Date of Birth",
    description:
      "Calculate someone's exact age in years, months and days by hand, including how leap years and 29 February birthdays are handled.",
    relatedTools: ["age-calculator", "date-difference-calculator", "time-calculator"],
    relatedGuides: [],
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-simple-interest",
    title: "How to Calculate Simple Interest",
    seoTitle: "How to Calculate Simple Interest – I = PRT Explained",
    description:
      "Simple interest explained with the I = P × R × T formula, converting months and days to years, and how it compares with compound interest.",
    relatedTools: ["simple-interest-calculator", "compound-interest-calculator", "loan-calculator"],
    relatedGuides: ["how-to-calculate-compound-interest", "how-to-calculate-percentage"],
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-discount",
    title: "How to Calculate a Discount",
    seoTitle: "How to Calculate Discounts & Sale Prices",
    description:
      "Work out a sale price from a percentage off, find the discount rate from two prices, and see why stacked discounts don't simply add up.",
    relatedTools: ["discount-calculator", "percentage-calculator", "tip-calculator"],
    relatedGuides: ["how-to-calculate-percentage"],
    published: P,
    updated: P,
  },
  {
    slug: "how-to-calculate-daily-calories",
    title: "How to Calculate Your Daily Calorie Needs",
    seoTitle: "How to Calculate Daily Calories – BMR & TDEE Explained",
    description:
      "Estimate your basal metabolic rate with the Mifflin–St Jeor equation, apply an activity factor to get TDEE, and set a sensible calorie target.",
    relatedTools: ["calorie-calculator", "bmi-calculator", "pace-calculator"],
    relatedGuides: ["how-to-calculate-bmi"],
    published: P,
    updated: P,
  },
  {
    slug: "how-to-create-a-strong-password",
    title: "How to Create a Strong Password",
    seoTitle: "How to Create a Strong Password – Length, Entropy & Tips",
    description:
      "What makes a password strong, how length and character variety affect entropy, and practical habits for keeping accounts secure.",
    relatedTools: ["password-generator", "uuid-generator", "random-number-generator"],
    relatedGuides: [],
    published: P,
    updated: P,
  },
  {
    slug: "how-to-convert-celsius-to-fahrenheit",
    title: "How to Convert Celsius to Fahrenheit",
    seoTitle: "How to Convert Celsius to Fahrenheit (and Back)",
    description:
      "Convert Celsius to Fahrenheit with F = C × 9/5 + 32, convert back the other way, and use a quick mental shortcut for everyday temperatures.",
    relatedTools: ["temperature-converter", "unit-converter", "weight-converter"],
    relatedGuides: [],
    published: P,
    updated: P,
  },
];

const bySlug = new Map(guides.map((g) => [g.slug, g]));

export function getGuideMeta(slug: string): GuideMeta | undefined {
  return bySlug.get(slug);
}

export function guideHref(slug: string): string {
  return `/guides/${slug}`;
}

export function getPopularGuides(): GuideMeta[] {
  return guides.filter((g) => g.popular);
}
