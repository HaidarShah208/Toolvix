import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To simplify a ratio, divide every term by their greatest common divisor: 24:36 becomes 2:3 after dividing both by 12. To solve A:B = C:D for a missing D, calculate D = B × C ÷ A, so 3:4 = 15:x gives x = 20.",
  intro:
    "Ratios show up when scaling recipes, mixing concrete or paint, resizing images and sharing costs or profits. This calculator does the three jobs people need most: simplify a two- or three-part ratio, find the missing value in a proportion, and divide a total according to a ratio.",
  howToUse: [
    "Choose what you want to do: simplify a ratio, solve a proportion, or divide a total.",
    "To simplify, enter two or three terms, such as 24:36 or 12:18:30.",
    "To solve a proportion, fill in three of A, B, C and D and leave the unknown one empty.",
    "To divide a total, enter the amount and the ratio parts. Each share is shown with the working.",
  ],
  howItWorks: [
    "Simplifying finds the greatest common divisor of all terms and divides each one by it. If you enter decimals, the calculator first scales every term by the same power of 10 to make them whole numbers, so 1.5:2.5 becomes 15:25 and then 3:5.",
    "A proportion says two ratios are equal, A:B = C:D, which means A × D = B × C. Knowing any three values lets you solve for the fourth by cross-multiplying.",
    "To divide a total, the parts are added together to find how many equal shares there are. The total is divided by that number, and each part receives its count of shares.",
  ],
  formulas: [
    { label: "Simplify", expression: "A:B → (A ÷ g):(B ÷ g), where g = gcd(A, B)" },
    {
      label: "Missing value in A:B = C:D",
      expression: "D = B × C ÷ A   (or A = B × C ÷ D, and so on)",
    },
    {
      label: "Divide a total T in the ratio a:b:c",
      expression: "Share of a = T × a ÷ (a + b + c)",
    },
  ],
  examples: [
    {
      title: "Simplify 24:36",
      steps: ["gcd(24, 36) = 12", "24 ÷ 12 = 2; 36 ÷ 12 = 3"],
      result: "24:36 = 2:3.",
    },
    {
      title: "Scale a recipe: 3 cups of flour to 4 eggs. How many eggs for 15 cups?",
      steps: ["3:4 = 15:x", "x = 4 × 15 ÷ 3 = 20"],
      result: "20 eggs.",
    },
    {
      title: "Split 1,200 of profit in the ratio 2:3:5",
      steps: ["Total parts: 2 + 3 + 5 = 10", "One part = 1,200 ÷ 10 = 120", "Shares: 2 × 120 = 240; 3 × 120 = 360; 5 × 120 = 600"],
      result: "240, 360 and 600.",
    },
  ],
  sections: [
    {
      heading: "How do I turn a ratio into a percentage or fraction?",
      paragraphs: [
        "Add the parts to get the whole, then divide each part by it. In 2:3 there are 5 parts, so the first quantity is 2/5 (40%) and the second is 3/5 (60%). Note that 2:3 does not mean two-thirds: the fraction 2/3 compares the first part with the second, not with the total.",
      ],
    },
    {
      heading: "How do I scale a ratio to a specific size?",
      paragraphs: [
        "Solve it as a proportion. For a 16:9 screen that must be 1,280 pixels wide, enter 16:9 = 1,280:x, and the height comes out as 9 × 1,280 ÷ 16 = 720.",
      ],
    },
  ],
  faqs: [
    {
      question: "Can a ratio have decimals?",
      answer:
        "Yes. The calculator converts decimal terms to whole numbers before simplifying, so 0.75:1.25 simplifies to 3:5.",
    },
    {
      question: "Does the order of a ratio matter?",
      answer:
        "Yes. 2:3 and 3:2 describe different mixtures. Keep the terms in the same order as the quantities they describe.",
    },
    {
      question: "What does a 1:4 mix mean for paint or concentrate?",
      answer:
        "One part of the first ingredient to four parts of the second, or five parts in total. For 2.5 liters of mix, that is 0.5 liters of concentrate and 2 liters of water.",
    },
    {
      question: "Why can't a ratio term be zero?",
      answer:
        "A zero term can't be simplified meaningfully, and it makes proportions divide by zero. Use values greater than zero.",
    },
    {
      question: "Can I simplify a ratio with three parts?",
      answer:
        "Yes. All three terms are divided by their shared greatest common divisor, so 12:18:30 becomes 2:3:5.",
    },
  ],
};

export default content;
