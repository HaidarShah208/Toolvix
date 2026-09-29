import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "To calculate a percentage, divide the part by the whole and multiply by 100. For example, 45 out of 60 is 45 ÷ 60 × 100 = 75%. To find a percentage of a number, turn the percent into a decimal and multiply: 35% of 240 is 0.35 × 240 = 84.",
  intro:
    "Almost every percentage question is a variation on one relationship between a part, a whole and a rate. Once you can spot which of the three you are missing, the arithmetic is short. This guide walks through the three core formulas, the traps that catch people out, and how to check an answer in your head.",
  steps: [
    "Decide what the question is asking for: a percentage of a number, what percent one number is of another, or how much something has changed in percentage terms.",
    "Identify the whole, meaning the total or the starting value that everything is compared against. In percentage change, the whole is always the original value.",
    "Convert any percentage you are given into a decimal by dividing it by 100, so 35% becomes 0.35 and 7.5% becomes 0.075.",
    "Apply the matching formula: multiply for a percentage of a number, divide part by whole for a percentage, or divide the difference by the original value for change.",
    "Multiply by 100 if you need the answer as a percentage rather than a decimal, then round only at the very end.",
    "Sanity-check the result against an easy benchmark such as 10%, 25% or 50% of the same number.",
  ],
  formulas: [
    {
      label: "Percentage of a number",
      expression: "Part = (P ÷ 100) × Whole",
      variables: [
        { symbol: "P", meaning: "the percentage you are taking" },
        { symbol: "Whole", meaning: "the number you are taking the percentage of" },
      ],
    },
    {
      label: "What percent one number is of another",
      expression: "P = (Part ÷ Whole) × 100",
      variables: [
        { symbol: "Part", meaning: "the portion you are measuring" },
        { symbol: "Whole", meaning: "the total it belongs to" },
      ],
    },
    {
      label: "Percentage change",
      expression: "Change % = ((New − Old) ÷ Old) × 100",
      variables: [
        { symbol: "New", meaning: "the value after the change" },
        { symbol: "Old", meaning: "the original value, which sets the baseline" },
      ],
      note: "A negative result means a decrease. The formula is undefined when Old is zero.",
    },
    {
      label: "Reversing a percentage increase",
      expression: "Original = Final ÷ (1 + P ÷ 100)",
      note: "For a decrease, divide by (1 − P ÷ 100) instead.",
    },
  ],
  examples: [
    {
      title: "What is 35% of 240?",
      steps: ["35 ÷ 100 = 0.35", "0.35 × 240 = 84"],
      result: "35% of 240 is 84.",
    },
    {
      title: "A quiz has 25 questions and you answered 18 correctly. What is your score?",
      steps: ["18 ÷ 25 = 0.72", "0.72 × 100 = 72"],
      result: "Your score is 72%.",
    },
    {
      title: "A ticket price rose from $64 to $80, then fell back to $64.",
      steps: [
        "Rise: (80 − 64) ÷ 64 = 16 ÷ 64 = 0.25, so +25%",
        "Fall: (64 − 80) ÷ 80 = −16 ÷ 80 = −0.20, so −20%",
      ],
      result: "The price went up 25% and then down 20%, even though the dollar change was $16 both times.",
    },
    {
      title: "A receipt shows $54.00 including 8% sales tax. What was the pre-tax price?",
      steps: ["1 + 8 ÷ 100 = 1.08", "54 ÷ 1.08 = 50"],
      result: "The price before tax was $50.00. Taking 8% off $54 would give $49.68, which is wrong.",
    },
  ],
  sections: [
    {
      heading: "What does a percentage actually mean?",
      paragraphs: [
        "A percentage is a ratio scaled so the whole equals 100. Saying 72% is the same as saying 72 out of every 100, or the fraction 72/100, or the decimal 0.72. All three are interchangeable, and switching between them is most of the work in any percentage problem.",
        "The reason percentages are useful is that they let you compare parts of wholes that are different sizes. Scoring 18 out of 25 and 36 out of 50 feel different, but both are 72%.",
      ],
    },
    {
      heading: "Which number is the whole?",
      paragraphs: [
        "Most wrong answers come from dividing by the wrong number. The whole is whatever the question treats as the reference point. In \"what percent of the class passed\", it is the class size. In \"how much did sales grow\", it is last period's sales, not this period's.",
        "A useful habit is to rephrase the question as \"___ is what percent of ___?\" The number after \"of\" goes on the bottom of the fraction.",
      ],
    },
    {
      heading: "Why don't percentage increases and decreases cancel out?",
      paragraphs: [
        "Because each one is measured against a different starting value. In the ticket example, the $16 rise is a quarter of $64, while the $16 fall is only a fifth of $80. The same logic explains why a 50% loss needs a 100% gain to recover: halving 200 gives 100, and you have to double 100 to get back to 200.",
        "When two percentage changes happen in sequence, multiply their factors rather than adding the percentages. A 10% rise followed by a 10% fall is 1.10 × 0.90 = 0.99, a net 1% decrease.",
      ],
    },
    {
      heading: "Percentages vs percentage points",
      paragraphs: [
        "If an interest rate moves from 4% to 5%, it has gone up by 1 percentage point. In relative terms, that is a 25% increase, because 1 is a quarter of 4. Both statements are true, but they describe different things. Percentage points measure the gap between two percentages; percent change measures how large that gap is relative to where you started.",
      ],
    },
    {
      heading: "How can you estimate percentages in your head?",
      list: [
        "10% is the number divided by 10: 10% of 240 is 24.",
        "5% is half of 10%: 5% of 240 is 12.",
        "1% is the number divided by 100, which makes odd rates easy to build: 3% of 240 is 3 × 2.4 = 7.2.",
        "25% is a quarter and 50% is a half, so 75% is the total minus a quarter.",
        "Swap the numbers when it helps: 16% of 25 equals 25% of 16, which is 4.",
      ],
    },
    {
      heading: "Common mistakes",
      list: [
        "Subtracting a percentage to undo an increase. Divide by the growth factor instead, as in the sales tax example.",
        "Adding successive percentage changes instead of multiplying them.",
        "Rounding intermediate steps, which can shift the final answer, especially with large numbers.",
        "Calculating change from zero. There is no meaningful percentage increase from a starting value of 0; report the absolute change.",
        "Mixing up percentage points and percent when comparing rates.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I turn a fraction into a percentage?",
      answer:
        "Divide the top number by the bottom number and multiply by 100. For example, 3/8 is 3 ÷ 8 = 0.375, which is 37.5%.",
    },
    {
      question: "How do I find the original number if I only know a percentage of it?",
      answer:
        "Divide the part by the percentage as a decimal. If 30 is 12% of a number, the number is 30 ÷ 0.12 = 250.",
    },
    {
      question: "What is the difference between percentage change and percentage difference?",
      answer:
        "Percentage change uses the original value as the baseline and has a direction. Percentage difference compares two values with no natural starting point, usually by dividing their gap by their average, so it is always positive.",
    },
    {
      question: "Can a percentage be negative?",
      answer:
        "A share of a whole cannot be negative, but a percentage change can. A result of −20% means the value fell by a fifth of its original size.",
    },
    {
      question: "How do I add a percentage to a number?",
      answer:
        "Multiply by 1 plus the rate as a decimal. Adding 15% to 80 is 80 × 1.15 = 92.",
    },
  ],
};

export default guide;
