import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To add times, add seconds, minutes and hours separately, then carry every 60 seconds into a minute and every 60 minutes into an hour. 1:45:30 + 2:30:45 = 3:75:75, which becomes 4:16:15.",
  intro:
    "Base-60 arithmetic trips up ordinary calculators: 1.5 hours isn't 1 hour 50 minutes. This tool has two modes. One adds or subtracts any number of hours-minutes-seconds durations, and the other finds how long it is between two clock times, including shifts that run past midnight, with an optional unpaid break taken off.",
  howToUse: [
    "For durations, enter hours, minutes and seconds in each row and choose whether that row is added or subtracted. Add as many rows as you need.",
    "For clock times, enter a start time and an end time. If the end is earlier than the start, the calculator assumes the period runs overnight.",
    "Enter an unpaid break in minutes if you want it deducted from a shift.",
    "Read the result as hours:minutes:seconds and as decimal hours, which is the format most timesheets and payroll systems need.",
  ],
  howItWorks: [
    "Every duration is converted to seconds, the seconds are added or subtracted, and the total is converted back: divide by 3,600 for hours, take the remainder and divide by 60 for minutes, and what's left is seconds.",
    "For two clock times, the start is subtracted from the end. When the end is earlier than the start, such as 22:00 to 06:30, 24 hours is added so the result covers the overnight period instead of going negative. Any break is then subtracted.",
    "Decimal hours divide the total minutes by 60. Seven hours 45 minutes is 7.75 hours, not 7.45, which matters when you multiply by an hourly rate.",
  ],
  formulas: [
    {
      label: "Total seconds",
      expression: "Seconds = hours × 3,600 + minutes × 60 + seconds",
    },
    {
      label: "Time between clock times",
      expression: "Duration = end − start (+ 24 h if end < start) − break",
    },
    { label: "Decimal hours", expression: "Decimal hours = hours + minutes ÷ 60 + seconds ÷ 3,600" },
  ],
  examples: [
    {
      title: "Add three video clips: 1:45:30, 2:30:45 and 0:50:00",
      steps: [
        "Seconds: 30 + 45 + 0 = 75 → 1 minute 15 seconds",
        "Minutes: 45 + 30 + 50 + 1 carried = 126 → 2 hours 6 minutes",
        "Hours: 1 + 2 + 0 + 2 carried = 5",
      ],
      result: "5:06:15 in total.",
    },
    {
      title: "Subtract 1:20:40 from 5:06:15",
      steps: ["Borrow so the terms line up: 5:06:15 = 4:65:75", "4:65:75 − 1:20:40 = 3:45:35"],
      result: "3:45:35 remaining.",
    },
    {
      title: "Night shift from 22:00 to 06:30 with a 30-minute break",
      steps: ["06:30 is earlier than 22:00, so add 24 hours: 30:30 − 22:00 = 8:30", "8:30 − 0:30 break = 8:00"],
      result: "8 hours worked (8.00 decimal hours).",
    },
    {
      title: "Day shift from 09:15 to 17:45 with a 45-minute lunch",
      steps: ["17:45 − 09:15 = 8:30", "8:30 − 0:45 = 7:45", "45 ÷ 60 = 0.75"],
      result: "7 hours 45 minutes, or 7.75 decimal hours.",
    },
  ],
  sections: [
    {
      heading: "How do I convert minutes to decimal hours for a timesheet?",
      paragraphs: [
        "Divide the minutes by 60. 15 minutes is 0.25, 20 minutes is about 0.33, 30 minutes is 0.5 and 45 minutes is 0.75. So a shift of 6 hours 20 minutes is about 6.33 hours; at 18 an hour that pays about 114, whereas the mistaken 6.20 hours would pay only 111.60.",
      ],
    },
  ],
  faqs: [
    {
      question: "How do I calculate hours worked overnight?",
      answer:
        "Enter the start and end times as normal. If the end time is earlier than the start, the calculator counts forward past midnight, so 23:00 to 07:00 is 8 hours.",
    },
    {
      question: "Can the result be longer than 24 hours?",
      answer:
        "Yes, when adding durations. Adding up a week of shifts might give 41:30:00, meaning 41 hours and 30 minutes, which is also 41.5 decimal hours.",
    },
    {
      question: "What happens if I subtract more time than I have?",
      answer:
        "The total goes below zero, which tells you how far short you are. For example, 1:00:00 − 1:30:00 leaves you 30 minutes short.",
    },
    {
      question: "Does the calculator handle 12-hour times with AM and PM?",
      answer:
        "Yes, as long as the times are entered correctly; in 24-hour terms 1:30 pm is 13:30 and midnight is 00:00. Double-check AM and PM on overnight shifts, where a mix-up changes the result by 12 hours.",
    },
    {
      question: "Does this account for daylight saving time changes?",
      answer:
        "No. It measures clock time only, so a night shift on the night clocks change will be an hour off. Adjust for that manually.",
    },
  ],
};

export default content;
