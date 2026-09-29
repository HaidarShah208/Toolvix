import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "To find a sale price, multiply the original price by (1 − discount ÷ 100). A $80 item at 25% off costs 80 × 0.75 = $60, a saving of $20. To find the percent off from two prices, divide the difference by the original price and multiply by 100.",
  intro:
    "Discounts look simple until you meet an extra 10% off an already-reduced price, a coupon that applies after a markdown, or a receipt with tax added at the end. Every one of those can be worked out with a single multiplication once you think of a discount as a factor rather than a number to subtract. This guide covers the core calculations and the ways shoppers most often get them wrong.",
  steps: [
    "Convert the discount percentage to a decimal: 25% becomes 0.25.",
    "Subtract it from 1 to get the price factor you actually pay: 1 − 0.25 = 0.75.",
    "Multiply the original price by that factor to get the sale price.",
    "Subtract the sale price from the original if you want the amount saved.",
    "If a second percentage discount applies, multiply by its factor too, rather than adding the percentages.",
    "Apply sales tax last, to the discounted price, by multiplying by (1 + tax rate).",
  ],
  formulas: [
    {
      label: "Sale price",
      expression: "Sale price = Original × (1 − d)",
      variables: [
        { symbol: "Original", meaning: "the price before any discount" },
        { symbol: "d", meaning: "the discount rate as a decimal" },
      ],
    },
    {
      label: "Discount percentage from two prices",
      expression: "Discount % = (Original − Sale) ÷ Original × 100",
    },
    {
      label: "Stacked percentage discounts",
      expression: "Final = Original × (1 − d₁) × (1 − d₂)",
      note: "The combined discount is 1 − (1 − d₁)(1 − d₂), which is always less than d₁ + d₂.",
    },
    {
      label: "Original price from a sale price",
      expression: "Original = Sale ÷ (1 − d)",
    },
    {
      label: "Price with sales tax",
      expression: "Total = Sale price × (1 + t)",
      variables: [{ symbol: "t", meaning: "the sales tax rate as a decimal" }],
    },
  ],
  examples: [
    {
      title: "A $80 jacket at 25% off",
      steps: ["1 − 0.25 = 0.75", "80 × 0.75 = 60", "Saving: 80 − 60 = 20"],
      result: "The jacket costs $60, a saving of $20.",
    },
    {
      title: "Headphones reduced from $120 to $90. What is the discount?",
      steps: ["120 − 90 = 30", "30 ÷ 120 = 0.25", "0.25 × 100 = 25"],
      result: "The discount is 25%.",
    },
    {
      title: "$150 shoes: 20% off, plus an extra 10% at checkout, then 8% sales tax",
      steps: [
        "After 20% off: 150 × 0.80 = 120",
        "After the extra 10%: 120 × 0.90 = 108",
        "Combined discount: 1 − 0.80 × 0.90 = 1 − 0.72 = 0.28, or 28%",
        "With tax: 108 × 1.08 = 116.64",
      ],
      result: "You pay $116.64. The two discounts total 28% off, not 30%; a straight 30% off would have been $105 before tax.",
    },
    {
      title: "A sale tag reads $51 after 15% off. What was the original price?",
      steps: ["1 − 0.15 = 0.85", "51 ÷ 0.85 = 60"],
      result: "The original price was $60. Adding 15% to $51 would give $58.65, which is wrong.",
    },
  ],
  sections: [
    {
      heading: "Why don't stacked discounts add up?",
      paragraphs: [
        "The second discount is taken from a price that has already been reduced, so it removes less money than it would from the original. In the shoe example, the extra 10% comes off $120, saving $12, rather than off $150, which would have saved $15. The total saving is $42 on $150, which is 28%.",
        "The shortcut is to multiply the price factors: 0.80 × 0.90 = 0.72, meaning you pay 72% of the original price. The order of two percentage discounts does not matter, because multiplication gives the same result either way.",
      ],
    },
    {
      heading: "What about a fixed-amount coupon combined with a percentage?",
      paragraphs: [
        "Here the order does matter. Take a $100 item with a $20 coupon and a 10% discount. Coupon first: 100 − 20 = 80, then 80 × 0.90 = $72. Percentage first: 100 × 0.90 = 90, then 90 − 20 = $70. Taking the percentage first leaves the fixed amount to be subtracted in full, so it is the cheaper order for the buyer. The store's terms decide which order is used, so it is worth reading the fine print.",
      ],
    },
    {
      heading: "Is sales tax charged before or after a discount?",
      paragraphs: [
        "In most US states, sales tax on a store discount is charged on the reduced price, which is what you would expect. Treatment of manufacturer coupons and rebates varies by state, and some tax the pre-coupon price.",
        "For straightforward percentage discounts, the math gives the same total either way: 150 × 0.72 × 1.08 equals 150 × 1.08 × 0.72. The difference only appears when the tax base itself changes, such as with coupons that the state treats as part of the taxable price.",
      ],
    },
    {
      heading: "How can you estimate a discount quickly?",
      list: [
        "10% off means move the decimal point one place left and subtract: 10% of $64 is $6.40, so the sale price is $57.60.",
        "20% off is double the 10% figure; 30% off is triple.",
        "25% off is one quarter off, and 50% off is half.",
        "For 15% off, add the 10% amount to half of it: on $64, that is 6.40 + 3.20 = $9.60 off.",
        "For 40% off, pay 60%: take 10%, multiply by 6.",
      ],
    },
    {
      heading: "Common mistakes",
      list: [
        "Adding stacked discounts together, which overstates the saving.",
        "Reversing a discount by adding the same percentage back on. Divide by the price factor instead.",
        "Comparing a percentage discount and a dollar discount without converting one into the other.",
        "Forgetting that \"up to 70% off\" means only some items carry the maximum reduction.",
        "Taking the percentage off the wrong price, such as a previous sale price rather than the original.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate 30% off?",
      answer:
        "Multiply the price by 0.70. For example, 30% off $45 is 45 × 0.70 = $31.50.",
    },
    {
      question: "Is 50% off plus an extra 20% off the same as 70% off?",
      answer:
        "No. You pay 0.50 × 0.80 = 0.40 of the original price, which is 60% off in total. A true 70% off would leave you paying 30%.",
    },
    {
      question: "How do I work out the percentage saved on a multi-buy deal?",
      answer:
        "Compare what you pay with what the items would normally cost. Buy 3 for the price of 2 means paying 2 ÷ 3 of the full price, a saving of about 33.3%.",
    },
    {
      question: "What is the difference between a discount and a markdown?",
      answer:
        "In everyday use they mean the same thing to shoppers. In retail, a markdown usually refers to a permanent price reduction, while a discount can be temporary or limited to certain customers.",
    },
    {
      question: "How do I find the original price if I only know the savings and the percentage?",
      answer:
        "Divide the saving by the discount rate. If $18 is 15% off, the original price was 18 ÷ 0.15 = $120.",
    },
  ],
};

export default guide;
