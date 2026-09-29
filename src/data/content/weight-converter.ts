import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To convert kilograms to pounds, divide by 0.45359237 (or multiply by about 2.20462). To convert pounds to kilograms, multiply by 0.45359237. A stone is 14 pounds, so 70 kg is about 154.3 lb, or 11 st 0.3 lb.",
  intro:
    "Recipes, luggage allowances, body weight, postage and freight all mix metric and imperial units, and \"ton\" alone can mean three different amounts. This converter covers milligrams through to metric tonnes, US short tons and UK long tons, with a table showing every unit at once.",
  howToUse: [
    "Type the weight you want to convert.",
    "Choose the starting unit and the unit you want, for example kilograms to stone.",
    "Read the result, or scan the table underneath to see the value in every unit.",
    "Swap the units to go the other way, and copy the figure you need.",
  ],
  howItWorks: [
    "All units are defined against the kilogram. The international avoirdupois pound is exactly 0.45359237 kg, and the other imperial units follow from it: an ounce is 1/16 lb, a stone is 14 lb, a US short ton is 2,000 lb and a UK long ton is 2,240 lb. A metric tonne is 1,000 kg.",
    "Your value is converted to kilograms and then into the target unit, so conversions between two imperial units, such as stone to ounces, are exact too.",
  ],
  formulas: [
    {
      label: "Kilograms and pounds",
      expression: "lb = kg ÷ 0.45359237 · kg = lb × 0.45359237",
    },
    {
      label: "Imperial relationships",
      expression: "1 lb = 16 oz · 1 st = 14 lb · 1 short ton = 2,000 lb · 1 long ton = 2,240 lb",
    },
    {
      label: "Grams and ounces",
      expression: "g = oz × 28.349523125",
    },
  ],
  examples: [
    {
      title: "70 kg in pounds and in stone",
      steps: ["70 ÷ 0.45359237 ≈ 154.32 lb", "154.32 ÷ 14 = 11 remainder 0.32"],
      result: "70 kg ≈ 154.3 lb, or 11 st 0.3 lb.",
    },
    {
      title: "12 st 6 lb in kilograms",
      steps: ["12 × 14 + 6 = 174 lb", "174 × 0.45359237 ≈ 78.93"],
      result: "12 st 6 lb ≈ 78.9 kg.",
    },
    {
      title: "An 8 oz steak in grams",
      steps: ["8 × 28.349523125 ≈ 226.8"],
      result: "8 oz ≈ 227 g.",
    },
  ],
  sections: [
    {
      heading: "Which ton is which?",
      list: [
        "Metric tonne (t): 1,000 kg ≈ 2,204.6 lb. Used almost everywhere outside the US.",
        "US short ton: 2,000 lb ≈ 907.2 kg. The everyday \"ton\" in the United States.",
        "UK long ton: 2,240 lb ≈ 1,016.0 kg. Still found in shipping and older British references.",
      ],
      paragraphs: [
        "The long ton and the metric tonne are within 2% of each other, but the short ton is about 9% lighter than a tonne, a significant difference on freight quotes.",
      ],
    },
    {
      heading: "Weight vs mass: does it matter?",
      paragraphs: [
        "Strictly, kilograms and pounds measure mass, the amount of matter in an object, while weight is the force gravity exerts on it, measured in newtons. On Earth the two are proportional, so in everyday use the words are interchangeable and scales are calibrated to show mass. The difference only matters in physics problems or off-planet: an astronaut's mass is the same on the Moon, but their weight is about one sixth.",
      ],
    },
  ],
  faqs: [
    {
      question: "How many pounds are in a kilogram?",
      answer:
        "About 2.20462. For quick mental math, double the kilograms and add 10%: 50 kg → 100 + 10 = 110 lb (exact: 110.23).",
    },
    {
      question: "How many kilograms is a stone?",
      answer:
        "One stone is 14 lb, which is exactly 6.35029318 kg. It is mainly used for body weight in the UK and Ireland.",
    },
    {
      question: "How many grams are in an ounce?",
      answer:
        "About 28.35 g in an avoirdupois ounce, the ounce used for food. The troy ounce used for precious metals is heavier at about 31.10 g and is not the same unit.",
    },
    {
      question: "Is a fluid ounce the same as an ounce?",
      answer:
        "No. A fluid ounce measures volume, an ounce measures mass. A US fluid ounce of water happens to weigh about 1.04 oz, but for other liquids the relationship depends on density.",
    },
    {
      question: "How many ounces are in a pound?",
      answer: "Sixteen. So 2.5 lb is 2 lb 8 oz, not 2 lb 5 oz.",
    },
  ],
};

export default content;
