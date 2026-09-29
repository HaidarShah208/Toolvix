import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Enter a date and time, choose the time zone it belongs to, and add the zones you want to compare; the converter shows the matching local time in each, with its UTC offset and whether the date changes. Daylight saving time is applied automatically for the date you pick.",
  intro:
    "Scheduling a call across continents is harder than adding or subtracting a fixed number of hours, because offsets change with daylight saving and countries switch on different dates. This converter uses the same IANA time zone database as your operating system, so the answer reflects the rules for that exact day.",
  howToUse: [
    "Pick the date and time of the meeting, flight or event.",
    "Choose the source time zone: the place where that time applies, such as America/New_York.",
    "Add one or more target zones. Each row shows the local date and time, its UTC offset, and a note if it falls on the previous or next day.",
    "If the tool warns that a time does not exist or happens twice, adjust it as described below, then copy or share the result.",
  ],
  howItWorks: [
    "Time zones are identified by IANA names such as Europe/London or Asia/Kolkata. Each name carries the full history of that region's offsets and daylight saving rules. The conversion is done by your browser's built-in Intl API, which ships with this database, so there is no server involved and the result follows the rules for the date you entered, not today's.",
    "Daylight saving creates two awkward moments each year. When clocks spring forward, an hour is skipped: in New York on 8 March 2026, local time jumps from 01:59 to 03:00, so 02:30 never happens. When clocks fall back, an hour repeats: on 1 November 2026, 01:30 occurs twice, once at UTC−4 and again at UTC−5. The converter flags both cases rather than silently guessing.",
    "Because the US, Europe and the Southern Hemisphere change their clocks on different dates, the gap between two cities can shift for a week or two each spring and autumn. Checking the specific date avoids missed meetings during those weeks.",
  ],
  examples: [
    {
      title: "A 10:00 New York meeting on 20 November 2026",
      steps: [
        "New York is on Eastern Standard Time, UTC−05:00, so 10:00 = 15:00 UTC",
        "London (UTC+00:00): 15:00",
        "India (UTC+05:30): 20:30",
        "Sydney (UTC+11:00, daylight saving): 02:00 on 21 November",
      ],
      result: "Fine for London and India, but 2 a.m. the next day in Sydney.",
    },
    {
      title: "The late-October gap",
      steps: [
        "On 28 October 2026, London has already left summer time (UTC+00:00)",
        "New York stays on daylight time (UTC−04:00) until 1 November",
        "09:00 in New York = 13:00 UTC = 13:00 in London",
      ],
      result: "The usual 5-hour difference is only 4 hours that week.",
    },
    {
      title: "Nepal's unusual offset",
      steps: ["15:00 UTC in Asia/Kathmandu (UTC+05:45)", "15:00 + 5 h 45 min = 20:45"],
      result: "20:45, fifteen minutes ahead of India. Not every offset is a whole hour.",
    },
  ],
  sections: [
    {
      heading: "What is the difference between UTC and GMT?",
      paragraphs: [
        "UTC (Coordinated Universal Time) is the global time standard, kept by atomic clocks, that all time zones are defined against. GMT (Greenwich Mean Time) is historically the mean solar time at Greenwich and today is the name of the time zone used by the UK in winter. For scheduling they are the same clock time, but UTC never changes for daylight saving, while the UK switches from GMT to BST (UTC+01:00) in summer.",
      ],
    },
    {
      heading: "Why use America/New_York instead of EST?",
      paragraphs: [
        "Abbreviations are ambiguous and often wrong for the season. EST strictly means UTC−05:00, but people write it in July when New York is actually on EDT, UTC−04:00. Some abbreviations are shared by unrelated places: CST can mean US Central Standard Time, China Standard Time or Cuba Standard Time, and IST can mean India, Ireland or Israel.",
        "An IANA name like America/New_York refers to a place, and the database knows what offset that place uses on any given date. That is why the converter asks for a city-based zone rather than an abbreviation.",
      ],
      list: [
        "India: Asia/Kolkata, UTC+05:30 all year (no daylight saving)",
        "UK: Europe/London, UTC+00:00 in winter, UTC+01:00 in summer",
        "US Eastern: America/New_York, UTC−05:00 in winter, UTC−04:00 in summer",
        "US Pacific: America/Los_Angeles, UTC−08:00 in winter, UTC−07:00 in summer",
        "Japan: Asia/Tokyo, UTC+09:00 all year",
      ],
    },
  ],
  faqs: [
    {
      question: "Does the converter handle daylight saving time?",
      answer:
        "Yes. Offsets are looked up for the exact date and time you enter, so a meeting in July and one in January can give different answers for the same pair of cities.",
    },
    {
      question: "What should I do if the tool says a time does not exist?",
      answer:
        "You picked a time inside the hour skipped when clocks spring forward. Choose a time an hour later, or schedule in a zone without the change, such as UTC.",
    },
    {
      question: "What does an ambiguous time mean?",
      answer:
        "When clocks go back, the same local hour happens twice. The converter shows which offset it has assumed; if it matters, confirm with the other person using the UTC time instead.",
    },
    {
      question: "Why is India UTC+05:30?",
      answer:
        "India uses a single national time zone set at 82.5° E, which is 5.5 hours ahead of Greenwich. Several other places use half-hour or 45-minute offsets, including Iran, Newfoundland, parts of Australia and Nepal.",
    },
    {
      question: "How up to date is the time zone data?",
      answer:
        "It comes from your browser and operating system, which update the IANA database with regular releases. Keeping your browser up to date ensures recent rule changes are reflected.",
    },
    {
      question: "Does the tool use my location?",
      answer:
        "No. At most it reads your device's time zone setting inside the browser to offer a sensible default. It never asks for your location, and the times you enter are not sent anywhere.",
    },
  ],
};

export default content;
