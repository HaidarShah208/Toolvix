import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "A fixed-rate loan payment is P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1), where r is the rate per payment period and n is the number of payments. Borrowing 20,000 at 6% a year over 5 years gives a monthly payment of about 386.66 and total interest of about 3,199.36.",
  intro:
    "Before you sign for a car loan, personal loan or mortgage, it helps to know what the monthly figure really costs over the full term. Enter the amount, interest rate and term to see the regular payment, total interest, total repaid and a year-by-year amortization schedule showing how the balance falls.",
  howToUse: [
    "Enter the loan amount and the annual interest rate as a percentage.",
    "Set the term in years and, if needed, extra months (for example 4 years 6 months).",
    "Choose how often you pay: monthly, bi-weekly or weekly.",
    "Read the payment per period, total interest and total paid, then scroll the yearly schedule to see interest, principal and remaining balance for each year.",
  ],
  howItWorks: [
    "The calculator assumes a standard fixed-rate, fully amortizing loan: the same payment every period, with interest charged on the outstanding balance. The annual rate is divided by the number of payments per year (12, 26 or 52) to get the periodic rate.",
    "Each payment first covers the interest accrued since the last one; whatever is left reduces the principal. As the balance shrinks, the interest portion falls and the principal portion grows, even though the payment itself never changes.",
    "At a 0% rate the formula would divide by zero, so the calculator simply splits the amount evenly across the payments. Results are estimates of principal and interest only: origination fees, insurance, property taxes and late charges are not included, and a lender's exact day-count method can shift the figures by a few cents.",
  ],
  formulas: [
    {
      label: "Payment per period",
      expression: "Payment = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)",
      variables: [
        { symbol: "P", meaning: "loan amount (principal)" },
        { symbol: "r", meaning: "annual rate ÷ 100 ÷ payments per year" },
        { symbol: "n", meaning: "total number of payments (years × payments per year)" },
      ],
    },
    {
      label: "Zero-interest loan",
      expression: "Payment = P ÷ n",
    },
    {
      label: "Total interest",
      expression: "Total interest = Payment × n − P",
    },
  ],
  examples: [
    {
      title: "Car loan: 20,000 at 6% for 5 years, paid monthly",
      steps: [
        "r = 0.06 ÷ 12 = 0.005; n = 5 × 12 = 60",
        "(1.005)⁶⁰ ≈ 1.34885",
        "Payment = 20,000 × 0.005 × 1.34885 ÷ 0.34885 ≈ 386.66",
        "Total paid ≈ 386.66 × 60 = 23,199.36; interest ≈ 3,199.36",
        "Year 1: about 1,103.81 interest and 3,536.06 principal, leaving 16,463.94",
      ],
      result: "About 386.66 a month and 3,199.36 in total interest.",
    },
    {
      title: "The same loan paid bi-weekly",
      steps: ["r = 0.06 ÷ 26; n = 5 × 26 = 130", "Payment ≈ 178.25 every two weeks", "Total interest ≈ 3,172.67"],
      result: "Bi-weekly payments save about 27 in interest because the balance is reduced slightly more often.",
    },
    {
      title: "Mortgage: 250,000 at 6.5% for 30 years",
      steps: [
        "Monthly payment ≈ 1,580.17",
        "First month: interest = 250,000 × 0.065 ÷ 12 ≈ 1,354.17, so only about 226.00 goes to principal",
        "Total interest over 360 payments ≈ 318,861.22",
      ],
      result: "Over 30 years the interest paid is more than the amount borrowed.",
    },
  ],
  sections: [
    {
      heading: "Why does my first payment go mostly to interest?",
      paragraphs: [
        "Interest is charged on the balance you still owe, and at the start that balance is at its highest. On the 250,000 mortgage above, the first payment of 1,580.17 includes 1,354.17 of interest. As principal is repaid, each month's interest charge gets smaller, so later payments chip away at the balance much faster.",
      ],
    },
    {
      heading: "Is a shorter loan term worth the higher payment?",
      paragraphs: [
        "Usually it costs far less overall. The same 250,000 at 6.5% over 15 years has a payment of about 2,177.77, roughly 598 a month more than the 30-year loan, but total interest falls to about 141,998, less than half. Whether that suits you depends on your budget and what else the extra money could do, such as paying off higher-interest debt.",
      ],
    },
  ],
  faqs: [
    {
      question: "Does this include taxes, insurance or fees?",
      answer:
        "No. The results cover principal and interest only. For a mortgage, add property tax, homeowners insurance and any mortgage insurance to estimate the full monthly cost.",
    },
    {
      question: "Is the rate I enter the APR?",
      answer:
        "Enter the loan's nominal annual interest rate. APR also folds in certain fees, so using it here will slightly overstate the interest on the payment itself.",
    },
    {
      question: "How do bi-weekly and weekly payments work here?",
      answer:
        "The annual rate is split into 26 or 52 periods and the loan is repaid over the same number of years with smaller, more frequent payments. Check with your lender, because some bi-weekly programs simply collect half a monthly payment every two weeks.",
    },
    {
      question: "What happens if the interest rate is 0%?",
      answer:
        "The loan amount is divided evenly across all payments, so 12,000 over 2 years is 500 a month with no interest.",
    },
    {
      question: "Can I use this for an adjustable-rate or interest-only loan?",
      answer:
        "Only for the fixed part. The calculator assumes one rate and full amortization for the whole term, so it can't model rate resets or interest-only periods.",
    },
    {
      question: "Why is my lender's figure slightly different?",
      answer:
        "Lenders may count interest daily, round each payment, or schedule the first payment after an irregular period. Differences of a few cents to a few dollars are normal.",
    },
  ],
  disclaimer:
    "These results are estimates for illustration and are not financial advice or a loan offer. Actual payments depend on your lender's terms, fees, insurance, taxes and how interest is calculated. Confirm figures with your lender before making a decision.",
};

export default content;
