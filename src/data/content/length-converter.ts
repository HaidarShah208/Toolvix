import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To convert inches to centimeters, multiply by 2.54; to convert feet to meters, multiply by 0.3048; to convert miles to kilometers, multiply by 1.609344. Enter any length above and the converter shows it in millimeters, centimeters, meters, kilometers, inches, feet, yards, miles, nautical miles and more at once.",
  intro:
    "Heights on a passport form, screen sizes, running distances, room measurements and sea miles all use different units, and the mental shortcuts people rely on are often slightly off. This converter uses the exact international definitions so the result is right to as many decimal places as you need.",
  howToUse: [
    "Type a length into the value box.",
    "Choose the unit you have (for example feet) and the unit you want (for example centimeters).",
    "Read the converted value, or check the table below it, which lists the same length in every supported unit.",
    "Copy the result, or press swap to convert in the other direction.",
  ],
  howItWorks: [
    "Every unit is stored as an exact number of meters. An inch is exactly 0.0254 m, a foot is 0.3048 m, a yard is 0.9144 m and a statute mile is 1,609.344 m, all fixed by the 1959 international yard and pound agreement. A nautical mile is exactly 1,852 m, originally based on one minute of latitude.",
    "To convert, your value is turned into meters and then into the target unit. The table repeats that for every unit, from nanometers and micrometers up to kilometers and miles, which is handy when you are not sure which unit a form or drawing expects.",
  ],
  formulas: [
    {
      label: "Imperial to metric",
      expression: "cm = in × 2.54 · m = ft × 0.3048 · km = mi × 1.609344",
    },
    {
      label: "Within imperial",
      expression: "1 ft = 12 in · 1 yd = 3 ft · 1 mi = 1,760 yd = 5,280 ft",
    },
    {
      label: "Nautical mile",
      expression: "1 nmi = 1,852 m ≈ 1.15078 mi",
    },
  ],
  examples: [
    {
      title: "Height: 5 ft 10 in in centimeters",
      steps: ["5 ft × 12 = 60 in, plus 10 in = 70 in", "70 × 2.54 = 177.8"],
      result: "5 ft 10 in is 177.8 cm.",
    },
    {
      title: "Marathon distance in miles",
      steps: ["42.195 km ÷ 1.609344 ≈ 26.2188"],
      result: "A marathon is about 26.22 miles (26 miles 385 yards).",
    },
    {
      title: "A 55-inch TV in centimeters",
      steps: ["55 × 2.54 = 139.7"],
      result: "139.7 cm, measured diagonally across the screen.",
    },
  ],
  sections: [
    {
      heading: "How do I convert centimeters to feet and inches?",
      paragraphs: [
        "Divide the centimeters by 2.54 to get total inches, then divide by 12. The whole number is feet and the remainder is inches. For 180 cm: 180 ÷ 2.54 ≈ 70.87 in; 70.87 ÷ 12 = 5 remainder 10.87, so 180 cm is about 5 ft 10.9 in.",
      ],
    },
    {
      heading: "Common length conversions",
      list: [
        "1 inch = 2.54 cm = 25.4 mm",
        "1 foot = 30.48 cm",
        "1 meter ≈ 3.28084 feet ≈ 39.37 inches",
        "1 yard = 0.9144 m",
        "1 kilometer ≈ 0.621371 miles",
        "1 mile = 1.609344 km",
        "5 km ≈ 3.107 miles; 10 km ≈ 6.214 miles",
      ],
    },
  ],
  faqs: [
    {
      question: "How many centimeters are in an inch?",
      answer:
        "Exactly 2.54. This has been the international definition of the inch since 1959, so it is not an approximation.",
    },
    {
      question: "How many feet are in a meter?",
      answer:
        "About 3.28084. A quick mental estimate is to multiply meters by 3 and add 10%, which gives 3.3.",
    },
    {
      question: "Is a nautical mile longer than a regular mile?",
      answer:
        "Yes. A nautical mile is 1,852 m, about 15% longer than a statute mile of 1,609.344 m. Ships and aircraft use it because it relates directly to degrees of latitude.",
    },
    {
      question: "What is the difference between a US survey foot and an international foot?",
      answer:
        "The US survey foot was about 2 parts per million longer and was used in some US land surveys. It was officially retired at the end of 2022; this converter uses the international foot of exactly 0.3048 m.",
    },
    {
      question: "Why do some converters give 1 mile = 1.6 km?",
      answer:
        "That is a rounded shortcut. Over a 100-mile trip it underestimates the distance by about 0.9 km, which is why this tool keeps the exact factor.",
    },
  ],
};

export default content;
