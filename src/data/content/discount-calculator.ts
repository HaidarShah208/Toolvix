import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Sale price = original price × (1 − discount ÷ 100). An item priced 80 with 25% off costs 80 × 0.75 = 60, a saving of 20.",
  intro:
    "Shop signs often combine offers, such as \"25% off, plus an extra 10% at checkout\", and add tax only at the till. This calculator applies a percentage or fixed-amount discount, an optional second percentage on top, and optional sales tax, then shows what you pay, what you save and the true overall discount.",
  howToUse: [
    "Enter the original price.",
    "Choose a percentage discount or a fixed amount off, and enter it.",
    "Optionally add a second percentage discount that applies after the first one.",
    "Optionally enter a sales tax rate; it is added after all discounts. Read the final price, total savings and effective discount.",
  ],
  howItWorks: [
    "The first discount is taken off the original price. If you add a second discount, it is applied to the already reduced price, not to the original. That is why stacked discounts are always worth less than their simple sum.",
    "The effective discount is your total saving divided by the original price, so you can compare a stacked offer with a single one. Sales tax, if entered, is calculated on the discounted price, which is how most retailers apply it.",
    "A fixed discount larger than the price would give a negative total, so the calculator flags it rather than showing a price below zero.",
  ],
  formulas: [
    {
      label: "Price after a percentage discount",
      expression: "Sale price = Price × (1 − d ÷ 100)",
    },
    {
      label: "Two stacked percentage discounts",
      expression: "Final = Price × (1 − d₁ ÷ 100) × (1 − d₂ ÷ 100)",
      variables: [
        { symbol: "d₁", meaning: "first discount percentage" },
        { symbol: "d₂", meaning: "second discount percentage, applied to the reduced price" },
      ],
    },
    {
      label: "Effective discount",
      expression: "Effective % = (Price − Final before tax) ÷ Price × 100",
    },
  ],
  examples: [
    {
      title: "Jacket at 80 with 25% off, then an extra 10%, plus 8% tax",
      steps: [
        "After 25% off: 80 × 0.75 = 60.00",
        "After the extra 10%: 60 × 0.90 = 54.00",
        "Savings: 80 − 54 = 26.00, so the effective discount is 26 ÷ 80 = 32.5%",
        "Tax: 54 × 0.08 = 4.32; total 58.32",
      ],
      result: "You pay 58.32 and save 26.00, a 32.5% discount, not 35%.",
    },
    {
      title: "10 off a 45 purchase",
      steps: ["45 − 10 = 35", "Effective discount: 10 ÷ 45 × 100 ≈ 22.2%"],
      result: "The fixed coupon is worth about 22.2% on this purchase.",
    },
  ],
  sections: [
    {
      heading: "Is 20% off plus 20% off the same as 40% off?",
      paragraphs: [
        "No. The second 20% comes off an already reduced price. On a 100 item, the first cut leaves 80 and the second leaves 64, a total discount of 36%. Only a single 40% discount would bring it to 60.",
      ],
    },
    {
      heading: "Is a percentage or a fixed discount better?",
      paragraphs: [
        "It depends on the price. A 15% code beats 10 off on anything over about 66.67, because 15% of 66.67 is 10. Below that, the fixed amount saves more. Enter each option to compare them directly.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I work out 30% off in my head?",
      answer:
        "Find 10% by moving the decimal point one place, multiply by 3, and subtract. For 60, 10% is 6, so 30% is 18 and the sale price is 42.",
    },
    {
      question: "Does the order of two percentage discounts matter?",
      answer:
        "Not for the final price. 25% then 10% and 10% then 25% both leave 67.5% of the original, because multiplication works in either order.",
    },
    {
      question: "Is tax calculated before or after the discount?",
      answer:
        "This calculator adds tax after discounts, which is the usual approach for store discounts. Some manufacturer coupons are taxed on the pre-discount price, depending on local rules.",
    },
    {
      question: "How do I find the original price from a sale price?",
      answer:
        "Divide the sale price by (1 − discount ÷ 100). A 48 item at 20% off was originally 48 ÷ 0.80 = 60.",
    },
    {
      question: "What does \"up to 70% off\" mean for my total?",
      answer:
        "It means some items carry the maximum discount, not all of them. Enter the actual discount shown on the item you want to see what it really costs.",
    },
  ],
};

export default content;
