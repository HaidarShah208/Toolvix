import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "To calculate GPA, convert each letter grade to grade points, multiply by the course's credit hours, add those quality points together and divide by the total credits. For example, an A (4.0) in a 3-credit course and a B (3.0) in a 4-credit course give (12 + 12) ÷ 7 ≈ 3.43.",
  intro:
    "A grade point average turns a transcript of letter grades into a single number, weighted so that bigger courses count for more. The method is the same almost everywhere, but the details, such as how an A+ or a pass/fail course is treated, depend on your school. It is worth learning the manual method so you can check a report card or plan ahead for next term.",
  steps: [
    "List every graded course for the term with its credit hours (sometimes called units).",
    "Convert each letter grade to grade points using your school's scale. On the common US 4.0 scale, A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0 and so on.",
    "Multiply each course's grade points by its credit hours to get quality points.",
    "Add up the quality points and add up the credit hours, leaving out courses that do not count toward GPA, such as pass/fail or audited classes.",
    "Divide total quality points by total credit hours. Most schools report the result to two decimal places.",
  ],
  formulas: [
    {
      label: "Credit-weighted GPA",
      expression: "GPA = Σ(grade points × credits) ÷ Σ credits",
      variables: [
        { symbol: "grade points", meaning: "the numeric value of the letter grade on your school's scale" },
        { symbol: "credits", meaning: "the credit hours or units the course is worth" },
        { symbol: "Σ", meaning: "sum over all graded courses in the period" },
      ],
    },
    {
      label: "Quality points for one course",
      expression: "Quality points = grade points × credits",
      note: "A B+ (3.3) in a 4-credit course is worth 13.2 quality points.",
    },
  ],
  examples: [
    {
      title: "A five-course semester on the 4.0 scale",
      steps: [
        "Calculus, A, 3 credits: 4.0 × 3 = 12.0",
        "Chemistry, B+, 4 credits: 3.3 × 4 = 13.2",
        "English, B, 3 credits: 3.0 × 3 = 9.0",
        "Spanish, A−, 2 credits: 3.7 × 2 = 7.4",
        "Physical education, C, 1 credit: 2.0 × 1 = 2.0",
        "Totals: 43.6 quality points over 13 credits",
        "43.6 ÷ 13 ≈ 3.354",
      ],
      result: "Semester GPA ≈ 3.35. Averaging the five grade values without credits would give 3.20, which understates the result.",
    },
    {
      title: "The same semester as a weighted high school GPA",
      steps: [
        "Calculus is AP, so its A counts as 5.0: 5.0 × 3 = 15.0",
        "Chemistry is honors, so its B+ gets +0.5: 3.8 × 4 = 15.2",
        "Other courses are unchanged: 9.0 + 7.4 + 2.0 = 18.4",
        "Total: 15.0 + 15.2 + 18.4 = 48.6 over 13 credits",
        "48.6 ÷ 13 ≈ 3.738",
      ],
      result: "Weighted GPA ≈ 3.74, compared with an unweighted 3.35. The size of the bonus depends on the school.",
    },
    {
      title: "How much does one failed course move the average?",
      steps: [
        "Current term: 15 credits at a 3.4 GPA = 3.4 × 15 = 51 quality points",
        "Add a 3-credit F: 0 × 3 = 0 quality points",
        "New total: 51 over 18 credits",
        "51 ÷ 18 ≈ 2.833",
      ],
      result: "The term GPA drops from 3.40 to about 2.83, because the F adds credits without adding points.",
    },
  ],
  sections: [
    {
      heading: "How are letter grades converted to points?",
      paragraphs: [
        "Most US colleges and many high schools use this 4.0 scale: A = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, F = 0.",
        "Variations are common. Some schools award 4.3 for an A+, others cap it at 4.0. Some do not use plus or minus grades at all, and some outside the US grade on 5-point, 10-point or percentage scales. Always check the scale printed in your student handbook or on your transcript key before you calculate.",
      ],
    },
    {
      heading: "Why do credit hours matter so much?",
      paragraphs: [
        "Credits reflect how much work a course represents, so a 4-credit lab science should affect your average more than a 1-credit seminar. Weighting by credits means your GPA is the average grade per credit hour, not per course.",
        "This has a practical consequence: if you want to lift your GPA, a strong grade in a high-credit course helps far more than the same grade in a small one. In the first example, turning the 1-credit C into an A would add 2 quality points, while turning the 4-credit B+ into an A would add 2.8.",
      ],
    },
    {
      heading: "What is the difference between weighted and unweighted GPA?",
      paragraphs: [
        "An unweighted GPA treats every course on the same 4.0 scale regardless of difficulty. A weighted GPA gives extra points for more demanding classes, typically +0.5 for honors and +1.0 for AP, IB or dual-enrollment courses, so an A in an AP class counts as 5.0.",
        "Weighting is mostly a high school practice, and there is no single national rule. Colleges know this, so many recalculate applicants' GPAs using their own method or look at the transcript directly rather than taking a weighted number at face value.",
      ],
    },
    {
      heading: "Which courses are left out?",
      list: [
        "Pass/fail or credit/no-credit courses usually add credits toward graduation but not toward GPA.",
        "Withdrawals (W) and incompletes typically carry no grade points until resolved.",
        "Transfer credits often appear on the transcript without affecting the home institution's GPA.",
        "Repeated courses are handled differently between schools: some replace the old grade, some average both attempts.",
      ],
    },
    {
      heading: "Common mistakes",
      list: [
        "Averaging letter-grade values without weighting by credits.",
        "Including pass/fail courses in the credit total, which dilutes the average.",
        "Using a generic scale when your school uses different values for plus and minus grades.",
        "Rounding each course's quality points before adding them up.",
        "Comparing weighted and unweighted GPAs as if they were on the same scale.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is a 3.5 GPA good?",
      answer:
        "On a 4.0 unweighted scale, 3.5 is roughly an A−/B+ average and is generally considered strong. How it compares depends on the school, the program and whether the figure is weighted.",
    },
    {
      question: "Can a GPA be higher than 4.0?",
      answer:
        "Yes, on a weighted scale, where honors and AP courses earn bonus points, or at schools that award 4.3 for an A+. An unweighted GPA on a standard 4.0 scale cannot exceed 4.0.",
    },
    {
      question: "What is the difference between GPA and CGPA?",
      answer:
        "GPA usually refers to one term, while CGPA, or cumulative GPA, combines every term so far. Cumulative GPA is calculated the same way, using all quality points and credits across your whole record.",
    },
    {
      question: "How do I convert a percentage grade to GPA?",
      answer:
        "There is no universal formula. Each school maps percentage bands to letter grades differently, so use the conversion table your institution publishes.",
    },
    {
      question: "Do plus and minus grades affect GPA?",
      answer:
        "At most schools that use them, yes: a B+ is 3.3 and a B− is 2.7 rather than a flat 3.0. Some schools record plus and minus on the transcript but ignore them in the GPA.",
    },
  ],
};

export default guide;
