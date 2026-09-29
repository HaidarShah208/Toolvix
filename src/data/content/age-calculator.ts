import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Your age is the number of full years since your date of birth, plus the months and days since your last birthday. Someone born on 14 March 1990 is 36 years, 6 months and 15 days old on 29 September 2026.",
  intro:
    "Subtracting birth years gets you close, but it is off by one for anyone whose birthday hasn't come round yet this year. This calculator counts whole calendar years, months and days, then adds the totals people actually need for forms and milestones: age in months, weeks and days, the weekday you were born, and a countdown to your next birthday.",
  howToUse: [
    "Enter your date of birth.",
    "Leave the \"age on\" date empty to use today, or set it to any past or future date, such as a school cut-off or retirement date.",
    "Read your age in years, months and days, followed by the totals in months, weeks and days.",
    "Check the weekday you were born and how many days remain until your next birthday, then copy the result if you need it elsewhere.",
  ],
  howItWorks: [
    "The calculator steps forward from your birth date in whole years until one more year would overshoot the target date, then does the same with months, and counts the remaining days. This matches how age is stated on official documents: you only turn a year older on your birthday itself.",
    "Months have different lengths, so \"6 months and 15 days\" is measured on the calendar rather than by dividing days by 30. The total days figure is an exact count of calendar days between the two dates, and weeks are that total divided by seven.",
    "If you were born on 29 February, your birthday in a non-leap year is treated as 28 February, so your age ticks over on the last day of February rather than skipping a year.",
  ],
  formulas: [
    {
      label: "Age in completed years",
      expression:
        "Years = target year − birth year − (1 if the birthday hasn't happened yet in the target year, otherwise 0)",
    },
    {
      label: "Age in weeks",
      expression: "Weeks = total days ÷ 7",
      note: "Any remainder is shown as extra days.",
    },
  ],
  examples: [
    {
      title: "Born 14 March 1990, age on 29 September 2026",
      steps: [
        "Whole years: 14 March 1990 to 14 March 2026 = 36 years",
        "Whole months: 14 March to 14 September 2026 = 6 months",
        "Remaining days: 14 September to 29 September = 15 days",
        "Total days between the dates: 13,348, which is 1,906 weeks and 6 days",
      ],
      result:
        "36 years, 6 months, 15 days (438 months in total). Born on a Wednesday; the next birthday is 166 days away.",
    },
    {
      title: "Leap-day birthday: born 29 February 2008",
      steps: [
        "2027 is not a leap year, so the birthday is treated as 28 February 2027",
        "On 28 February 2027 the age becomes 19 years, 0 months, 0 days",
      ],
      result: "A leap-day baby turns 19 on 28 February 2027, not on 1 March.",
    },
  ],
  sections: [
    {
      heading: "How do I find my age on a specific date?",
      paragraphs: [
        "Set the \"age on\" field to that date. This is useful for eligibility rules written as \"must be 18 by 1 September\" or \"under 26 on the date of travel\". If the result shows the required number of whole years, you meet the rule; the extra months and days don't matter.",
      ],
    },
    {
      heading: "Why do different sites give slightly different ages in months or days?",
      paragraphs: [
        "Some tools divide total days by 30 or 365.25 to get months and years, which drifts away from the calendar. Others handle birth days that don't exist in the target month, such as the 31st, in different ways. This calculator uses calendar months, so its years-months-days answer agrees with counting on a calendar.",
      ],
    },
  ],
  faqs: [
    {
      question: "How old am I in days?",
      answer:
        "Enter your date of birth and the total days line shows the exact number of calendar days from your birth to the chosen date. Every leap day in between is included.",
    },
    {
      question: "What day of the week was I born on?",
      answer:
        "It is shown with your results. The weekday comes from the Gregorian calendar, so it is correct for any modern date of birth.",
    },
    {
      question: "Does the calculator count the day I was born?",
      answer:
        "It counts the time elapsed since your birth date, the same way age is normally stated. On the day you are born your age is 0 days, and on your first birthday it is exactly 1 year.",
    },
    {
      question: "When does someone born on 29 February have a birthday?",
      answer:
        "In leap years it is 29 February. In other years this calculator treats 28 February as the birthday. Legal rules vary by country and some use 1 March, so check if it matters for an official purpose.",
    },
    {
      question: "Can I calculate the age of something other than a person?",
      answer:
        "Yes. Enter any start date, such as a wedding, the day a company was founded or a pet's birthday, to get the elapsed years, months and days.",
    },
    {
      question: "Is my date of birth stored anywhere?",
      answer:
        "No. The calculation runs in your browser and the dates you type are not sent to a server.",
    },
  ],
};

export default content;
