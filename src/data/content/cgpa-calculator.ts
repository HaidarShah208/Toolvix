import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "CGPA is the credit-weighted average of your semester GPAs: multiply each semester's GPA by its credits, add the results, and divide by total credits. Semesters of 3.2 over 15 credits and 3.8 over 12 credits give (48 + 45.6) ÷ 27 ≈ 3.47.",
  intro:
    "Averaging your semester GPAs directly only works if every semester carried the same number of credits. This calculator weights each semester by its credits, supports 4.0, 4.3, 5.0 and 10.0 scales, and shows the simple average alongside so you can see how much the weighting changes the result.",
  howToUse: [
    "Choose the grading scale your university uses: 4.0, 4.3, 5.0 or 10.0.",
    "Add a row for each semester and enter its GPA (or SGPA) and the credits it covered.",
    "Read your cumulative GPA, total credits and the simple, unweighted average for comparison.",
    "Add a row for an upcoming semester with a target GPA to see where your CGPA would land.",
  ],
  howItWorks: [
    "A semester GPA already averages courses within that term. To combine terms fairly, each GPA is converted back into grade points by multiplying by its credits. The sum of those points divided by total credits is the same answer you would get by averaging every course individually.",
    "The simple average treats each semester equally regardless of credits. When a light semester has an unusually high or low GPA, the two figures diverge, and the credit-weighted CGPA is the one universities normally report.",
    "The scale doesn't change the arithmetic; it only sets the maximum value accepted, so a GPA of 8.4 is valid on the 10-point scale but not on the 4-point one.",
  ],
  formulas: [
    {
      label: "Cumulative GPA",
      expression: "CGPA = Σ(GPAᵢ × creditsᵢ) ÷ Σ creditsᵢ",
      variables: [
        { symbol: "GPAᵢ", meaning: "the GPA for semester i" },
        { symbol: "creditsᵢ", meaning: "credits earned or attempted in semester i, as your university defines them" },
      ],
    },
  ],
  examples: [
    {
      title: "Three semesters on a 4.0 scale",
      steps: [
        "Semester 1: 3.2 × 15 = 48.0",
        "Semester 2: 3.8 × 12 = 45.6",
        "Semester 3: 3.5 × 18 = 63.0",
        "Total points 156.6 ÷ total credits 45 = 3.48",
        "Simple average: (3.2 + 3.8 + 3.5) ÷ 3 = 3.50",
      ],
      result: "CGPA 3.48, slightly below the simple average because the strongest semester carried the fewest credits.",
    },
    {
      title: "Three semesters on a 10-point scale",
      steps: [
        "8.2 × 20 = 164.0",
        "7.6 × 22 = 167.2",
        "9.0 × 18 = 162.0",
        "493.2 ÷ 60 credits = 8.22",
      ],
      result: "CGPA 8.22 out of 10.",
    },
  ],
  sections: [
    {
      heading: "How do I convert CGPA to a percentage?",
      paragraphs: [
        "There is no universal formula. Each university or exam board decides its own conversion, and many print it on the transcript or in the academic regulations. For example, some Indian universities multiply a 10-point CGPA by 9.5, which would turn 8.22 into about 78.1%, but others use different factors or tables. Use the official rule of the institution that awarded the grade, especially for job or admission applications.",
      ],
    },
    {
      heading: "What is the difference between SGPA, GPA and CGPA?",
      paragraphs: [
        "SGPA (semester grade point average) and term GPA both describe a single semester. CGPA, or cumulative GPA, combines all semesters completed so far. Enter your SGPAs here to get the CGPA; to work out a single semester from course grades, use the GPA calculator.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why is my CGPA different from the average of my semester GPAs?",
      answer:
        "Because semesters with more credits count for more. The two only match when every semester has the same number of credits.",
    },
    {
      question: "Can I calculate CGPA without credits?",
      answer:
        "If every semester carried the same load, enter the same credit value for each row and the result equals the simple average. Otherwise you need the real credits to get an accurate figure.",
    },
    {
      question: "What CGPA do I need next semester to reach a target?",
      answer:
        "Add a row for the coming semester with its credits and try different GPAs until the cumulative result reaches your goal. The more credits you have already completed, the higher the semester GPA needed to move the CGPA.",
    },
    {
      question: "Does the calculator convert between 4.0 and 10.0 scales?",
      answer:
        "No. Conversions between scales are set by individual institutions and are not linear in every case, so the calculator keeps all semesters on the one scale you choose.",
    },
    {
      question: "Should I include failed or repeated courses?",
      answer:
        "Follow your transcript. If the university's semester GPA already includes them, use that GPA and credit figure as printed.",
    },
  ],
};

export default content;
