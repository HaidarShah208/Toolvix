import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "The average (arithmetic mean) is the sum of the numbers divided by how many there are. For 4, 8, 15, 16, 23 and 42, the sum is 108 and there are 6 values, so the mean is 108 ÷ 6 = 18.",
  intro:
    "\"Average\" can mean different things, and the right one depends on your data. Paste or type a list of numbers and this calculator returns the mean, median, mode, range, minimum, maximum, sum and count at once, plus the geometric mean when every value is positive.",
  howToUse: [
    "Type or paste your numbers, separated by commas, spaces or new lines.",
    "The results update as you type; check that every entry is a plain number, without units or currency symbols.",
    "Compare the mean and median: if they are far apart, a few extreme values are pulling the mean.",
    "Copy the summary to use in a report or spreadsheet.",
  ],
  howItWorks: [
    "The mean adds every value and divides by the count. The median sorts the values and takes the middle one, or the average of the two middle values when the count is even. The mode is the value that appears most often; a list can have several modes or none.",
    "Range is the maximum minus the minimum, a quick measure of spread. The geometric mean multiplies all values together and takes the nth root. It is the right average for growth rates and ratios, and is only defined here for positive numbers.",
    "The mean is sensitive to outliers, while the median isn't. That is why reports on house prices and incomes usually quote the median: a handful of very high values can lift the mean well above what a typical person sees.",
  ],
  formulas: [
    { label: "Mean", expression: "Mean = (x₁ + x₂ + … + xₙ) ÷ n" },
    {
      label: "Median",
      expression: "Middle value of the sorted list; for even n, the mean of the two middle values",
    },
    { label: "Range", expression: "Range = maximum − minimum" },
    {
      label: "Geometric mean",
      expression: "GM = (x₁ × x₂ × … × xₙ)^(1/n)",
      note: "All values must be greater than zero.",
    },
  ],
  examples: [
    {
      title: "4, 8, 15, 16, 23, 42",
      steps: [
        "Sum = 108; count = 6; mean = 108 ÷ 6 = 18",
        "Sorted middle values are 15 and 16, so median = 15.5",
        "No value repeats, so there is no mode",
        "Range = 42 − 4 = 38",
      ],
      result: "Mean 18, median 15.5, no mode, range 38.",
    },
    {
      title: "Quiz scores 3, 7, 7, 2, 9",
      steps: ["Sum = 28; mean = 28 ÷ 5 = 5.6", "Sorted: 2, 3, 7, 7, 9, so median = 7", "7 appears twice, so mode = 7"],
      result: "Mean 5.6, median 7, mode 7.",
    },
    {
      title: "Average growth of +10%, −5% and +20%",
      steps: [
        "Growth factors: 1.10, 0.95, 1.20",
        "Product = 1.254; cube root ≈ 1.0784",
        "The arithmetic mean of the percentages would be (10 − 5 + 20) ÷ 3 ≈ 8.33%",
      ],
      result: "The true average growth is about 7.84% a year, lower than the 8.33% arithmetic mean.",
    },
  ],
  sections: [
    {
      heading: "Should I use the mean or the median?",
      paragraphs: [
        "Use the mean when values are fairly symmetric and you want every value to count, such as average test scores in a class. Use the median when data is skewed or contains outliers, such as salaries, response times or property prices. If you're unsure, report both.",
      ],
    },
    {
      heading: "What is a weighted average, and can I calculate it here?",
      paragraphs: [
        "A weighted average gives some values more influence than others, like course credits in a GPA. This calculator treats every value equally. To weight values, you can repeat each one according to its weight, or use the GPA or CGPA calculators for grades.",
      ],
    },
  ],
  faqs: [
    {
      question: "What if there are two modes?",
      answer:
        "Both are shown. A list where two values tie for the most appearances is called bimodal. If every value appears once, there is no mode.",
    },
    {
      question: "Can I include negative numbers and decimals?",
      answer:
        "Yes, for the mean, median, mode, range and sum. The geometric mean needs every value to be positive, so it is not calculated when a list contains zero or negative values.",
    },
    {
      question: "How do I find the average of percentages?",
      answer:
        "If each percentage is based on the same size group, a simple mean is fine. For growth rates over time, convert them to factors (5% becomes 1.05) and use the geometric mean.",
    },
    {
      question: "Why is the mean different from the median?",
      answer:
        "Extreme values pull the mean toward them, while the median only depends on the middle of the list. A large gap between the two suggests skewed data.",
    },
    {
      question: "How many numbers can I enter?",
      answer:
        "Everyday lists work well, from a handful of scores to a column pasted from a spreadsheet. Everything is processed in your browser, not on a server.",
    },
  ],
};

export default content;
