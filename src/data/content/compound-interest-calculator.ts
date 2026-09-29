import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Compound interest follows A = P(1 + r/n)^(nt). 10,000 invested at 5% a year, compounded monthly for 10 years, grows to 10,000 × (1 + 0.05/12)¹²⁰ ≈ 16,470.09.",
  intro:
    "Compounding means you earn interest on your interest, so growth speeds up the longer money is left alone. Enter a starting balance, rate and time, choose how often interest compounds, and optionally add a monthly contribution to see the final balance, how much of it you paid in, how much is interest, and a year-by-year table.",
  howToUse: [
    "Enter the initial deposit and the expected annual interest rate.",
    "Enter the number of years and choose the compounding frequency: annually, semi-annually, quarterly, monthly, daily or continuously.",
    "Optionally enter a monthly contribution. It is added at the end of each month.",
    "Read the final balance, total contributions, total interest and APY, then scroll the yearly table to watch the growth.",
  ],
  howItWorks: [
    "Each compounding period, interest at r/n is added to the balance, and the next period's interest is calculated on that larger total. More frequent compounding gives slightly more interest, but the gain shrinks quickly: on 10,000 at 5% for 10 years, daily compounding beats monthly by only about 17.",
    "Continuous compounding is the mathematical limit of compounding infinitely often and uses the constant e ≈ 2.71828. APY (annual percentage yield) converts any frequency into the equivalent once-a-year rate, which makes accounts easy to compare.",
    "Monthly contributions are treated as deposits made at the end of each month, each of which then grows for the time remaining. Results assume a constant rate and ignore taxes, fees and inflation.",
  ],
  formulas: [
    {
      label: "Compound interest",
      expression: "A = P(1 + r/n)^(nt)",
      variables: [
        { symbol: "A", meaning: "final balance" },
        { symbol: "P", meaning: "initial deposit" },
        { symbol: "r", meaning: "annual rate as a decimal" },
        { symbol: "n", meaning: "compounding periods per year" },
        { symbol: "t", meaning: "years" },
      ],
    },
    { label: "Continuous compounding", expression: "A = Pe^(rt)" },
    {
      label: "Annual percentage yield",
      expression: "APY = (1 + r/n)ⁿ − 1",
      note: "For continuous compounding, APY = e^r − 1.",
    },
    {
      label: "Monthly contributions (monthly compounding)",
      expression: "FV = PMT × ((1 + r/12)^(12t) − 1) ÷ (r/12)",
      note: "Added to the growth of the initial deposit.",
    },
  ],
  examples: [
    {
      title: "10,000 at 5% for 10 years, compounding compared",
      steps: [
        "Annually: 10,000 × 1.05¹⁰ ≈ 16,288.95",
        "Monthly: 10,000 × (1 + 0.05/12)¹²⁰ ≈ 16,470.09",
        "Daily: ≈ 16,486.65",
        "Continuously: 10,000 × e^0.5 ≈ 16,487.21",
      ],
      result: "Moving from annual to monthly compounding adds about 181; going further to continuous adds only about 17 more.",
    },
    {
      title: "Adding 200 a month",
      steps: [
        "Growth of the 10,000 deposit (monthly, 5%, 10 years): 16,470.09",
        "Contributions: 200 × ((1 + 0.05/12)¹²⁰ − 1) ÷ (0.05/12) ≈ 31,056.46",
        "Final balance ≈ 47,526.55",
        "Total paid in: 10,000 + 200 × 120 = 34,000; interest ≈ 13,526.55",
      ],
      result: "About 47,526.55, of which roughly 13,526.55 is interest.",
    },
    {
      title: "APY of 5% compounded monthly",
      steps: ["(1 + 0.05/12)¹² − 1 ≈ 0.05116"],
      result: "APY ≈ 5.12%.",
    },
  ],
  sections: [
    {
      heading: "How long does it take to double my money?",
      paragraphs: [
        "The rule of 72 gives a quick estimate: divide 72 by the annual rate. At 6%, money roughly doubles in 12 years; at 8%, in about 9. It is an approximation that works best for rates between about 4% and 12%. For an exact answer, try different year values here until the balance reaches twice the deposit.",
      ],
    },
    {
      heading: "Does compounding frequency matter more than the rate?",
      paragraphs: [
        "Rarely. A higher rate or longer time horizon moves the result far more than switching from monthly to daily compounding. When comparing savings accounts, compare APYs, since they already include the compounding effect.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the difference between APR and APY?",
      answer:
        "APR is the stated annual rate before compounding. APY includes compounding, so it is the rate you effectively earn in a year. At 5% compounded monthly, the APY is about 5.12%.",
    },
    {
      question: "Are the contributions added at the start or end of each month?",
      answer:
        "At the end of each month. Deposits made at the start of the month would earn one extra month of interest, giving a slightly higher balance.",
    },
    {
      question: "Can I use this for stock market investments?",
      answer:
        "Only as a rough illustration. Investment returns vary from year to year and can be negative, while this calculator assumes the same rate every year.",
    },
    {
      question: "Does the calculator account for inflation or taxes?",
      answer:
        "No. To estimate real growth, you can enter a rate reduced by expected inflation, but tax treatment depends on the account and where you live.",
    },
    {
      question: "What is continuous compounding?",
      answer:
        "It is the limit as compounding becomes infinitely frequent, calculated as Pe^(rt). In practice it gives almost the same result as daily compounding.",
    },
  ],
  disclaimer:
    "This calculator is for illustration only and is not financial advice. It assumes a constant rate of return, which is not guaranteed, and does not account for taxes, fees or inflation. Actual results will differ; consider speaking to a qualified financial adviser before investing.",
};

export default content;
