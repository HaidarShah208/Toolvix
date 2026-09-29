import { CategoryPage, type CategoryPageCopy } from "@/components/tools/category-page";
import { buildMetadata } from "@/lib/seo/metadata";

const copy: CategoryPageCopy = {
  title: "Free Online Calculators – Math, Finance, Health & Dates",
  description:
    "Free calculators for percentages, GPA, BMI, loans, interest, discounts, dates, time and more. Every result shows the formula and working.",
  h1: "Free Online Calculators",
  intro: [
    "Quick answers for the numbers that come up in everyday life: working out a percentage, checking a loan payment, finding your GPA or counting the days until a deadline.",
    "Each calculator explains the formula it uses and shows the steps, so you can understand the answer rather than just copy it. Everything is calculated in your browser.",
  ],
  guideSlugs: [
    "how-to-calculate-percentage",
    "how-to-calculate-gpa",
    "how-to-calculate-bmi",
    "how-to-calculate-compound-interest",
    "how-to-calculate-loan-payment",
    "how-to-calculate-age",
  ],
  faqs: [
    {
      question: "Are these calculators free?",
      answer: "Yes. Every calculator is free to use with no account, no usage limits and no download.",
    },
    {
      question: "How accurate are the results?",
      answer:
        "The calculators use standard formulas and full floating-point precision, then round for display. Financial and health results are estimates based on the inputs and assumptions shown on each page, so confirm important decisions with your lender, school or doctor.",
    },
    {
      question: "Do you store the numbers I enter?",
      answer:
        "No. Calculations run in your browser and your inputs are not sent to our servers or saved.",
    },
    {
      question: "Can I use the calculators on my phone?",
      answer:
        "Yes. Every calculator is designed for small screens first, with number keypads on mobile and results that update as you type.",
    },
    {
      question: "Which calculator should I use for percentage increase?",
      answer:
        "Use the Percentage Calculator and choose the \"% change\" mode. Enter the starting and final values to see the increase or decrease and the working.",
    },
  ],
};

export const metadata = buildMetadata({ title: copy.title, description: copy.description, path: "/calculators" });

export default function CalculatorsPage() {
  return <CategoryPage category="calculators" copy={copy} />;
}
