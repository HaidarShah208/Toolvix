import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "To convert Celsius to Fahrenheit, multiply by 9/5 (or 1.8) and add 32: F = C × 9/5 + 32. So 25°C is 25 × 1.8 + 32 = 77°F. To go the other way, subtract 32 and multiply by 5/9: C = (F − 32) × 5/9.",
  intro:
    "Celsius and Fahrenheit measure the same thing on scales with different step sizes and different zero points, which is why converting between them takes two operations rather than one. Once you see where the 9/5 and the 32 come from, the formula is easy to remember in both directions, and a quick mental estimate becomes second nature for weather and cooking.",
  steps: [
    "Start with the temperature in Celsius.",
    "Multiply it by 9 and divide by 5, or simply multiply by 1.8.",
    "Add 32 to the result. That is the temperature in Fahrenheit.",
    "To convert Fahrenheit to Celsius, undo the steps in reverse order: subtract 32 first, then multiply by 5/9 (or divide by 1.8).",
    "Round to a sensible precision for the context: whole degrees for weather, one decimal place for body temperature.",
  ],
  formulas: [
    {
      label: "Celsius to Fahrenheit",
      expression: "F = C × 9/5 + 32",
      variables: [
        { symbol: "C", meaning: "temperature in degrees Celsius" },
        { symbol: "F", meaning: "temperature in degrees Fahrenheit" },
      ],
    },
    {
      label: "Fahrenheit to Celsius",
      expression: "C = (F − 32) × 5/9",
      note: "Subtract before multiplying. Doing it in the other order gives the wrong answer.",
    },
    {
      label: "Celsius to Kelvin",
      expression: "K = C + 273.15",
      note: "Kelvin uses the same step size as Celsius but starts at absolute zero. It has no degree sign and no negative values.",
    },
    {
      label: "Converting a temperature difference",
      expression: "ΔF = ΔC × 9/5",
      note: "For a change in temperature, leave out the 32. A rise of 10°C is a rise of 18°F.",
    },
  ],
  examples: [
    {
      title: "A 25°C summer day",
      steps: ["25 × 9/5 = 45", "45 + 32 = 77"],
      result: "25°C is 77°F.",
    },
    {
      title: "An oven recipe set to 180°C",
      steps: ["180 × 1.8 = 324", "324 + 32 = 356"],
      result: "180°C is 356°F. Many recipes round this to 350°F, since oven dials are not that precise.",
    },
    {
      title: "Normal body temperature of 98.6°F",
      steps: ["98.6 − 32 = 66.6", "66.6 × 5/9 = 37"],
      result: "98.6°F is 37°C.",
    },
    {
      title: "A room thermostat at 68°F, in Celsius and Kelvin",
      steps: ["68 − 32 = 36", "36 × 5/9 = 20", "20 + 273.15 = 293.15"],
      result: "68°F is 20°C, or 293.15 K.",
    },
  ],
  sections: [
    {
      heading: "Where do 9/5 and 32 come from?",
      paragraphs: [
        "Both scales are anchored to the freezing and boiling points of water at standard atmospheric pressure. Celsius puts them at 0 and 100, a span of 100 degrees. Fahrenheit puts them at 32 and 212, a span of 180 degrees. Since 180 ÷ 100 = 1.8, or 9/5, each Celsius degree is 1.8 times as large as a Fahrenheit degree.",
        "The 32 accounts for the offset: water freezes at 0 on one scale and 32 on the other. You scale the size of the degrees first, then shift the starting point.",
      ],
    },
    {
      heading: "Is there a quick way to convert in your head?",
      paragraphs: [
        "A popular shortcut is to double the Celsius figure and add 30. It is exact at 10°C (both give 50°F) and stays within a couple of degrees for typical weather between about 0°C and 20°C. It drifts further off as temperatures move away from 10°C:",
      ],
      list: [
        "0°C: shortcut 30°F, exact 32°F",
        "25°C: shortcut 80°F, exact 77°F",
        "−10°C: shortcut 10°F, exact 14°F",
        "180°C: shortcut 390°F, exact 356°F, which is too far off for cooking",
        "Reverse it for Fahrenheit to Celsius: subtract 30 and halve. 72°F gives 21°C, against an exact 22.2°C.",
      ],
    },
    {
      heading: "At what temperature are Celsius and Fahrenheit equal?",
      paragraphs: [
        "At −40. Setting F equal to C in the formula gives C = C × 9/5 + 32, which solves to C = −40. So −40°C is exactly −40°F. Above that point the Fahrenheit number is always higher; below it, the Celsius number is higher.",
      ],
    },
    {
      heading: "How does Kelvin fit in?",
      paragraphs: [
        "Kelvin is the SI unit of temperature, used in science and engineering. It starts at absolute zero, the lowest possible temperature, which is −273.15°C or −459.67°F. A kelvin is the same size as a Celsius degree, so converting only needs an addition. Temperatures in kelvin are written without a degree sign, as in 293.15 K.",
        "The Fahrenheit equivalent is the Rankine scale, which starts at absolute zero but uses Fahrenheit-sized degrees. It appears mainly in some US engineering work.",
      ],
    },
    {
      heading: "Which reference temperatures are worth remembering?",
      paragraphs: [
        "A handful of anchor points makes it easy to sanity-check any conversion, or to estimate by interpolating between them:",
      ],
      list: [
        "−18°C ≈ 0°F: a typical home freezer",
        "0°C = 32°F: water freezes",
        "10°C = 50°F: a cool spring day",
        "20°C = 68°F: comfortable room temperature",
        "30°C = 86°F: a hot summer day",
        "37°C = 98.6°F: average body temperature",
        "100°C = 212°F: water boils at sea level",
      ],
    },
    {
      heading: "Common mistakes",
      list: [
        "Adding 32 before multiplying when converting to Fahrenheit, which inflates the result. 25°C would come out as 102.6°F instead of 77°F.",
        "Multiplying by 5/9 before subtracting 32 when converting to Celsius.",
        "Using 9/5 when you meant 5/9, or the reverse. A quick check: Fahrenheit numbers are larger than Celsius ones for any temperature above −40.",
        "Adding or subtracting 32 when converting a temperature change, such as a forecast that says it will be 5°C warmer. That is 9°F warmer, not 41°F.",
        "Writing degrees kelvin or °K. The correct form is simply K.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is 0°C in Fahrenheit?",
      answer: "0°C is 32°F, the freezing point of water at standard pressure.",
    },
    {
      question: "What is 100°F in Celsius?",
      answer: "(100 − 32) × 5/9 ≈ 37.8°C. That is a hot day, or a mild fever if it is a body temperature.",
    },
    {
      question: "What is 37°C in Fahrenheit?",
      answer: "37 × 1.8 + 32 = 98.6°F, the traditional figure for average body temperature.",
    },
    {
      question: "Why does the US still use Fahrenheit?",
      answer:
        "It is largely a matter of custom. The US uses Fahrenheit for weather, cooking and everyday life, while science and most other countries use Celsius.",
    },
    {
      question: "What is 350°F in Celsius?",
      answer:
        "(350 − 32) × 5/9 ≈ 176.7°C. Recipes usually round it to 175°C or 180°C.",
    },
  ],
};

export default guide;
