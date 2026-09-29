import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "To calculate CGPA, multiply each semester's GPA by the credits taken that semester, add the results, and divide by the total credits. Semesters of 3.2 over 15 credits and 3.8 over 12 credits give (48 + 45.6) ÷ 27 ≈ 3.47, not the 3.50 you would get by simply averaging the two GPAs.",
  intro:
    "Cumulative grade point average, or CGPA, is the running average of everything you have been graded on so far. It is the number that appears on transcripts, scholarship forms and graduate applications. The calculation is short, but it has one rule people often skip: every semester has to be weighted by how many credits it contained.",
  steps: [
    "Collect the GPA and the number of graded credits for each semester from your transcripts or student portal.",
    "Multiply each semester's GPA by its credits to get that semester's total grade points.",
    "Add the grade points from all semesters.",
    "Add the credits from all semesters, counting only credits that were included in each semester's GPA.",
    "Divide total grade points by total credits and round the way your institution does, usually to two decimals.",
  ],
  formulas: [
    {
      label: "Cumulative GPA from semester GPAs",
      expression: "CGPA = Σ(GPAᵢ × Cᵢ) ÷ ΣCᵢ",
      variables: [
        { symbol: "GPAᵢ", meaning: "the GPA for semester i" },
        { symbol: "Cᵢ", meaning: "graded credits taken in semester i" },
      ],
    },
    {
      label: "GPA needed to reach a target CGPA",
      expression: "Required GPA = (Target × (C₀ + C₁) − CGPA₀ × C₀) ÷ C₁",
      variables: [
        { symbol: "CGPA₀", meaning: "your current cumulative GPA" },
        { symbol: "C₀", meaning: "credits already completed" },
        { symbol: "C₁", meaning: "credits you still plan to take" },
        { symbol: "Target", meaning: "the cumulative GPA you want to reach" },
      ],
      note: "If the answer is higher than your scale's maximum, the target cannot be reached within those credits.",
    },
  ],
  examples: [
    {
      title: "Three semesters with different course loads",
      steps: [
        "Semester 1: 3.2 × 15 = 48.0",
        "Semester 2: 3.8 × 12 = 45.6",
        "Semester 3: 2.9 × 18 = 52.2",
        "Total grade points: 48.0 + 45.6 + 52.2 = 145.8",
        "Total credits: 15 + 12 + 18 = 45",
        "145.8 ÷ 45 = 3.24",
      ],
      result: "CGPA = 3.24. A plain average of 3.2, 3.8 and 2.9 would give 3.30, overstating it because the strongest semester was also the lightest.",
    },
    {
      title: "Adding a new semester to an existing CGPA",
      steps: [
        "Existing record: 3.24 over 45 credits = 145.8 grade points",
        "New semester: 3.6 over 15 credits = 54.0 grade points",
        "Combined: 145.8 + 54.0 = 199.8 over 60 credits",
        "199.8 ÷ 60 = 3.33",
      ],
      result: "The new CGPA is 3.33. You do not need every course grade, only the previous CGPA and its credit total.",
    },
    {
      title: "What GPA do I need next year to reach 3.3?",
      steps: [
        "Current: 3.1 CGPA over 60 credits = 186 grade points",
        "Target after 30 more credits: 3.3 × 90 = 297 grade points",
        "Points needed: 297 − 186 = 111",
        "111 ÷ 30 = 3.7",
      ],
      result: "You would need a 3.7 GPA across the next 30 credits.",
    },
  ],
  sections: [
    {
      heading: "Why is averaging semester GPAs wrong?",
      paragraphs: [
        "A simple average gives every semester equal influence, no matter how many credits it had. That only works when every semester has the same load. In practice, loads vary: a summer term might have 6 credits and a regular term 18.",
        "Consider a 6-credit summer term at 4.0 and an 18-credit term at 2.5. The simple average is 3.25. The credit-weighted CGPA is (24 + 45) ÷ 24 = 2.875. The student has earned far more credits at 2.5 than at 4.0, and the weighted figure reflects that. Registrars always use the weighted method, so a simple average will not match your transcript.",
      ],
    },
    {
      heading: "Does it matter which credits I count?",
      paragraphs: [
        "Yes. Use graded credits, sometimes labeled GPA hours or attempted hours, not total earned credits. Pass/fail courses, transfer credits and withdrawals often count toward graduation but are left out of the GPA. If you include them in the denominator, your calculated CGPA will be too low.",
        "Retaken courses are another source of mismatch. Some institutions replace the earlier grade, some average both attempts, and some count both. If your figure differs slightly from the official one, a repeated course is often the reason.",
      ],
    },
    {
      heading: "What scales are used for CGPA?",
      paragraphs: [
        "The 4.0 scale is standard in the US and common elsewhere, but it is far from universal. Many universities in India, Pakistan, Bangladesh and other countries use a 10-point or 5-point scale, and some European and Asian systems use their own grade bands. The formula works the same on any scale; only the maximum changes.",
        "What you cannot do is combine semesters recorded on different scales without first converting them, and there is rarely a neat mathematical conversion. A 3.5 out of 4 and an 8.75 out of 10 are both 87.5% of the maximum, but that does not mean an admissions office will treat them as equivalent.",
      ],
    },
    {
      heading: "How do you convert CGPA to a percentage?",
      paragraphs: [
        "Only with the formula your institution publishes. Some universities and exam boards specify a multiplier, others a lookup table, and others a formula with an offset. Dividing by the maximum and multiplying by 100 is a common guess but frequently does not match the official conversion.",
        "If an application asks for a percentage, look for a conversion certificate or a statement on your transcript, and quote that rather than your own calculation.",
      ],
    },
    {
      heading: "How much can one semester change a CGPA?",
      paragraphs: [
        "Less and less as you progress. After 30 credits, a strong 15-credit semester carries a third of the weight of your whole record. After 120 credits, the same semester carries about a ninth. That is why early semesters shape a CGPA most, and why a late push can only move it so far. The target formula above is the quickest way to see what is realistic.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is CGPA the same as cumulative GPA?",
      answer:
        "Yes. CGPA is an abbreviation for cumulative grade point average, the average across all terms so far. Some institutions call it overall GPA.",
    },
    {
      question: "What is the difference between SGPA and CGPA?",
      answer:
        "SGPA is the grade point average for a single semester. CGPA combines all semesters by weighting each SGPA by its credits.",
    },
    {
      question: "Can I calculate CGPA if every semester had the same number of credits?",
      answer:
        "In that case the weighted and simple averages are identical, so averaging the semester GPAs gives the correct answer. As soon as loads differ, you need the weighted method.",
    },
    {
      question: "Why doesn't my calculated CGPA match my transcript?",
      answer:
        "The most common causes are counting non-graded credits, using rounded semester GPAs, and repeated-course policies. Using the exact grade points and GPA hours from the transcript usually resolves it.",
    },
    {
      question: "Is a CGPA of 3.0 good?",
      answer:
        "On a 4.0 scale it represents a B average, which meets the minimum for many graduate programs and employers that set a cutoff. Competitive programs often expect higher.",
    },
  ],
};

export default guide;
