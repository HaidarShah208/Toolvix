import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "To calculate age, subtract the birth date from today's date field by field: years, then months, then days. If the day or month you are subtracting from is smaller, borrow from the next unit up. Someone born on 17 August 1990 is 35 years, 6 months and 16 days old on 5 March 2026.",
  intro:
    "Finding someone's age in whole years is easy: it goes up by one on each birthday. Getting an exact age in years, months and days takes a little more care, because months have different lengths and leap years add an extra day. This guide shows the hand method, how to handle borrowing, and the few situations where different systems give different answers.",
  steps: [
    "Write the end date (usually today) above the birth date, each as year, month and day.",
    "Subtract the days. If the end day is smaller than the birth day, borrow one month: subtract 1 from the end month and add the number of days in the month before the end date to the end day.",
    "Subtract the months. If the end month is now smaller than the birth month, borrow one year: subtract 1 from the end year and add 12 to the end month.",
    "Subtract the years.",
    "Check the result by adding it back onto the birth date: years first, then months, then days. You should land exactly on the end date.",
  ],
  formulas: [
    {
      label: "Age in completed years",
      expression: "Age = end year − birth year, minus 1 if the birthday has not yet happened this year",
      note: "This is the figure used for most everyday and legal purposes.",
    },
    {
      label: "Leap year rule (Gregorian calendar)",
      expression: "Leap year if divisible by 4, except years divisible by 100 unless also divisible by 400",
      note: "2000 and 2024 were leap years; 1900 and 2100 are not.",
    },
    {
      label: "Approximate age in days",
      expression: "Days ≈ years × 365.2425",
      note: "Only an estimate. For an exact count, count the actual days between the two dates.",
    },
  ],
  examples: [
    {
      title: "Born 3 January 2000, age on 29 September 2026",
      steps: [
        "Days: 29 − 3 = 26",
        "Months: 9 − 1 = 8",
        "Years: 2026 − 2000 = 26",
      ],
      result: "26 years, 8 months and 26 days. No borrowing was needed because both the month and day had already passed.",
    },
    {
      title: "Born 17 August 1990, age on 5 March 2026",
      steps: [
        "Days: 5 is less than 17, so borrow a month. February 2026 has 28 days: 5 + 28 = 33, and the end month becomes 2.",
        "33 − 17 = 16 days",
        "Months: 2 is less than 8, so borrow a year: 2 + 12 = 14, and the end year becomes 2025.",
        "14 − 8 = 6 months",
        "Years: 2025 − 1990 = 35",
        "Check: 17 Aug 1990 + 35 years = 17 Aug 2025; + 6 months = 17 Feb 2026; + 16 days = 5 Mar 2026.",
      ],
      result: "35 years, 6 months and 16 days, which is 12,984 days in total.",
    },
    {
      title: "Born 29 February 2004, age on 28 February 2026",
      steps: [
        "2026 is not a leap year, so there is no 29 February.",
        "Completed years if the birthday is treated as 28 February: 22",
        "Completed years if the birthday is treated as 1 March: 21, turning 22 the next day",
      ],
      result: "The answer is 21 or 22 depending on the convention used, which is why leap-day birthdays need special care.",
    },
  ],
  sections: [
    {
      heading: "Why does borrowing use the previous month's length?",
      paragraphs: [
        "When you borrow a month to make the day subtraction work, you are counting the days that ran from the birth day in one month to the same day in the next. That span is the length of the month just before the end date. In the second example, the last full month ran from 17 January to 17 February, and the remaining days ran from 17 February to 5 March, which is 16 days because February 2026 had 28 days.",
        "Not every tool uses exactly this rule. Some borrow the length of the birth month, or treat every month as 30 days. For dates late in a month, this can shift the days figure by one to three days, even though the years and months agree. If two calculators disagree slightly, a different borrowing rule is the likely reason.",
      ],
    },
    {
      heading: "How do leap years affect age?",
      paragraphs: [
        "For age in years, they don't: you gain a year on your birthday whether the year has 365 or 366 days. They matter when counting days. Two people who are both exactly 10 years old may have lived through two or three 29 Februarys, so their ages in days can differ. That is why multiplying years by 365 is always a little short, and why an exact day count should come from the calendar rather than a multiplication.",
      ],
    },
    {
      heading: "When does someone born on 29 February have a birthday?",
      paragraphs: [
        "In leap years, on 29 February. In other years, there is no single worldwide answer. Many people celebrate on 28 February, others on 1 March. For legal purposes, such as when someone reaches the age to vote, drive or sign a contract, some jurisdictions treat the birthday as 28 February and others as 1 March, and some leave it unspecified.",
        "If the exact date matters for a legal or official reason, check the rules for the country or state involved, or ask the organization that sets the age requirement.",
      ],
    },
    {
      heading: "Other ways age is counted",
      list: [
        "Age in completed years is the standard for official documents in most countries.",
        "Some East Asian traditions historically counted a newborn as one year old and added a year at the new year. South Korea moved official documents to the international method in 2023.",
        "Insurance and pensions sometimes use age at nearest birthday, which rounds up once you are more than six months past your last birthday.",
        "Pediatric records use weeks and months for infants because development changes quickly.",
      ],
    },
    {
      heading: "Common mistakes",
      list: [
        "Subtracting birth year from current year without checking whether the birthday has passed.",
        "Assuming every month has 30 days when borrowing.",
        "Forgetting to reduce the end month by one after borrowing days.",
        "Estimating days lived as years × 365, which ignores leap days.",
        "Mixing date formats. 03/05 means 5 March in the US but 3 May in much of the world.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate my age in months?",
      answer:
        "Multiply the completed years by 12 and add the extra months. At 35 years and 6 months, that is 35 × 12 + 6 = 426 months.",
    },
    {
      question: "How do I calculate age in Excel or Google Sheets?",
      answer:
        "Use DATEDIF(birth_date, end_date, \"Y\") for completed years. \"YM\" gives the remaining months and \"MD\" the remaining days, although \"MD\" can give odd results around month ends.",
    },
    {
      question: "Does the time of birth matter?",
      answer:
        "For everyday and most legal purposes, no. Age is counted in calendar days. Time of birth and time zone only matter if you need age to the hour.",
    },
    {
      question: "Why do online age calculators sometimes disagree by a day?",
      answer:
        "They may use different month-borrowing rules, or one may be using a different time zone for today's date. The years and months should still match.",
    },
    {
      question: "How many days old am I?",
      answer:
        "Count the calendar days from your birth date to today. A day-difference calculator does this exactly, including every leap day in between.",
    },
  ],
};

export default guide;
