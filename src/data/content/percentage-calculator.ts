import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To find X% of Y, divide X by 100 and multiply by Y. For example, 20% of 150 is 0.20 × 150 = 30. To find what percent X is of Y, divide X by Y and multiply by 100.",
  intro:
    "Percentages come up everywhere, from test scores and pay rises to discounts and nutrition labels. This calculator handles the four questions people ask most often and shows the working for each answer, so you can check it or repeat it by hand.",
  howToUse: [
    "Choose the type of question: X% of Y, X is what percent of Y, percentage change, or X is P% of what number.",
    "Type your two numbers. Decimals and negative numbers are fine.",
    "The answer updates as you type, with each step of the calculation shown underneath.",
    "Use Copy result to paste the answer elsewhere, or Reset to start again.",
  ],
  howItWorks: [
    "A percentage is a number expressed as a fraction of 100. \"Per cent\" literally means \"per hundred\", so 25% means 25 out of every 100, or 0.25.",
    "Every percentage problem involves three quantities: the part, the whole, and the percentage. If you know any two of them, you can find the third by rearranging one formula. The calculator picks the right rearrangement based on the mode you choose.",
    "For percentage change, the difference between the new and old values is divided by the old value. That is why a rise from 50 to 75 (+50%) is not undone by a fall from 75 to 50 (−33.3%): the starting point is different each time.",
  ],
  formulas: [
    {
      label: "Percentage of a number",
      expression: "Result = (X ÷ 100) × Y",
      variables: [
        { symbol: "X", meaning: "the percentage" },
        { symbol: "Y", meaning: "the number you are taking a percentage of" },
      ],
    },
    {
      label: "What percent one number is of another",
      expression: "Percentage = (Part ÷ Whole) × 100",
    },
    {
      label: "Percentage change",
      expression: "Change % = ((New − Old) ÷ |Old|) × 100",
      note: "A positive result is an increase; a negative result is a decrease.",
    },
    {
      label: "Finding the whole",
      expression: "Whole = Part ÷ (P ÷ 100)",
    },
  ],
  examples: [
    {
      title: "What is 20% of 150?",
      steps: ["20 ÷ 100 = 0.20", "0.20 × 150 = 30"],
      result: "20% of 150 is 30.",
    },
    {
      title: "You scored 42 out of 60. What percentage is that?",
      steps: ["42 ÷ 60 = 0.7", "0.7 × 100 = 70"],
      result: "42 out of 60 is 70%.",
    },
    {
      title: "Rent went from 1,200 to 1,290 a month. What is the percentage increase?",
      steps: ["1,290 − 1,200 = 90", "90 ÷ 1,200 = 0.075", "0.075 × 100 = 7.5"],
      result: "Rent increased by 7.5%.",
    },
    {
      title: "A 15% deposit was 45. What was the full price?",
      steps: ["15 ÷ 100 = 0.15", "45 ÷ 0.15 = 300"],
      result: "The full price was 300.",
    },
  ],
  sections: [
    {
      heading: "How do you calculate a percentage decrease?",
      paragraphs: [
        "Use the same percentage change formula. Subtract the old value from the new one, divide by the old value and multiply by 100. The result is negative, which tells you it is a decrease. A price falling from 80 to 60 is (60 − 80) ÷ 80 × 100 = −25%, a 25% decrease.",
      ],
    },
    {
      heading: "Percentage vs percentage points",
      paragraphs: [
        "When a rate moves from 4% to 5%, it has risen by one percentage point, but by 25% in relative terms (1 ÷ 4 × 100). News reports and financial documents often mix these up, so check which one is meant before comparing figures.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate a percentage of a number quickly?",
      answer:
        "Move the decimal point to turn the percentage into a decimal, then multiply. 10% is one-tenth, so 10% of 250 is 25. For 5%, halve the 10% figure; for 15%, add 10% and 5% together.",
    },
    {
      question: "Why can't I calculate percentage change from zero?",
      answer:
        "Percentage change divides by the starting value. Dividing by zero is undefined, so any change from zero cannot be expressed as a percentage. Describe it as an absolute change instead, such as \"up by 40\".",
    },
    {
      question: "Can a percentage be more than 100%?",
      answer:
        "Yes. 150% of 40 is 60, and a value that triples has increased by 200%. Percentages above 100 simply mean more than the whole you are comparing against.",
    },
    {
      question: "Is X% of Y the same as Y% of X?",
      answer:
        "Yes. Multiplication works in either order, so 8% of 50 equals 50% of 8. Both are 4. This trick is handy for mental math.",
    },
    {
      question: "How do I reverse a percentage increase?",
      answer:
        "Divide by (1 + the percentage as a decimal). If a price after a 20% increase is 96, the original was 96 ÷ 1.20 = 80. Subtracting 20% from 96 would give the wrong answer of 76.8.",
    },
  ],
};

export default content;
