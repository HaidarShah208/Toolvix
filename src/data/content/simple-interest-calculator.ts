import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Simple interest is I = P × R × T: principal times the annual rate (as a decimal) times the time in years. 5,000 at 4% for 3 years earns 5,000 × 0.04 × 3 = 600 in interest, for a final amount of 5,600.",
  intro:
    "Simple interest is charged or earned only on the original principal, never on interest that has already built up. It is used for many short-term loans, some car loans, bonds' coupon payments and classroom problems. Enter the principal, rate and time to get the interest, the final amount and a year-by-year breakdown.",
  howToUse: [
    "Enter the principal: the amount borrowed or invested.",
    "Enter the annual interest rate as a percentage.",
    "Enter the time and choose whether it is in years, months or days.",
    "Read the interest and final amount, and check the yearly breakdown to see the balance grow by the same amount each year.",
  ],
  howItWorks: [
    "The rate is converted from a percentage to a decimal, and the time is converted to years: months are divided by 12 and days by 365. Multiplying the three together gives the interest.",
    "Because interest is always calculated on the original principal, it grows in a straight line. Every full year adds exactly P × R, which is what the yearly breakdown shows. Compare that with compound interest, where each year's interest is larger than the last.",
    "Some lenders use a 360-day year for day counts, which gives slightly more interest. This calculator uses 365 days, so check your agreement if you need to match a lender's figure to the cent.",
  ],
  formulas: [
    {
      label: "Simple interest",
      expression: "I = P × R × T",
      variables: [
        { symbol: "I", meaning: "interest" },
        { symbol: "P", meaning: "principal" },
        { symbol: "R", meaning: "annual rate as a decimal (4% = 0.04)" },
        { symbol: "T", meaning: "time in years (months ÷ 12, days ÷ 365)" },
      ],
    },
    { label: "Final amount", expression: "A = P + I = P × (1 + R × T)" },
    {
      label: "Solving for the rate",
      expression: "R = I ÷ (P × T)",
      note: "Multiply by 100 to express it as a percentage.",
    },
  ],
  examples: [
    {
      title: "5,000 at 4% for 3 years",
      steps: ["I = 5,000 × 0.04 × 3 = 600", "Each year adds 200: 5,200, 5,400, 5,600"],
      result: "Interest 600; final amount 5,600.",
    },
    {
      title: "10,000 at 5% for 18 months",
      steps: ["T = 18 ÷ 12 = 1.5 years", "I = 10,000 × 0.05 × 1.5 = 750"],
      result: "Interest 750; final amount 10,750.",
    },
    {
      title: "2,000 at 7% for 90 days",
      steps: ["T = 90 ÷ 365 ≈ 0.2466 years", "I = 2,000 × 0.07 × 90 ÷ 365 ≈ 34.52"],
      result: "Interest about 34.52; final amount 2,034.52.",
    },
  ],
  sections: [
    {
      heading: "When is simple interest used instead of compound interest?",
      paragraphs: [
        "Simple interest suits arrangements where interest is paid out or settled as it falls due, so it never gets added to the balance. Examples include many short-term personal and business loans, certain auto loans, and bonds that pay a fixed coupon. Savings accounts and credit cards almost always compound, so use the compound interest calculator for those.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the difference between simple and compound interest?",
      answer:
        "Simple interest is calculated only on the principal. Compound interest is calculated on the principal plus interest already earned, so it grows faster over time. At 5% for 10 years, 10,000 earns 5,000 simple interest but about 6,289 compounded annually.",
    },
    {
      question: "How do I calculate simple interest per month?",
      answer:
        "Divide the annual interest by 12, or use P × R ÷ 12. For 12,000 at 6%, that is 12,000 × 0.06 ÷ 12 = 60 a month.",
    },
    {
      question: "How do I find the principal if I know the interest?",
      answer:
        "Rearrange the formula to P = I ÷ (R × T). If 3 years at 4% produced 600 of interest, the principal was 600 ÷ 0.12 = 5,000.",
    },
    {
      question: "Why does the calculator use 365 days?",
      answer:
        "It is the most common convention for everyday calculations. Some banks use 360 days (the \"banker's rule\"), which slightly increases the interest for the same number of days.",
    },
  ],
};

export default content;
