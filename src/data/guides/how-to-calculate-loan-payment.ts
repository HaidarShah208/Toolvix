import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "A fixed monthly loan payment is M = P × r(1 + r)^n ÷ ((1 + r)^n − 1), where P is the amount borrowed, r is the monthly interest rate and n is the number of monthly payments. A $25,000 loan at 7% a year over 5 years has r = 0.07 ÷ 12 and n = 60, giving a payment of about $495.03.",
  intro:
    "Car loans, personal loans and most fixed-rate mortgages are amortizing loans: you pay the same amount every month, and each payment covers that month's interest with the rest reducing the balance. Knowing how the payment is built lets you compare offers properly, see what a longer term really costs and judge whether extra payments are worth it.",
  steps: [
    "Note the loan amount (P), the annual interest rate and the term in years.",
    "Convert the annual rate to a monthly decimal rate: divide by 100, then by 12. So 7% becomes 0.07 ÷ 12 ≈ 0.0058333.",
    "Multiply the term in years by 12 to get the number of payments (n).",
    "Calculate (1 + r)^n. This growth factor appears twice in the formula.",
    "Plug the values into M = P × r × (1 + r)^n ÷ ((1 + r)^n − 1) to get the monthly payment.",
    "Multiply M by n to find the total you will repay, and subtract P to find the total interest.",
  ],
  formulas: [
    {
      label: "Monthly payment on an amortizing loan",
      expression: "M = P × r(1 + r)^n ÷ ((1 + r)^n − 1)",
      variables: [
        { symbol: "M", meaning: "fixed monthly payment" },
        { symbol: "P", meaning: "principal, the amount borrowed" },
        { symbol: "r", meaning: "monthly interest rate (annual rate ÷ 12, as a decimal)" },
        { symbol: "n", meaning: "total number of monthly payments" },
      ],
      note: "If the rate is 0%, the formula divides by zero; the payment is simply P ÷ n.",
    },
    {
      label: "Interest portion of any payment",
      expression: "Interest = current balance × r",
      note: "The principal portion is M minus that interest, and the new balance is the old balance minus the principal portion.",
    },
    {
      label: "Total cost of the loan",
      expression: "Total interest = M × n − P",
    },
  ],
  examples: [
    {
      title: "$25,000 car loan at 7% for 5 years",
      steps: [
        "r = 0.07 ÷ 12 ≈ 0.0058333, n = 60",
        "(1 + r)^60 ≈ 1.417625",
        "M = 25,000 × 0.0058333 × 1.417625 ÷ 0.417625 ≈ 495.03",
        "Total repaid: 495.03 × 60 ≈ 29,701.80",
        "Total interest: 29,701.80 − 25,000 ≈ 4,701.80",
      ],
      result: "The payment is about $495.03 a month, and the loan costs about $4,701.80 in interest.",
    },
    {
      title: "The same loan's first payment, split",
      steps: [
        "Interest: 25,000 × 0.0058333 ≈ 145.83",
        "Principal: 495.03 − 145.83 = 349.20",
        "New balance: 25,000 − 349.20 = 24,650.80",
      ],
      result: "About 29% of the first payment is interest. The share shrinks every month as the balance falls.",
    },
    {
      title: "Shortening the car loan to 3 years",
      steps: [
        "r = 0.0058333, n = 36",
        "M ≈ 771.93",
        "Total interest: 771.93 × 36 − 25,000 ≈ 2,789.39",
      ],
      result: "The payment rises by about $277 a month, but total interest falls by about $1,912.",
    },
    {
      title: "$300,000 mortgage at 6.5% for 30 years, with and without $200 extra a month",
      steps: [
        "r = 0.065 ÷ 12 ≈ 0.0054167, n = 360",
        "M ≈ 1,896.20, and the first month's interest is 300,000 × 0.0054167 = 1,625.00",
        "Total interest at the scheduled payment: ≈ 382,633",
        "Paying 2,096.20 a month instead clears the loan in 277 payments",
        "Total interest with the extra $200: ≈ 279,185",
      ],
      result: "The extra $200 a month saves roughly $103,400 in interest and ends the mortgage about 7 years early, assuming the lender applies it to principal.",
    },
  ],
  sections: [
    {
      heading: "What is amortization?",
      paragraphs: [
        "Amortization is the process of paying off a debt in equal installments where the mix of interest and principal changes over time. Interest is always charged on the balance still owed, so early payments are interest-heavy and later payments are mostly principal.",
        "In the mortgage example, only $271.20 of the first $1,896.20 payment reduces the balance. Near the end of the term, almost the whole payment goes to principal. An amortization schedule lists this split for every payment, along with the remaining balance.",
      ],
    },
    {
      heading: "Why do extra payments save so much interest?",
      paragraphs: [
        "Any amount paid on top of the scheduled payment goes straight to principal, as long as the lender applies it that way. A lower balance means less interest next month, which means more of the regular payment goes to principal, and the effect compounds. Extra payments made early in the loan save the most, because they remove principal that would otherwise have accrued interest for many years.",
        "Before overpaying, check whether your loan has a prepayment penalty and tell the lender to apply the extra to principal rather than to future payments.",
      ],
    },
    {
      heading: "What is the difference between the interest rate and APR?",
      paragraphs: [
        "The interest rate is what the formula uses to calculate your payment. APR, the annual percentage rate, adds certain upfront costs such as origination fees or mortgage points and expresses the total as a yearly rate. Two loans with the same interest rate can have different APRs if their fees differ.",
        "Use the interest rate to calculate the monthly payment, and the APR to compare the overall cost of offers.",
      ],
    },
    {
      heading: "Does a longer term make a loan cheaper?",
      paragraphs: [
        "It makes each payment smaller but the loan more expensive overall. Stretching the car loan from 3 to 5 years lowers the payment from $771.93 to $495.03 but adds about $1,912 in interest, because the balance stays higher for longer. Longer terms also often come with higher rates, which widens the gap further.",
      ],
    },
    {
      heading: "What the payment formula does not include",
      list: [
        "Property taxes and homeowners insurance, which are often collected with a mortgage payment through escrow.",
        "Private mortgage insurance, typically required on conventional mortgages with a small down payment.",
        "Late fees, and rate changes on adjustable-rate or variable-rate loans.",
        "Interest-only periods or balloon payments, which follow different payment rules.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate a loan payment in a spreadsheet?",
      answer:
        "Use the PMT function with the monthly rate, number of payments and loan amount, for example PMT(0.07/12, 60, −25000). It applies the same amortization formula described here.",
    },
    {
      question: "How much of my payment goes to interest?",
      answer:
        "Multiply your current balance by the monthly rate. Whatever is left of the payment after that reduces the principal.",
    },
    {
      question: "Is it better to make one extra payment a year or a little extra each month?",
      answer:
        "Spreading it monthly saves slightly more, because each extra amount reduces the balance sooner. Both approaches shorten the loan noticeably if applied to principal.",
    },
    {
      question: "Why is my lender's payment slightly different from my calculation?",
      answer:
        "Lenders may round the rate or payment, count days differently or add escrow, insurance and fees. Small differences of a few cents usually come from rounding.",
    },
    {
      question: "What happens if the interest rate is 0%?",
      answer:
        "There is no interest, so the payment is just the loan amount divided by the number of payments. A $12,000 loan over 48 months at 0% is $250 a month.",
    },
  ],
  disclaimer:
    "These calculations are estimates for fixed-rate, fully amortizing loans and exclude taxes, insurance and fees. Your lender's figures and loan terms are what count. Consider consulting a qualified financial advisor before making borrowing decisions.",
};

export default guide;
