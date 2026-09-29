import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "GPA is total quality points divided by total credits, where quality points are each course's credits multiplied by its grade points. Four credits of B+ (3.3) and three credits of A (4.0) give (13.2 + 12.0) ÷ 7 = 3.60.",
  intro:
    "A GPA is a credit-weighted average: a four-credit lab counts for more than a one-credit seminar. Add your courses with their credits and letter grades, and the calculator shows your semester GPA along with the credits and quality points behind it, so you can check it against your transcript.",
  howToUse: [
    "Pick the grading scale: 4.0 (A+ counts as 4.0) or 4.3 (A+ counts as 4.3).",
    "For each course, enter the credit hours and choose the letter grade. Add rows for extra courses and remove any you don't need.",
    "Your GPA, total credits and total quality points update as you go.",
    "Change a grade to see how a single course would move your average.",
  ],
  howItWorks: [
    "Each letter grade maps to grade points: A 4.0, A− 3.7, B+ 3.3, B 3.0, B− 2.7, C+ 2.3, C 2.0, C− 1.7, D+ 1.3, D 1.0, D− 0.7 and F 0. On the 4.3 scale, A+ is worth 4.3; on the 4.0 scale it is capped at 4.0.",
    "Multiplying grade points by credits gives the quality points for that course. Adding them up and dividing by total credits produces the GPA. A failed course still adds its credits to the denominator while contributing zero points, which is why an F pulls the average down so sharply.",
    "Schools don't all use the same rules. Some ignore plus and minus grades, some give extra points for honors or AP courses (a weighted GPA), and pass/fail courses usually carry no grade points at all. Check your institution's handbook and leave out any courses that don't count toward GPA.",
  ],
  formulas: [
    {
      label: "Grade point average",
      expression: "GPA = Σ(credits × grade points) ÷ Σ credits",
      variables: [
        { symbol: "credits", meaning: "credit hours for a course" },
        { symbol: "grade points", meaning: "the value of the letter grade on the chosen scale" },
      ],
    },
  ],
  examples: [
    {
      title: "Four-course semester on the 4.0 scale",
      steps: [
        "Biology, 3 credits, A: 3 × 4.0 = 12.0",
        "Chemistry, 4 credits, B+: 4 × 3.3 = 13.2",
        "English, 3 credits, A−: 3 × 3.7 = 11.1",
        "Statistics, 2 credits, C: 2 × 2.0 = 4.0",
        "Quality points: 40.3; credits: 12; 40.3 ÷ 12 = 3.358",
      ],
      result: "Semester GPA ≈ 3.36.",
    },
    {
      title: "Same semester, but Biology is an A+",
      steps: [
        "4.0 scale: A+ = 4.0, so nothing changes and the GPA stays 3.36",
        "4.3 scale: 3 × 4.3 = 12.9, quality points become 41.2, and 41.2 ÷ 12 = 3.433",
      ],
      result: "3.36 on the 4.0 scale, about 3.43 on the 4.3 scale.",
    },
  ],
  sections: [
    {
      heading: "Is a 3.5 GPA good?",
      paragraphs: [
        "On a 4.0 scale, 3.5 sits between a B+ and an A− average, and 3.0 and 3.5 are common cut-offs for honors lists, scholarships and graduate programs. Whether it is competitive depends on the specific program and how demanding your courses are, so compare it with the requirements you are actually targeting.",
      ],
    },
    {
      heading: "Which courses move my GPA the most?",
      paragraphs: [
        "Higher-credit courses, because they carry more weight. Raising a four-credit course from B to A adds 4.0 quality points; doing the same in a one-credit course adds only 1.0. Early in a degree each semester has a large effect, while later your cumulative GPA becomes harder to shift. To combine semesters, use the CGPA calculator.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the difference between the 4.0 and 4.3 scales?",
      answer:
        "Here the only difference is the A+. On a 4.0 scale it is worth the same as an A; on a 4.3 scale it earns 4.3, so a transcript with A+ grades can exceed 4.0.",
    },
    {
      question: "Do pass/fail courses count toward GPA?",
      answer:
        "Usually not. A pass normally earns credits but no grade points, so leave it out. Whether a fail counts depends on your school.",
    },
    {
      question: "What is a weighted GPA?",
      answer:
        "Some high schools add extra points for honors, AP or IB courses, for example 5.0 for an A instead of 4.0. This calculator gives an unweighted GPA, because weighting rules differ between schools.",
    },
    {
      question: "How do I calculate GPA if my courses have no credit hours?",
      answer:
        "Give every course the same credit value, such as 1. The GPA then becomes the simple average of your grade points.",
    },
    {
      question: "Does a retaken course replace the old grade?",
      answer:
        "That depends on your school's repeat policy. If the new grade replaces the old one, enter only the new grade; if both count, enter the course twice.",
    },
  ],
};

export default content;
