import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "The number of days between two dates is the later date minus the earlier one, counted on the calendar. From 15 January 2026 to 30 June 2026 is 166 days, or 5 months and 15 days; tick \"include end date\" to count both days and get 167.",
  intro:
    "Counting days on a calendar is slow and it's easy to miss a leap day or a 31st. This calculator works in two directions: it measures the gap between two dates in years, months, days, weeks and business days, and it adds or subtracts years, months, weeks and days from a date to find a deadline.",
  howToUse: [
    "To measure a gap, choose the difference mode and pick a start and end date.",
    "Tick \"include end date\" if both the first and last day should count, as with hotel nights versus holiday days or a contract that runs \"from and including\" a date.",
    "Read the result in years, months and days, plus total days, weeks and business days (Monday to Friday).",
    "To find a future or past date, switch to the add/subtract mode, pick a date and enter the years, months, weeks or days to add or take away.",
  ],
  howItWorks: [
    "Total days is an exact count of calendar days, so leap years are handled automatically. The years-months-days breakdown steps through whole calendar months, which is why 15 January to 30 June is 5 months and 15 days rather than a figure based on 30-day months.",
    "Business days count Monday to Friday only. Public holidays are not excluded because they differ by country and region, so subtract any that fall in your range yourself.",
    "When adding months, the day of the month is kept where possible. If it doesn't exist in the target month, the result is clamped to that month's last day: 31 January plus one month gives 28 February, or 29 February in a leap year.",
  ],
  formulas: [
    {
      label: "Total days",
      expression: "Days = end date − start date (+ 1 if the end date is included)",
    },
    {
      label: "Weeks",
      expression: "Weeks = total days ÷ 7, with the remainder shown as days",
    },
  ],
  examples: [
    {
      title: "15 January 2026 to 30 June 2026",
      steps: [
        "Calendar breakdown: 15 January to 15 June is 5 months, then 15 more days",
        "Total days: 166 (23 weeks and 5 days)",
        "With the end date included: 167 days, of which 119 are weekdays",
      ],
      result: "166 days, or 5 months 15 days; 119 business days counting both dates.",
    },
    {
      title: "90 days from 1 October 2026",
      steps: ["October has 31 days, November 30, December 31", "1 October + 90 days = 30 December 2026"],
      result: "Wednesday, 30 December 2026.",
    },
    {
      title: "One month after 31 January",
      steps: ["There is no 31 February, so the date clamps to the end of the month", "2027 is not a leap year; 2028 is"],
      result: "31 January 2027 + 1 month = 28 February 2027; 31 January 2028 + 1 month = 29 February 2028.",
    },
  ],
  sections: [
    {
      heading: "Should I include the end date?",
      paragraphs: [
        "It depends on what you're counting. The gap between two dates, such as nights in a hotel or days until an event, normally excludes the end date. A span of days you actually use or work, such as a leave request from Monday to Friday, normally includes both ends: Monday to Friday is 4 days apart but 5 days inclusive.",
      ],
    },
    {
      heading: "How do I count working days excluding holidays?",
      paragraphs: [
        "Take the business-day figure and subtract each public holiday that falls on a weekday within your range. For example, if a period has 21 weekdays and one bank holiday falls on a Monday inside it, there are 20 working days.",
      ],
    },
  ],
  faqs: [
    {
      question: "How many days until a specific date?",
      answer:
        "Set today as the start date and your target as the end date. The total days figure is the countdown; leave the end date excluded to match how most countdowns work.",
    },
    {
      question: "Does the calculator account for leap years?",
      answer:
        "Yes. Every calendar day is counted, so 29 February is included whenever it falls in the range.",
    },
    {
      question: "Why does adding 1 month to 31 January give 28 February?",
      answer:
        "February has no 31st, so the result is moved to the last valid day of the month. This is the same rule most spreadsheets and banking systems use.",
    },
    {
      question: "Are weekends and holidays excluded from total days?",
      answer:
        "Total days includes every day. The separate business-days figure excludes Saturdays and Sundays, but not public holidays.",
    },
    {
      question: "Can I subtract days to find a past date?",
      answer:
        "Yes. Use the subtract option in the add/subtract mode, for example to find the date 30 days before a deadline.",
    },
    {
      question: "What if the end date is before the start date?",
      answer:
        "The gap is the same length either way. Swap the dates if you want the result to read forward in time.",
    },
  ],
};

export default content;
