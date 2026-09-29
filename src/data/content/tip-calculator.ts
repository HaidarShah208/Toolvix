import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Tip = bill × tip percentage ÷ 100. On a 60 bill, an 18% tip is 60 × 0.18 = 10.80, making the total 70.80; split between two people that is 35.40 each.",
  intro:
    "Working out a tip is easy until the bill is split five ways and someone asks whether to tip on the tax. Enter the bill, pick a tip percentage, and this calculator gives you the tip, the total and each person's share, with the option to round each share up to a whole amount.",
  howToUse: [
    "Enter the bill amount. Use the pre-tax subtotal or the final total, depending on which you want to tip on.",
    "Tap a preset from 10% to 25%, or type a custom percentage.",
    "Set the number of people splitting the bill.",
    "Turn on rounding up if you'd rather each person pays a whole amount; the tip is adjusted to match.",
  ],
  howItWorks: [
    "The tip is the bill multiplied by the percentage. Adding it to the bill gives the total, and dividing the total by the number of people gives each share.",
    "When you round up per person, each share is raised to the next whole unit and the extra is counted as additional tip. The calculator shows the new total and the effective tip percentage, so you know exactly how generous the rounding made you.",
    "The calculator tips on whatever amount you enter. Whether that should be the subtotal before tax or the total after tax is a matter of local custom and personal preference, explained below.",
  ],
  formulas: [
    { label: "Tip amount", expression: "Tip = Bill × (Tip % ÷ 100)" },
    { label: "Each person's share", expression: "Share = (Bill + Tip) ÷ People" },
    {
      label: "Effective tip after rounding",
      expression: "Effective tip % = (Rounded total − Bill) ÷ Bill × 100",
    },
  ],
  examples: [
    {
      title: "84.50 dinner for three at 18%",
      steps: [
        "Tip: 84.50 × 0.18 = 15.21",
        "Total: 84.50 + 15.21 = 99.71",
        "Per person: 99.71 ÷ 3 ≈ 33.24",
      ],
      result: "Each person pays about 33.24.",
    },
    {
      title: "Same dinner, rounded up per person",
      steps: [
        "33.24 rounds up to 34.00 each",
        "New total: 34 × 3 = 102.00, so the tip is 102.00 − 84.50 = 17.50",
        "Effective tip: 17.50 ÷ 84.50 ≈ 20.7%",
      ],
      result: "Everyone pays 34.00 and the tip becomes about 20.7%.",
    },
  ],
  sections: [
    {
      heading: "Should you tip on the pre-tax or post-tax amount?",
      paragraphs: [
        "Etiquette guides commonly suggest tipping on the pre-tax subtotal, since tax isn't part of the service, but many people tip on the final total for simplicity. The difference is usually small. If the 84.50 bill above included 6.50 of tax, 18% of the 78.00 subtotal is 14.04, compared with 15.21 on the full amount. Enter whichever figure you prefer to tip on.",
      ],
    },
    {
      heading: "How much should I tip?",
      paragraphs: [
        "Customs vary widely by country and by type of service. In the United States, 15–20% is common at sit-down restaurants, while in many other countries service is included in the price or tips are smaller and optional. Check the bill for a service charge before adding a tip, so you don't pay twice.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate a 20% tip quickly?",
      answer:
        "Move the decimal point one place left to get 10%, then double it. On a 46 bill, 10% is 4.60, so 20% is 9.20.",
    },
    {
      question: "Can I split the bill unevenly?",
      answer:
        "The calculator splits the total equally. For uneven splits, run it separately with each person's portion of the bill and the same tip percentage.",
    },
    {
      question: "What does rounding up per person do?",
      answer:
        "It raises each share to the next whole amount, which is handy for cash. The extra money goes to the tip, and the effective tip percentage is shown.",
    },
    {
      question: "Should I tip on a discounted or voucher bill?",
      answer:
        "Many people tip on the full pre-discount value, because the service was the same. Enter the original amount if you'd like to do that.",
    },
    {
      question: "Is a service charge the same as a tip?",
      answer:
        "Often, yes. If the bill already includes a service charge, an extra tip is usually optional. Ask staff if you're unsure where it goes.",
    },
  ],
};

export default content;
