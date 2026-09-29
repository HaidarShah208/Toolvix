import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Estimate your daily calories by calculating BMR with the Mifflin–St Jeor equation, then multiplying by an activity factor. A moderately active 30-year-old man who weighs 80 kg and is 180 cm tall has a BMR of 1,780 kcal and needs roughly 1,780 × 1.55 ≈ 2,759 kcal a day to maintain his weight.",
  intro:
    "Your body burns energy just to stay alive, and more on top of that as you move. This calculator estimates both: your basal metabolic rate (BMR) and your total daily energy expenditure (TDEE), then suggests calorie targets for gradual weight loss or gain.",
  howToUse: [
    "Enter your age, sex, height and weight.",
    "Choose the activity level that best matches a typical week, from sedentary to extremely active.",
    "Read your BMR and your maintenance calories (TDEE).",
    "Use the targets for losing or gaining weight at two paces: 250 or 500 kcal a day below or above maintenance. Heed the caution if a target falls very low.",
  ],
  howItWorks: [
    "BMR is calculated with the Mifflin–St Jeor equation, which uses weight, height, age and sex. It is widely used by dietitians and generally considered one of the more reliable equations for healthy adults, but it remains an estimate: two people with identical inputs can differ by a few hundred calories.",
    "TDEE multiplies BMR by an activity factor: 1.2 for sedentary, 1.375 for light activity, 1.55 for moderate, 1.725 for very active and 1.9 for extremely active. Most people overestimate their activity, so if you're unsure, choose the lower option.",
    "Weight-change targets subtract or add 250 or 500 kcal a day. Treat them as starting points: track your weight for a few weeks and adjust, because real-world energy needs shift as your weight and activity change.",
  ],
  formulas: [
    {
      label: "Mifflin–St Jeor BMR",
      expression: "BMR = 10 × weight (kg) + 6.25 × height (cm) − 5 × age (years) + s",
      variables: [{ symbol: "s", meaning: "+5 for men, −161 for women" }],
    },
    {
      label: "Total daily energy expenditure",
      expression: "TDEE = BMR × activity factor",
      note: "Factors: 1.2, 1.375, 1.55, 1.725 or 1.9.",
    },
  ],
  examples: [
    {
      title: "Man, 30, 80 kg, 180 cm, moderately active",
      steps: [
        "BMR = 10 × 80 + 6.25 × 180 − 5 × 30 + 5",
        "= 800 + 1,125 − 150 + 5 = 1,780 kcal",
        "TDEE = 1,780 × 1.55 = 2,759 kcal",
        "Moderate loss target: 2,759 − 500 = 2,259 kcal",
      ],
      result: "About 2,759 kcal to maintain, or about 2,259 kcal for steady weight loss.",
    },
    {
      title: "Woman, 45, 65 kg, 165 cm, lightly active",
      steps: [
        "BMR = 10 × 65 + 6.25 × 165 − 5 × 45 − 161",
        "= 650 + 1,031.25 − 225 − 161 = 1,295.25 kcal",
        "TDEE = 1,295.25 × 1.375 ≈ 1,781 kcal",
        "Gentle loss target: 1,781 − 250 = 1,531 kcal",
      ],
      result: "About 1,781 kcal to maintain, or about 1,531 kcal for gradual loss.",
    },
  ],
  sections: [
    {
      heading: "What is the difference between BMR and TDEE?",
      paragraphs: [
        "BMR is the energy you would burn lying at rest all day: breathing, circulation, keeping warm. TDEE adds everything else, including walking, work, exercise and digesting food. You should generally eat around your TDEE to maintain weight, and not routinely below your BMR without professional guidance.",
      ],
    },
    {
      heading: "How much of a calorie deficit is safe?",
      paragraphs: [
        "A deficit of 250 to 500 kcal a day is a common, moderate starting point that many people can sustain. Much larger deficits can make it hard to get enough protein, vitamins and minerals, and are harder to stick to. If a target comes out very low, as it can for smaller or less active people, the calculator shows a caution; speak to a doctor or registered dietitian before going lower.",
      ],
    },
  ],
  faqs: [
    {
      question: "Which activity level should I pick?",
      answer:
        "Sedentary means a desk job with little exercise; light is exercise 1–3 days a week; moderate is 3–5 days; very active is hard exercise 6–7 days; extremely active is physical work plus training. Choose the lower level if you're between two.",
    },
    {
      question: "How accurate is the Mifflin–St Jeor equation?",
      answer:
        "It is a well-established estimate for adults, but it can't account for body composition, genetics or medical conditions. Use it as a starting figure and adjust based on how your weight changes over several weeks.",
    },
    {
      question: "Why does the calculator ask for sex?",
      answer:
        "The equation has different constants for men (+5) and women (−161) because, on average, men have more lean mass at the same weight and height, which burns more energy.",
    },
    {
      question: "Will eating 500 kcal less every day always mean steady weight loss?",
      answer:
        "Not exactly. As you lose weight your energy needs fall, and water weight can mask fat loss in the short term. Recalculate after significant weight changes.",
    },
    {
      question: "Is this suitable during pregnancy or for teenagers?",
      answer:
        "No. Energy needs during pregnancy, breastfeeding and adolescence differ from these adult estimates, so get advice from a healthcare professional.",
    },
  ],
  disclaimer:
    "This calculator provides general estimates for healthy adults and is not medical or nutritional advice. Individual needs vary. Consult a doctor or registered dietitian before making significant changes to your diet, particularly if you are pregnant, under 18, have a medical condition or have a history of disordered eating.",
};

export default content;
