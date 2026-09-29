import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "Compound interest is calculated with A = P(1 + r/n)^(nt), where P is the starting balance, r the annual rate as a decimal, n the number of compounding periods per year and t the number of years. $10,000 at 5% compounded monthly for 10 years grows to 10,000 × (1 + 0.05/12)^120 ≈ $16,470.09.",
  intro:
    "Compounding means you earn interest on your interest, not only on the money you put in. Over short periods the effect is small, but over decades it becomes the main driver of growth in savings and investments, and of cost in debts that are allowed to build. This guide covers the formula, what changes when interest compounds more often, and how regular deposits fit in.",
  steps: [
    "Write down the principal (P), the annual interest rate (r) and the number of years (t).",
    "Convert the rate to a decimal: 5% becomes 0.05.",
    "Identify how often interest compounds (n): 1 for yearly, 4 for quarterly, 12 for monthly, 365 for daily.",
    "Divide the rate by n to get the rate per period, and multiply n by t to get the number of periods.",
    "Raise (1 + r/n) to the power of nt, then multiply by P to get the final amount A.",
    "Subtract P from A if you want the interest earned on its own.",
  ],
  formulas: [
    {
      label: "Compound interest",
      expression: "A = P × (1 + r/n)^(n × t)",
      variables: [
        { symbol: "A", meaning: "final amount, including principal and interest" },
        { symbol: "P", meaning: "principal, the starting balance" },
        { symbol: "r", meaning: "annual nominal interest rate as a decimal" },
        { symbol: "n", meaning: "compounding periods per year" },
        { symbol: "t", meaning: "time in years" },
      ],
    },
    {
      label: "Continuous compounding",
      expression: "A = P × e^(r × t)",
      variables: [{ symbol: "e", meaning: "Euler's number, about 2.71828" }],
      note: "This is the upper limit as compounding becomes infinitely frequent.",
    },
    {
      label: "Future value of regular deposits",
      expression: "FV = PMT × ((1 + i)^N − 1) ÷ i",
      variables: [
        { symbol: "PMT", meaning: "the deposit made at the end of each period" },
        { symbol: "i", meaning: "interest rate per period (r ÷ n)" },
        { symbol: "N", meaning: "total number of deposits" },
      ],
      note: "Add this to the compound growth of any starting balance to get the total.",
    },
    {
      label: "Annual percentage yield",
      expression: "APY = (1 + r/n)^n − 1",
      note: "APY is the effective yearly growth once compounding is included.",
    },
  ],
  examples: [
    {
      title: "$10,000 at 5% for 10 years, compounded monthly",
      steps: [
        "Rate per period: 0.05 ÷ 12 ≈ 0.0041667",
        "Number of periods: 12 × 10 = 120",
        "Growth factor: 1.0041667^120 ≈ 1.647009",
        "A = 10,000 × 1.647009 ≈ 16,470.09",
      ],
      result: "The balance reaches about $16,470.09, of which $6,470.09 is interest.",
    },
    {
      title: "How compounding frequency changes the same deposit",
      steps: [
        "Annually: 10,000 × 1.05^10 ≈ 16,288.95",
        "Monthly: ≈ 16,470.09",
        "Daily: 10,000 × (1 + 0.05/365)^3650 ≈ 16,486.65",
        "Continuously: 10,000 × e^0.5 ≈ 16,487.21",
      ],
      result: "Going from yearly to monthly compounding adds about $181; going from monthly to continuous adds only about $17 more.",
    },
    {
      title: "Saving $200 a month at 6% for 20 years",
      steps: [
        "Rate per month: 0.06 ÷ 12 = 0.005",
        "Deposits: 12 × 20 = 240",
        "1.005^240 ≈ 3.310204",
        "FV = 200 × (3.310204 − 1) ÷ 0.005 ≈ 92,408.18",
        "Total deposited: 200 × 240 = 48,000",
      ],
      result: "The account holds about $92,408.18, so roughly $44,408 came from interest rather than deposits.",
    },
  ],
  sections: [
    {
      heading: "How is compound interest different from simple interest?",
      paragraphs: [
        "Simple interest is always calculated on the original principal. Compound interest is calculated on the current balance, which includes interest already added. At 5% a year, $10,000 earns $500 of simple interest every year, reaching $15,000 after 10 years. With annual compounding, it reaches $16,288.95, because each year's 5% applies to a larger balance.",
        "The gap starts small and widens with time. That is why the length of time money is left to compound usually matters more than small differences in rate.",
      ],
    },
    {
      heading: "Does compounding more often make a big difference?",
      paragraphs: [
        "It helps, but with rapidly diminishing returns, as the frequency example shows. The jump from annual to monthly is noticeable; beyond daily it is negligible. When comparing accounts, a higher rate almost always beats a more frequent compounding schedule at a lower rate.",
      ],
    },
    {
      heading: "What is the difference between APR and APY?",
      paragraphs: [
        "APR is the nominal annual rate before compounding is taken into account. APY, sometimes called the effective annual rate, is what the balance actually grows by in a year once compounding is included. A 5% APR compounded monthly is an APY of (1 + 0.05/12)^12 − 1 ≈ 5.116%.",
        "Savings accounts in the US typically advertise APY, which makes comparison easy. For loans, lenders usually quote APR, which also includes certain fees, so the two figures are not always directly comparable.",
      ],
    },
    {
      heading: "How accurate is the rule of 72?",
      paragraphs: [
        "The rule of 72 estimates how long money takes to double: divide 72 by the annual percentage rate. It is a mental shortcut, not an exact formula. At 6%, it predicts 12 years; the exact answer with annual compounding is about 11.9 years. At 8%, it predicts 9 years, almost exactly right. The estimate drifts further off at very low or very high rates.",
        "For an exact doubling time with annual compounding, use t = ln 2 ÷ ln(1 + r).",
      ],
    },
    {
      heading: "What the formula leaves out",
      list: [
        "Investment returns are not fixed. Stocks and funds rise and fall, so a steady rate is an illustration, not a forecast.",
        "Inflation reduces what the final amount can buy. A real, inflation-adjusted return is lower than the nominal rate.",
        "Taxes on interest or gains, and account or fund fees, reduce the effective growth rate.",
        "The timing of deposits matters. Money deposited at the start of each period earns one extra period of interest compared with deposits at the end.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate compound interest for months instead of years?",
      answer:
        "Express the time in years, so 18 months is t = 1.5. Alternatively, count periods directly: with monthly compounding, 18 months is 18 periods at r ÷ 12 each.",
    },
    {
      question: "Why is compound interest called interest on interest?",
      answer:
        "Once interest is credited, it becomes part of the balance and earns interest itself in the next period. Over many periods, the interest earned on past interest can exceed the interest earned on the original deposit.",
    },
    {
      question: "Does compound interest work against me on debt?",
      answer:
        "Yes. Credit card balances and some loans compound, so unpaid interest adds to what you owe and accrues more interest. Paying more than the minimum stops that cycle sooner.",
    },
    {
      question: "What does continuous compounding mean?",
      answer:
        "It is the mathematical limit of compounding infinitely often, calculated with A = Pe^(rt). In practice it produces only slightly more than daily compounding and is used mostly in finance theory.",
    },
    {
      question: "What rate should I use for an investment projection?",
      answer:
        "There is no correct single figure. Many people run several scenarios, such as a cautious, a middle and an optimistic rate, to see a range of outcomes rather than relying on one number.",
    },
  ],
  disclaimer:
    "These examples are for education and assume a constant rate with no taxes, fees or inflation. Real returns vary and past performance does not guarantee future results. For decisions about your own savings or investments, consider speaking with a qualified financial professional.",
};

export default guide;
