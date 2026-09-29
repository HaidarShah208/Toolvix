import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "BMI is your weight in kilograms divided by your height in meters squared. A person who weighs 70 kg and is 1.75 m tall has a BMI of 70 ÷ 1.75² ≈ 22.9, which falls in the WHO healthy weight range of 18.5 to 24.9.",
  intro:
    "Body mass index is a quick screening number that relates weight to height. Enter your measurements in metric or imperial units to get your BMI, the WHO adult category it falls into, and the weight range that would count as a healthy BMI for your height.",
  howToUse: [
    "Choose metric (kg and cm) or imperial (lb, feet and inches).",
    "Enter your height and weight.",
    "Read your BMI, its WHO category and the healthy weight range for your height.",
    "Switch units at any time to see the same result in the other system.",
  ],
  howItWorks: [
    "BMI divides weight by the square of height. Squaring height accounts for the fact that taller people are naturally heavier, so the figure can be compared across heights. In imperial units the same result comes from multiplying pounds by 703 and dividing by inches squared.",
    "The result is placed in the World Health Organization's adult categories. The healthy weight range shown is simply the band of weights that would give a BMI between 18.5 and 24.9 at your height.",
    "The categories are designed for adults aged 18 and over. Children and teenagers are assessed with age- and sex-specific percentiles, so an adult category is not meaningful for them.",
  ],
  formulas: [
    {
      label: "BMI (metric)",
      expression: "BMI = weight (kg) ÷ height (m)²",
    },
    {
      label: "BMI (imperial)",
      expression: "BMI = 703 × weight (lb) ÷ height (in)²",
    },
    {
      label: "Healthy weight range for a height",
      expression: "18.5 × height (m)² to 24.9 × height (m)²",
    },
  ],
  examples: [
    {
      title: "Metric: 70 kg, 175 cm",
      steps: ["1.75 × 1.75 = 3.0625", "70 ÷ 3.0625 = 22.86"],
      result: "BMI 22.9, in the healthy weight category.",
    },
    {
      title: "Imperial: 180 lb, 5 ft 10 in",
      steps: ["5 ft 10 in = 70 in", "70² = 4,900", "703 × 180 = 126,540", "126,540 ÷ 4,900 = 25.82"],
      result: "BMI 25.8, in the overweight (pre-obese) category.",
    },
    {
      title: "Healthy weight range at 1.75 m",
      steps: ["18.5 × 3.0625 = 56.7 kg", "24.9 × 3.0625 = 76.3 kg"],
      result: "Roughly 56.7 kg to 76.3 kg gives a BMI of 18.5 to 24.9.",
    },
  ],
  sections: [
    {
      heading: "What are the BMI categories for adults?",
      list: [
        "Below 18.5: underweight",
        "18.5 to 24.9: healthy (normal) weight",
        "25.0 to 29.9: overweight (pre-obese)",
        "30.0 to 34.9: obesity class I",
        "35.0 to 39.9: obesity class II",
        "40.0 and above: obesity class III",
      ],
      paragraphs: [
        "These are the WHO cut-offs for adults. Some national health bodies recommend lower thresholds for people of certain ethnic backgrounds, particularly South Asian, Chinese and other Asian populations, because health risks can rise at lower BMIs.",
      ],
    },
    {
      heading: "Why can BMI be misleading?",
      paragraphs: [
        "BMI can't tell muscle from fat or show where fat is stored. A muscular athlete may be classed as overweight while being lean, and an older adult with little muscle may have a normal BMI but a high body-fat percentage. It also isn't suited to pregnancy. Waist measurement, blood pressure and blood tests give a fuller picture, which is why doctors use BMI as a starting point rather than a diagnosis.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is a healthy BMI?",
      answer:
        "For adults, the WHO defines 18.5 to 24.9 as the healthy weight range. The calculator shows what that means in kilograms or pounds for your height.",
    },
    {
      question: "Is BMI different for men and women?",
      answer:
        "The formula and adult categories are the same for both. Women typically carry more body fat than men at the same BMI, which is one of the measure's known limitations.",
    },
    {
      question: "Can I use this BMI calculator for children?",
      answer:
        "Not for categories. Under-18s are assessed against growth charts for their age and sex, so ask a pediatrician or use a dedicated child BMI percentile tool.",
    },
    {
      question: "How do I calculate BMI in pounds and inches?",
      answer:
        "Multiply your weight in pounds by 703, then divide by your height in inches squared. At 140 lb and 65 in, that is 703 × 140 ÷ 4,225 ≈ 23.3.",
    },
    {
      question: "Does age affect BMI?",
      answer:
        "The adult formula doesn't include age. Body composition changes with age, though, so the same BMI can reflect different amounts of body fat at 25 and at 75.",
    },
  ],
  disclaimer:
    "This calculator is for general information only and is not medical advice. BMI is a screening measure and does not diagnose any condition. Speak to a doctor or registered dietitian about your weight and health, especially if you are pregnant, under 18 or managing a medical condition.",
};

export default content;
