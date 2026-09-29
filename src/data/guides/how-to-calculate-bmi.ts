import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "BMI is your weight in kilograms divided by your height in meters squared. Someone who weighs 70 kg and is 1.75 m tall has a BMI of 70 ÷ 1.75² = 70 ÷ 3.0625 ≈ 22.9. In pounds and inches, multiply weight by 703 before dividing by height squared.",
  intro:
    "Body mass index is a quick screening number that relates weight to height. It is cheap, needs no equipment beyond a scale and a tape measure, and is used worldwide to flag possible weight-related health risk in adults. It is also blunt: it cannot tell muscle from fat, which is why it works better as a starting point than a verdict.",
  steps: [
    "Measure your height without shoes and your weight in light clothing, ideally at the same time of day.",
    "If you use metric units, convert height to meters (175 cm is 1.75 m). If you use imperial units, convert height entirely to inches (5 ft 10 in is 70 in).",
    "Square the height by multiplying it by itself.",
    "Divide weight by the squared height. For pounds and inches, multiply the weight by 703 first.",
    "Round to one decimal place and compare the result with the adult categories below.",
  ],
  formulas: [
    {
      label: "Metric BMI",
      expression: "BMI = weight (kg) ÷ height (m)²",
      variables: [
        { symbol: "weight", meaning: "body weight in kilograms" },
        { symbol: "height", meaning: "standing height in meters" },
      ],
    },
    {
      label: "Imperial BMI",
      expression: "BMI = 703 × weight (lb) ÷ height (in)²",
      variables: [
        { symbol: "weight", meaning: "body weight in pounds" },
        { symbol: "height", meaning: "standing height in inches" },
        { symbol: "703", meaning: "conversion factor that makes the imperial result match the metric one" },
      ],
      note: "703 is a rounded factor, so imperial results can differ from metric ones by a few hundredths.",
    },
    {
      label: "Weight for a target BMI",
      expression: "weight (kg) = BMI × height (m)²",
      note: "Useful for finding the weight range that corresponds to a BMI band at a given height.",
    },
  ],
  examples: [
    {
      title: "Metric: 70 kg, 1.75 m",
      steps: ["1.75 × 1.75 = 3.0625", "70 ÷ 3.0625 ≈ 22.86"],
      result: "BMI ≈ 22.9, which falls in the normal range for adults.",
    },
    {
      title: "Imperial: 180 lb, 5 ft 10 in",
      steps: [
        "5 ft 10 in = 5 × 12 + 10 = 70 in",
        "70 × 70 = 4,900",
        "180 × 703 = 126,540",
        "126,540 ÷ 4,900 ≈ 25.82",
      ],
      result: "BMI ≈ 25.8, just inside the overweight range.",
    },
    {
      title: "Metric: 95 kg, 1.68 m",
      steps: ["1.68 × 1.68 = 2.8224", "95 ÷ 2.8224 ≈ 33.66"],
      result: "BMI ≈ 33.7, which the WHO classifies as obesity class I.",
    },
    {
      title: "What weight range is a normal BMI at 1.75 m?",
      steps: ["18.5 × 3.0625 ≈ 56.7 kg", "24.9 × 3.0625 ≈ 76.3 kg"],
      result: "At 1.75 m, a BMI of 18.5 to 24.9 corresponds to roughly 56.7 to 76.3 kg.",
    },
  ],
  sections: [
    {
      heading: "What are the adult BMI categories?",
      paragraphs: [
        "The World Health Organization uses the same cut-offs for adult men and women aged 20 and over:",
      ],
      list: [
        "Below 18.5: underweight",
        "18.5 to 24.9: normal weight",
        "25.0 to 29.9: overweight (pre-obesity)",
        "30.0 to 34.9: obesity class I",
        "35.0 to 39.9: obesity class II",
        "40.0 and above: obesity class III",
      ],
    },
    {
      heading: "Why is height squared?",
      paragraphs: [
        "Taller people are heavier partly just because they are bigger, so dividing by height alone would penalize them. The 19th-century statistician Adolphe Quetelet noticed that, in adults, weight tends to scale roughly with the square of height, and squaring became the convention. It is an approximation: very tall people tend to get slightly higher BMIs and very short people slightly lower ones than their body composition would suggest.",
      ],
    },
    {
      heading: "What does BMI not tell you?",
      paragraphs: [
        "BMI measures size, not health. Two people with the same BMI can have very different amounts of body fat and very different risk profiles.",
      ],
      list: [
        "It does not distinguish muscle from fat, so athletes and people with a lot of muscle can read as overweight.",
        "It says nothing about where fat is stored. Fat around the abdomen is more closely linked to metabolic risk than fat on the hips, which is why waist circumference is often checked alongside BMI.",
        "Older adults often lose muscle and gain fat without changing weight, so a stable BMI can hide real change.",
        "Risk at a given BMI varies between populations. Some health bodies use lower action thresholds for people of South Asian, Chinese and other Asian backgrounds.",
        "It is not designed for pregnancy, when weight gain is expected and assessed differently.",
      ],
    },
    {
      heading: "How is BMI used for children and teenagers?",
      paragraphs: [
        "The arithmetic is the same, but the adult categories do not apply. Children's body fat changes as they grow and differs between boys and girls, so a child's BMI is compared with reference charts for their exact age and sex and reported as a percentile.",
        "Under the widely used CDC approach, below the 5th percentile is considered underweight, the 5th to below the 85th percentile a healthy weight, the 85th to below the 95th overweight, and the 95th percentile or above obesity. A pediatrician or school nurse is the right person to interpret those numbers.",
      ],
    },
    {
      heading: "Common measurement mistakes",
      list: [
        "Using centimeters instead of meters in the metric formula, which produces a result 10,000 times too small.",
        "Converting 5 ft 10 in to 5.10 ft. It is 70 inches, or about 5.83 ft.",
        "Forgetting to square the height, or squaring the weight instead.",
        "Relying on self-reported height, which people tend to overestimate slightly.",
        "Reading a single BMI as a diagnosis rather than as one screening measure.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is BMI different for men and women?",
      answer:
        "For adults, no. The formula and the WHO categories are the same for both sexes, although women on average carry more body fat than men at the same BMI.",
    },
    {
      question: "What is a healthy BMI?",
      answer:
        "For most adults, the WHO considers 18.5 to 24.9 the normal range. Where you sit within it matters less than other markers such as waist size, blood pressure and fitness.",
    },
    {
      question: "Why does my BMI say overweight when I am muscular?",
      answer:
        "Muscle is dense, and BMI only counts total weight. If you train regularly, a body fat estimate or waist measurement will give a more useful picture.",
    },
    {
      question: "Where does the number 703 come from?",
      answer:
        "It converts pounds and square inches into kilograms and square meters. One pound per square inch equals about 703.07 kg per square meter, and the formula rounds that to 703.",
    },
    {
      question: "Should older adults use the same BMI ranges?",
      answer:
        "The WHO categories are the same, but some research suggests a slightly higher BMI may not carry extra risk in older age. This is an area where a doctor's judgment matters more than the chart.",
    },
  ],
  disclaimer:
    "BMI is a screening tool, not a diagnosis. It does not measure body fat or overall health. For advice about your weight or health, talk to a doctor or other qualified health professional.",
};

export default guide;
