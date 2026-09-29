import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To convert Celsius to Fahrenheit, multiply by 9/5 (1.8) and add 32. To convert Fahrenheit to Celsius, subtract 32 and multiply by 5/9. For Kelvin, add 273.15 to the Celsius value.",
  intro:
    "Temperature is the one common conversion where you cannot just multiply, because each scale starts from a different zero. Enter a value in Celsius, Fahrenheit, Kelvin or Rankine to see it on all four scales, with the formula used for each.",
  howToUse: [
    "Type a temperature. Negative values and decimals are fine.",
    "Select the scale it is in: Celsius, Fahrenheit, Kelvin or Rankine.",
    "Read the equivalent on the other three scales. Values below absolute zero are rejected, since nothing can be colder.",
    "Copy the result you need.",
  ],
  howItWorks: [
    "Celsius and Kelvin use the same size of degree; Kelvin simply starts at absolute zero, which is −273.15 °C. Fahrenheit and Rankine share a smaller degree, 5/9 the size of a Celsius degree, and Rankine starts at absolute zero, which is −459.67 °F.",
    "Because the scales differ in both size and starting point, conversion needs a multiply and an add. The converter translates your value to Kelvin first and then to each other scale, which keeps every result consistent.",
    "Absolute zero (0 K) is the lowest possible temperature, so any entry that works out below it, such as −300 °C or −10 K, is flagged as impossible instead of producing a meaningless number.",
  ],
  formulas: [
    { label: "Celsius to Fahrenheit", expression: "°F = °C × 9/5 + 32" },
    { label: "Fahrenheit to Celsius", expression: "°C = (°F − 32) × 5/9" },
    { label: "Celsius to Kelvin", expression: "K = °C + 273.15" },
    {
      label: "Fahrenheit to Rankine",
      expression: "°R = °F + 459.67",
      note: "Equivalently, °R = K × 9/5. Rankine is mostly used in US engineering thermodynamics.",
    },
  ],
  examples: [
    {
      title: "Body temperature: 37 °C in Fahrenheit",
      steps: ["37 × 9/5 = 66.6", "66.6 + 32 = 98.6"],
      result: "37 °C = 98.6 °F.",
    },
    {
      title: "An American recipe says 350 °F. What is that in Celsius?",
      steps: ["350 − 32 = 318", "318 × 5/9 ≈ 176.7"],
      result: "350 °F ≈ 177 °C. Most European ovens would be set to 180 °C, or about 160 °C for a fan oven.",
    },
    {
      title: "Room temperature in Kelvin",
      steps: ["20 + 273.15 = 293.15"],
      result: "20 °C = 293.15 K = 68 °F.",
    },
  ],
  sections: [
    {
      heading: "Reference temperatures",
      list: [
        "Absolute zero: −273.15 °C = −459.67 °F = 0 K = 0 °R",
        "Celsius and Fahrenheit meet: −40 °C = −40 °F",
        "Water freezes: 0 °C = 32 °F = 273.15 K",
        "Comfortable room: 20 to 22 °C ≈ 68 to 72 °F",
        "Normal body temperature: about 37 °C = 98.6 °F",
        "Water boils at sea level: 100 °C = 212 °F = 373.15 K",
        "Moderate oven: 180 °C = 356 °F (usually rounded to 350 °F)",
      ],
    },
    {
      heading: "Is there a quick way to convert in your head?",
      paragraphs: [
        "For weather, double the Celsius figure and add 30. 15 °C gives 60 °F (exact: 59 °F), and 25 °C gives 80 °F (exact: 77 °F). Going the other way, subtract 30 and halve. The shortcut drifts at extremes, so use the exact formula for cooking, medicine or science.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why is it Kelvin and not degrees Kelvin?",
      answer:
        "Kelvin is an absolute scale, so its unit is simply the kelvin (K), without a degree sign. The name was standardized that way in 1967.",
    },
    {
      question: "At what temperature are Celsius and Fahrenheit equal?",
      answer: "At −40. Solving C = C × 9/5 + 32 gives C = −40, so −40 °C and −40 °F are the same temperature.",
    },
    {
      question: "Why can't I just multiply by 1.8?",
      answer:
        "Multiplying by 1.8 converts a temperature difference, not a temperature. A rise of 10 °C is a rise of 18 °F, but 10 °C itself is 50 °F because the scales have different zero points.",
    },
    {
      question: "Can temperatures be negative in Kelvin?",
      answer:
        "No. 0 K is absolute zero, the point at which particles have the minimum possible energy, so the Kelvin and Rankine scales have no negative values.",
    },
    {
      question: "Is 100 °F a fever?",
      answer:
        "100 °F is about 37.8 °C. Many health services treat 38 °C (100.4 °F) or higher as a fever in adults, but follow advice from a clinician for any individual case.",
    },
  ],
};

export default content;
