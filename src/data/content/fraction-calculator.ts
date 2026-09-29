import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To add fractions, rewrite them over a common denominator and add the numerators: 1/2 + 2/3 = 3/6 + 4/6 = 7/6, which is 1 1/6 or about 1.1667. To multiply, multiply the tops and the bottoms; to divide, multiply by the reciprocal of the second fraction.",
  intro:
    "Fractions are easy to get wrong by hand, especially with mixed numbers like 2 1/4. Enter two fractions, pick an operation and this calculator gives the answer as a simplified fraction, a mixed number and a decimal, with the steps shown. It can also reduce a single fraction to its lowest terms.",
  howToUse: [
    "Enter the first fraction. For a mixed number, fill in the whole-number part as well as the numerator and denominator.",
    "Choose add, subtract, multiply or divide, then enter the second fraction.",
    "Read the simplified fraction, the mixed-number form and the decimal value.",
    "To reduce one fraction on its own, switch to simplify and enter just that fraction.",
  ],
  howItWorks: [
    "Mixed numbers are first converted to improper fractions: 2 1/4 becomes (2 × 4 + 1)/4 = 9/4. That lets every operation follow a single rule.",
    "For addition and subtraction, both fractions are rewritten over a common denominator, then the numerators are combined. Multiplication multiplies numerators together and denominators together. Division flips the second fraction and multiplies.",
    "Finally, the result is divided top and bottom by the greatest common divisor to reach lowest terms. If the numerator is larger than the denominator, the whole-number part is split out to give a mixed number. A denominator of zero, or dividing by a zero fraction, is undefined and is reported as an error.",
  ],
  formulas: [
    { label: "Addition", expression: "a/b + c/d = (ad + bc) / bd" },
    { label: "Subtraction", expression: "a/b − c/d = (ad − bc) / bd" },
    { label: "Multiplication", expression: "a/b × c/d = ac / bd" },
    { label: "Division", expression: "a/b ÷ c/d = a/b × d/c = ad / bc", note: "c cannot be zero." },
    { label: "Mixed number to improper fraction", expression: "w n/d = (w × d + n) / d" },
  ],
  examples: [
    {
      title: "3/4 − 5/6",
      steps: ["Common denominator 12: 9/12 − 10/12", "9 − 10 = −1"],
      result: "−1/12 ≈ −0.0833.",
    },
    {
      title: "2 1/4 × 1 1/3",
      steps: ["2 1/4 = 9/4 and 1 1/3 = 4/3", "9/4 × 4/3 = 36/12", "36/12 simplifies to 3"],
      result: "Exactly 3.",
    },
    {
      title: "3/4 ÷ 2/5",
      steps: ["Flip the second fraction: 3/4 × 5/2", "= 15/8", "15 ÷ 8 = 1 remainder 7"],
      result: "15/8 = 1 7/8 = 1.875.",
    },
    {
      title: "Simplify 18/24",
      steps: ["gcd(18, 24) = 6", "18 ÷ 6 = 3; 24 ÷ 6 = 4"],
      result: "18/24 = 3/4.",
    },
  ],
  sections: [
    {
      heading: "Why do you flip the second fraction when dividing?",
      paragraphs: [
        "Dividing by a number is the same as multiplying by its reciprocal. Asking \"how many 2/5s fit into 3/4?\" is equivalent to 3/4 × 5/2, because each whole contains 5/2 lots of 2/5. The result, 1 7/8, says one full 2/5 fits in, plus seven-eighths of another.",
      ],
    },
    {
      heading: "Do I need the lowest common denominator?",
      paragraphs: [
        "No. Any common denominator works; multiplying the two denominators is always valid. Using the lowest one just keeps the numbers smaller. The calculator simplifies the final answer either way, so you get the same result.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I enter a negative fraction?",
      answer:
        "Put the minus sign on the whole number or the numerator. −1 1/2 means negative one and a half, which is −3/2.",
    },
    {
      question: "How do I convert a fraction to a decimal?",
      answer:
        "Divide the numerator by the denominator. 7/8 = 7 ÷ 8 = 0.875. The calculator shows the decimal alongside every result, rounded where it repeats, as with 1/3 ≈ 0.3333.",
    },
    {
      question: "What is an improper fraction?",
      answer:
        "A fraction whose numerator is equal to or larger than its denominator, such as 7/4. It equals the mixed number 1 3/4.",
    },
    {
      question: "How do I know a fraction is fully simplified?",
      answer:
        "When the numerator and denominator share no common factor other than 1. 8/12 isn't, because both divide by 4; 2/3 is.",
    },
    {
      question: "Can the denominator be zero?",
      answer:
        "No. Division by zero is undefined, so a fraction such as 5/0 has no value and the calculator shows an error instead.",
    },
  ],
};

export default content;
