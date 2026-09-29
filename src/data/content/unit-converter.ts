import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Choose a category, enter a value and pick the units to convert from and to; the result appears instantly, with a table of the same value in every other unit in that category. Conversions use exact defined factors, such as 1 inch = 2.54 cm and 1 pound = 0.45359237 kg.",
  intro:
    "One converter for the measurements that come up in everyday life and work: length, weight, temperature, area, volume, speed, time and digital data. It is especially careful with the two places conversions most often go wrong, US versus UK gallons and decimal versus binary data sizes.",
  howToUse: [
    "Select a category: length, weight, temperature, area, volume, speed, time or data.",
    "Type the value you want to convert.",
    "Choose the unit you are converting from and the unit you want. Use the swap button to reverse the direction.",
    "Read the answer, or scroll the table to see the value in every unit in that category at once.",
  ],
  howItWorks: [
    "Every unit is defined by an exact factor to a base unit: the meter for length, kilogram for weight, square meter for area, liter for volume, meter per second for speed, second for time and byte for data. To convert, the value is multiplied by the source unit's factor to reach the base unit, then divided by the target unit's factor. Because the factors are exact international definitions rather than rounded approximations, chained conversions do not drift.",
    "Temperature is the exception. Celsius, Fahrenheit, Kelvin and Rankine have different zero points, so they cannot be converted by a single multiplier. The converter goes through Kelvin using the proper formulas instead.",
    "Months and years in the time category use the average Gregorian year of 365.2425 days, so a month is 30.436875 days. That is right for averages, but calendar math such as \"three months from 31 January\" needs a date calculator instead.",
  ],
  formulas: [
    {
      label: "Linear conversion",
      expression: "Result = Value × (Factor of source unit ÷ Factor of target unit)",
    },
    {
      label: "Key exact definitions",
      expression: "1 in = 2.54 cm · 1 lb = 0.45359237 kg · 1 US gal = 3.785411784 L · 1 UK gal = 4.54609 L",
      note: "The inch and pound were fixed by international agreement in 1959. The US gallon is defined as 231 cubic inches; the UK (imperial) gallon is defined directly in liters.",
    },
    {
      label: "Data sizes",
      expression: "1 kB = 1,000 bytes · 1 KiB = 1,024 bytes · 1 GB = 10⁹ bytes · 1 GiB = 2³⁰ bytes",
    },
  ],
  examples: [
    {
      title: "Why does my 500 GB drive show 465 GB?",
      steps: ["500 GB = 500,000,000,000 bytes", "1 GiB = 1,073,741,824 bytes", "500,000,000,000 ÷ 1,073,741,824 ≈ 465.66"],
      result: "500 GB ≈ 465.66 GiB. Windows reports binary gibibytes but labels them GB, so no space is actually missing.",
    },
    {
      title: "Motorway speed limit in km/h",
      steps: ["1 mile = 1.609344 km", "60 × 1.609344 = 96.56064"],
      result: "60 mph ≈ 96.56 km/h.",
    },
    {
      title: "Flat size in square meters",
      steps: ["1 ft = 0.3048 m, so 1 ft² = 0.09290304 m²", "2,000 × 0.09290304 = 185.80608"],
      result: "2,000 sq ft ≈ 185.81 m².",
    },
    {
      title: "Download time for a 1 GB file on a 100 Mbit/s connection",
      steps: ["100 Mbit/s ÷ 8 = 12.5 MB/s", "1,000 MB ÷ 12.5 MB/s = 80 seconds"],
      result: "About 80 seconds at full speed. Internet speeds are quoted in bits, file sizes in bytes.",
    },
  ],
  sections: [
    {
      heading: "What is the difference between a US gallon and a UK gallon?",
      paragraphs: [
        "A UK (imperial) gallon is 4.54609 liters, about 20% larger than a US gallon of 3.785411784 liters. The same split affects pints and fluid ounces: a UK pint is 20 UK fluid ounces (568 mL) while a US pint is 16 US fluid ounces (473 mL). Fuel economy figures in miles per gallon are therefore not comparable between the two countries without converting.",
      ],
    },
    {
      heading: "Are kilobytes 1,000 or 1,024 bytes?",
      paragraphs: [
        "Officially, 1,000. The SI prefixes kilo, mega and giga mean powers of 10, and the binary units KiB, MiB and GiB were introduced for powers of 1,024. In practice, drive makers and macOS use decimal units, while Windows and some software use binary values under decimal names. The converter lists both families separately so you can see exactly which is which.",
      ],
    },
  ],
  faqs: [
    {
      question: "How accurate are the conversions?",
      answer:
        "The factors are the exact legal definitions, so any difference comes only from rounding the displayed result. Use more decimal places if you need them for engineering work.",
    },
    {
      question: "Is weight the same as mass here?",
      answer:
        "Yes, in the everyday sense. Kilograms and pounds measure mass; the converter does not deal with force units such as newtons.",
    },
    {
      question: "How many cups are in a liter?",
      answer:
        "About 4.23 US cups, since a US cup is one sixteenth of a US gallon (236.6 mL). Recipes from other countries may use a 250 mL metric cup instead.",
    },
    {
      question: "How do I convert knots to km/h?",
      answer:
        "Multiply by 1.852, because a knot is one nautical mile (1,852 m) per hour. 20 knots is 37.04 km/h.",
    },
    {
      question: "Can I convert between categories, such as liters to kilograms?",
      answer:
        "Not directly, because it depends on the substance's density. For water, 1 liter is very close to 1 kg, but a liter of cooking oil weighs about 0.92 kg.",
    },
  ],
};

export default content;
