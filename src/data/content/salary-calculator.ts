import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "To turn an hourly wage into a yearly salary, multiply it by the hours you work in a year. A full-time schedule of 8 hours a day, 5 days a week for 52 weeks is 2,080 hours, so 25 an hour is 25 × 2,080 = 52,000 a year before tax.",
  intro:
    "Job offers, contracts and payslips quote pay in different units, which makes them hard to compare. Enter any one amount and this calculator converts it to hourly, daily, weekly, bi-weekly, semi-monthly, monthly, quarterly and annual figures based on the schedule you actually work.",
  howToUse: [
    "Enter the pay amount and choose what period it covers, for example hourly or annual.",
    "Adjust hours per day, days per week and weeks per year if your schedule differs from the default of 8, 5 and 52.",
    "Read the equivalent pay for every other period in the results.",
    "Copy the figures to compare offers or build a budget.",
  ],
  howItWorks: [
    "Everything is converted through an annual figure. Hours per year equal hours per day × days per week × weeks per year; the default 8 × 5 × 52 gives 2,080. Annual pay is then divided back into each period: 12 months, 4 quarters, 24 semi-monthly periods, 26 bi-weekly periods and the number of weeks, days and hours you set.",
    "Bi-weekly and semi-monthly look similar but aren't the same. Bi-weekly means every two weeks, which is 26 paychecks a year; semi-monthly means twice a month, which is 24. The semi-monthly paycheck is therefore a little larger.",
    "All figures are gross pay, before income tax, social security, pension contributions or other deductions. Overtime, bonuses and unpaid leave aren't modeled, so lower the weeks per year if you take unpaid time off.",
  ],
  formulas: [
    {
      label: "Annual pay from an hourly rate",
      expression: "Annual = hourly rate × hours/day × days/week × weeks/year",
    },
    {
      label: "Converting annual pay to another period",
      expression: "Pay per period = annual ÷ periods per year",
      note: "Monthly 12, semi-monthly 24, bi-weekly 26, quarterly 4, weekly = weeks per year.",
    },
  ],
  examples: [
    {
      title: "25 an hour on a standard full-time schedule",
      steps: [
        "Hours per year: 8 × 5 × 52 = 2,080",
        "Annual: 25 × 2,080 = 52,000",
        "Monthly: 52,000 ÷ 12 = 4,333.33; semi-monthly: 52,000 ÷ 24 = 2,166.67",
        "Bi-weekly: 52,000 ÷ 26 = 2,000; weekly: 1,000; daily: 200",
      ],
      result: "25 an hour ≈ 52,000 a year or 4,333.33 a month, gross.",
    },
    {
      title: "65,000 salary on a 7.5-hour day",
      steps: ["Hours per year: 7.5 × 5 × 52 = 1,950", "Hourly: 65,000 ÷ 1,950 = 33.33", "Monthly: 65,000 ÷ 12 = 5,416.67"],
      result: "About 33.33 an hour.",
    },
    {
      title: "Part-time: 18 an hour, 6 hours a day, 5 days a week, 48 weeks",
      steps: ["Hours per year: 6 × 5 × 48 = 1,440", "Annual: 18 × 1,440 = 25,920", "Monthly: 25,920 ÷ 12 = 2,160"],
      result: "25,920 a year, or 2,160 a month on average.",
    },
  ],
  sections: [
    {
      heading: "Why doesn't monthly pay equal four weeks of pay?",
      paragraphs: [
        "A year has 52 weeks, not 48, so an average month is 52 ÷ 12 ≈ 4.33 weeks long. Multiplying weekly pay by 4 understates monthly income by about 8%. At 1,000 a week, the monthly average is 4,333.33, not 4,000.",
      ],
    },
    {
      heading: "Should I use 52 weeks if I get paid holidays?",
      paragraphs: [
        "Yes. If you are paid for holidays and vacation, those weeks still count, so keep 52. Contractors and hourly workers who aren't paid for time off should reduce the weeks to reflect the time they actually bill, for example 48 weeks if they take four weeks off.",
      ],
    },
  ],
  faqs: [
    {
      question: "How much is 20 an hour per year?",
      answer:
        "At 2,080 hours a year, 20 an hour is 41,600 before tax. Change the hours or weeks to match your own schedule.",
    },
    {
      question: "Does this calculator show take-home pay?",
      answer:
        "No. It converts gross pay only. Taxes and deductions vary by country, state and personal circumstances, so check a payroll or tax calculator for net pay.",
    },
    {
      question: "What is the difference between bi-weekly and semi-monthly?",
      answer:
        "Bi-weekly is every other week, 26 times a year. Semi-monthly is twice a month, 24 times a year, usually on fixed dates such as the 15th and last day.",
    },
    {
      question: "How many working hours are in a year?",
      answer:
        "The common full-time figure is 2,080 (40 hours × 52 weeks). A 37.5-hour week gives 1,950 hours, and a 35-hour week gives 1,820.",
    },
    {
      question: "How do I compare a salaried job with an hourly one?",
      answer:
        "Convert both to the same period using realistic hours. A salary that requires 50-hour weeks pays less per hour than the same salary at 40 hours.",
    },
  ],
};

export default content;
