import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Enter a color in any format (HEX, RGB, HSL, HSV, CMYK or a CSS name such as tomato) or pick one visually, and the converter shows it in every other format, ready to copy. It also checks the color's contrast against white and black text using the WCAG ratios.",
  intro:
    "Designers hand over HEX codes, CSS wants rgb() or hsl(), print suppliers ask for CMYK, and accessibility audits ask for contrast ratios. This tool gives you all of them for one color at once, plus a row of lighter tints and darker shades to build a palette from.",
  howToUse: [
    "Type a color value, such as #2563eb, rgb(37 99 235), hsl(221 83% 53%) or a named color, or use the color picker.",
    "Read the equivalent HEX, RGB(A), HSL(A), HSV and CMYK values and copy whichever you need.",
    "Check the contrast panel to see whether white or black text on this color meets WCAG AA and AAA.",
    "Use the row of tints and shades to find lighter and darker versions for hover states, borders and backgrounds.",
  ],
  howItWorks: [
    "Everything is converted through RGB, the red, green and blue channels a screen actually uses, each from 0 to 255. HEX is the same three numbers written in base 16, so #2563EB means red 0x25 (37), green 0x63 (99) and blue 0xEB (235). The 3-digit shorthand doubles each digit (#F80 is #FF8800), and 8-digit HEX adds an alpha channel for transparency.",
    "HSL and HSV rearrange the same information into hue (the position on the color wheel, 0 to 360°), saturation, and either lightness or value. They are easier to adjust by hand: to make a color lighter in HSL, raise the L value and leave hue alone. Tints and shades are produced by mixing the color with white or black in steps.",
    "CMYK is calculated with the standard simple formula from RGB. Real print color depends on the paper, ink and the ICC color profile your printer uses, none of which a browser tool can know, so treat the CMYK figures as a starting point and ask your printer for a proof when color accuracy matters.",
  ],
  formulas: [
    {
      label: "WCAG contrast ratio",
      expression: "Contrast = (L₁ + 0.05) ÷ (L₂ + 0.05)",
      variables: [
        { symbol: "L₁", meaning: "relative luminance of the lighter color (0 to 1)" },
        { symbol: "L₂", meaning: "relative luminance of the darker color" },
      ],
      note: "Ratios range from 1:1 (identical) to 21:1 (black on white).",
    },
    {
      label: "Naive RGB to CMYK",
      expression: "K = 1 − max(R′, G′, B′); C = (1 − R′ − K) ÷ (1 − K), and likewise for M and Y",
      note: "R′, G′ and B′ are the channels divided by 255. No ICC profile is applied.",
    },
  ],
  examples: [
    {
      title: "#2563EB in every format",
      steps: [
        "RGB: 37, 99, 235",
        "HSL: 221°, 83%, 53%",
        "HSV: 221°, 84%, 92%",
        "CMYK (naive): 84%, 58%, 0%, 8%",
      ],
      result: "One blue, five ways to write it.",
    },
    {
      title: "Is white text readable on #2563EB?",
      steps: [
        "Relative luminance of #2563EB ≈ 0.153; white = 1",
        "(1 + 0.05) ÷ (0.153 + 0.05) ≈ 5.17",
        "Black on the same blue: (0.153 + 0.05) ÷ (0 + 0.05) ≈ 4.06",
      ],
      result: "White text passes AA for all text sizes (5.17:1) but not AAA for normal text. Black text only passes for large text.",
    },
    {
      title: "Adding transparency",
      steps: ["#2563EB80: the final pair 80 is 128 in decimal", "128 ÷ 255 ≈ 0.50"],
      result: "Equivalent to rgba(37, 99, 235, 0.5), a half-transparent blue.",
    },
  ],
  sections: [
    {
      heading: "What contrast ratio do I need for accessibility?",
      list: [
        "WCAG AA, normal text: at least 4.5:1.",
        "WCAG AA, large text (roughly 24 px regular or 18.66 px bold and above): at least 3:1.",
        "WCAG AAA, normal text: at least 7:1.",
        "WCAG AAA, large text: at least 4.5:1.",
      ],
      paragraphs: [
        "AA is the level most accessibility laws and policies reference. Mid-tone colors, like many brand blues, oranges and greens, often pass with only one of white or black text, which is why both are checked.",
      ],
    },
    {
      heading: "Why does my color look different in print?",
      paragraphs: [
        "Screens create color by emitting light (additive RGB), while print reflects light off inks (subtractive CMYK). Many bright screen colors, especially vivid blues, greens and oranges, fall outside what standard inks can reproduce, so they print duller. For brand work, agree on a printed reference, such as a Pantone match or a profile-based conversion in professional design software, rather than relying on a formula.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the difference between HSL and HSV?",
      answer:
        "Both use hue and saturation, but HSL's lightness puts pure color at 50% with white at 100%, while HSV's value puts pure color at 100%. HSL is what CSS uses; HSV is common in color pickers in design apps.",
    },
    {
      question: "Are HEX codes case-sensitive?",
      answer: "No. #2563eb and #2563EB are the same color.",
    },
    {
      question: "Which CSS color names are supported?",
      answer:
        "The standard named colors defined in CSS, from common ones like red and navy to less obvious names like rebeccapurple and papayawhip.",
    },
    {
      question: "How accurate is the CMYK conversion?",
      answer:
        "It is mathematically consistent but device-independent: it ignores ink, paper and ICC profiles. It is fine for rough mock-ups; for production print, get values from your printer or from profile-aware design software.",
    },
    {
      question: "Why do I get slightly different HSL values in other tools?",
      answer:
        "HSL is usually rounded to whole numbers, and converting back and forth can shift a channel by 1. The HEX and RGB values are the exact reference.",
    },
  ],
};

export default content;
