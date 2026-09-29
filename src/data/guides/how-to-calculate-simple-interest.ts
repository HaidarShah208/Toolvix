import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "Simple interest is I = P × R × T: the principal times the annual rate (as a decimal) times the time in years. $5,000 at 4% for 3 years earns 5,000 × 0.04 × 3 = $600 in interest, for a total of $5,600.",
  intro:
    "Simple interest is the most direct way to charge or earn interest: a fixed percentage of the original amount, for as long as the money is lent. It is used for many short-term loans, some auto loans, certificates of deposit that pay out interest instead of reinvesting it, and bonds that pay fixed coupons. The formula is easy; the details that trip people up are units of time and day-count conventions.",
  steps: [
    "Identify the principal (P), the amount borrowed or deposited.",
    "Convert the annual interest rate to a decimal by dividing by 100, so 4% becomes 0.04.",
    "Express the time in years: divide months by 12, or divide days by 365 (or by 360 if the agreement uses that convention).",
    "Multiply P × R × T to get the interest.",
    "Add the interest to the principal if you need the total amount repaid or received: A = P + I.",
  ],
  formulas: [
    {
      label: "Simple interest",
      expression: "I = P × R × T",
      variables: [
        { symbol: "I", meaning: "interest earned or owed" },
        { symbol: "P", meaning: "principal, the original amount" },
        { symbol: "R", meaning: "annual interest rate as a decimal" },
        { symbol: "T", meaning: "time in years" },
      ],
    },
    {
      label: "Total amount",
      expression: "A = P × (1 + R × T)",
      note: "This is the same as P + I.",
    },
    {
      label: "Solving for the other values",
      expression: "P = I ÷ (R × T)   R = I ÷ (P × T)   T = I ÷ (P × R)",
      note: "Rearrange the same formula to find whichever value is missing.",
    },
    {
      label: "Time from days",
      expression: "T = days ÷ 365 (actual/365) or T = days ÷ 360 (30/360 or actual/360)",
      note: "Which denominator applies depends on the contract or account terms.",
    },
  ],
  examples: [
    {
      title: "$5,000 at 4% for 3 years",
      steps: ["I = 5,000 × 0.04 × 3 = 600", "A = 5,000 + 600 = 5,600"],
      result: "The interest is $600, and the total is $5,600.",
    },
    {
      title: "The same deposit for 18 months",
      steps: ["T = 18 ÷ 12 = 1.5 years", "I = 5,000 × 0.04 × 1.5 = 300"],
      result: "Over 18 months, the interest is $300.",
    },
    {
      title: "A 90-day loan of $12,000 at 6%, under two day-count conventions",
      steps: [
        "Actual/365: T = 90 ÷ 365 ≈ 0.246575, so I = 12,000 × 0.06 × 0.246575 ≈ 177.53",
        "Actual/360: T = 90 ÷ 360 = 0.25, so I = 12,000 × 0.06 × 0.25 = 180.00",
      ],
      result: "The 360-day convention charges $2.47 more for the same 90 days, about 1.4% extra.",
    },
    {
      title: "What rate earned $75 on $2,000 in 9 months?",
      steps: ["T = 9 ÷ 12 = 0.75", "R = 75 ÷ (2,000 × 0.75) = 75 ÷ 1,500 = 0.05"],
      result: "The annual simple interest rate was 5%.",
    },
  ],
  sections: [
    {
      heading: "How is simple interest different from compound interest?",
      paragraphs: [
        "With simple interest, the interest is always based on the original principal. With compound interest, each period's interest is added to the balance and earns interest itself. $5,000 at 4% for 3 years gives $600 of simple interest, but with annual compounding it grows to 5,000 × 1.04³ = $5,624.32, or $624.32 of interest.",
        "The difference is small over a few years at modest rates and grows large over long periods. Simple interest grows in a straight line; compound interest curves upward.",
      ],
    },
    {
      heading: "How do you handle months and days?",
      paragraphs: [
        "The rate in the formula is almost always an annual rate, so time must be in years. Months are divided by 12: 6 months is 0.5 years. Days are divided by the number of days in the year the contract uses.",
        "A common error is to plug in 18 for 18 months or 90 for 90 days. That multiplies the interest by 12 or 365 and produces an absurd result, which is a useful sign that something went wrong.",
      ],
    },
    {
      heading: "What are the 365-day and 360-day conventions?",
      paragraphs: [
        "Lenders and markets use several day-count conventions. Actual/365 counts the real number of days and divides by 365. Actual/360 counts the real days but divides by 360, which slightly increases the interest for a given rate. 30/360 treats every month as 30 days and the year as 360 days, which makes monthly figures tidy.",
        "Actual/360 is common in commercial lending and money markets, while many consumer products use actual/365. Neither is wrong, but the choice changes the amount owed, so check the terms if the exact figure matters.",
      ],
    },
    {
      heading: "Where is simple interest used?",
      list: [
        "Short-term personal or business loans and some auto loans, where interest accrues daily on the outstanding principal.",
        "Certificates of deposit and savings products that pay interest out rather than adding it to the balance.",
        "Fixed-coupon bonds, which pay the same interest amount each period based on face value.",
        "Informal loans between people, where a flat percentage is easy to agree on.",
      ],
    },
    {
      heading: "Does a simple interest loan with monthly payments still use I = PRT?",
      paragraphs: [
        "Yes, but it applies to the balance still owed, not the original amount for the whole term. Each day or month, interest is calculated as balance × rate × time for that period, and your payment covers that interest first. As the balance falls, so does the interest. That is why paying early or paying extra on a simple interest loan reduces total interest.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the formula for simple interest?",
      answer:
        "I = P × R × T, where P is the principal, R is the annual rate as a decimal and T is the time in years. Add I to P for the total amount.",
    },
    {
      question: "How do I calculate simple interest per month?",
      answer:
        "Divide the annual interest by 12, or use T = 1/12. $8,000 at 5.5% earns 8,000 × 0.055 ÷ 12 ≈ $36.67 a month.",
    },
    {
      question: "How do I find the time from simple interest?",
      answer:
        "Use T = I ÷ (P × R). If $600 was earned on $5,000 at 4%, then T = 600 ÷ 200 = 3 years.",
    },
    {
      question: "Is simple interest better than compound interest?",
      answer:
        "For a borrower, simple interest usually costs less at the same rate. For a saver, compound interest earns more, so it depends which side of the arrangement you are on.",
    },
    {
      question: "What does a 10% flat rate mean?",
      answer:
        "A flat rate charges simple interest on the original loan amount for the whole term, even as you repay it. Because the balance shrinks while the interest does not, the effective rate is considerably higher than the quoted flat rate.",
    },
  ],
  disclaimer:
    "This guide explains the arithmetic of simple interest for general education. Actual loans and deposits may use different day-count conventions, fees and terms, so rely on your agreement or lender for exact figures.",
};

export default guide;
