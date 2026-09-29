import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Running pace is your time divided by the distance. A 10K finished in 55:00 is 55 ÷ 10 = 5.5 minutes per km, which is 5:30 per km or about 10.91 km/h.",
  intro:
    "Whether you're targeting a first 5K or a marathon time, pace is the number that connects distance and time. Give this calculator any two of distance, time and pace, in kilometers or miles, and it works out the third, along with your speed and even-pace finish times for other race distances.",
  howToUse: [
    "Choose what to calculate: pace, finish time or distance.",
    "Pick kilometers or miles, then enter a distance or tap a preset: 5K, 10K, half marathon (21.0975 km) or marathon (42.195 km).",
    "Enter the time as hours, minutes and seconds, or the pace as minutes and seconds per km or mile.",
    "Read the result, your speed, and the projected times for other distances if you held the same pace.",
  ],
  howItWorks: [
    "Everything is converted to seconds and a single distance unit before calculating. Pace is time ÷ distance, finish time is pace × distance, and distance is time ÷ pace. Speed is the inverse of pace: 60 divided by minutes per km gives km/h.",
    "Pace is shown as minutes:seconds, not a decimal. A pace of 5.5 minutes per km is 5:30, because half a minute is 30 seconds.",
    "Projections assume you run every kilometer or mile at exactly the same pace. They are useful for pacing plans, but most runners slow down over longer distances, so a 10K pace won't translate directly into a realistic marathon time.",
  ],
  formulas: [
    { label: "Pace", expression: "Pace = time ÷ distance" },
    { label: "Finish time", expression: "Time = pace × distance" },
    { label: "Distance", expression: "Distance = time ÷ pace" },
    {
      label: "Speed from pace",
      expression: "Speed (km/h) = 60 ÷ pace (min/km)",
      note: "1 mile = 1.609344 km.",
    },
  ],
  examples: [
    {
      title: "Pace for a 55:00 10K",
      steps: ["55 min ÷ 10 km = 5.5 min/km", "0.5 min = 30 s, so 5:30 per km", "Speed: 60 ÷ 5.5 ≈ 10.91 km/h"],
      result: "5:30 per km, about 10.91 km/h.",
    },
    {
      title: "Marathon time at 5:00 per km",
      steps: ["42.195 × 5 = 210.975 min", "210 min = 3 h 30 min; 0.975 min ≈ 58.5 s"],
      result: "About 3:30:59 at an even pace.",
    },
    {
      title: "Half marathon at 9:00 per mile",
      steps: ["21.0975 km ÷ 1.609344 ≈ 13.11 miles", "13.1094 × 9 ≈ 117.98 min"],
      result: "About 1:57:59.",
    },
    {
      title: "How far is a 45-minute run at 6:00 per km?",
      steps: ["45 ÷ 6 = 7.5"],
      result: "7.5 km.",
    },
  ],
  sections: [
    {
      heading: "What pace do I need for a sub-2-hour half marathon?",
      paragraphs: [
        "Divide 120 minutes by 21.0975 km: about 5.69 minutes, or 5:41 per km (roughly 9:09 per mile). Many runners aim a few seconds faster than the exact figure to allow for crowded starts, water stations and courses that measure slightly long on a GPS watch.",
      ],
    },
    {
      heading: "How do I convert pace per km to pace per mile?",
      paragraphs: [
        "Multiply the pace per km by 1.609344. A 5:00/km pace is 5 × 1.609344 ≈ 8.05 minutes, or about 8:03 per mile. Going the other way, divide pace per mile by 1.609344. Switching the unit in the calculator does this conversion for you.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is a good running pace?",
      answer:
        "It depends on age, experience and distance. A comfortable conversational pace is a sensible target for most easy runs, while race pace is faster. Compare yourself with your own past runs rather than a single benchmark.",
    },
    {
      question: "What is the difference between pace and speed?",
      answer:
        "Pace is time per distance, such as 6:00 per km. Speed is distance per time, such as 10 km/h. They describe the same effort; runners tend to use pace and cyclists speed.",
    },
    {
      question: "How long is a half marathon and a marathon?",
      answer:
        "A half marathon is 21.0975 km (about 13.1 miles) and a marathon is 42.195 km (about 26.2 miles). The presets use these exact distances.",
    },
    {
      question: "Can I use this for walking or cycling?",
      answer:
        "Yes. The math is the same for any activity. Cyclists will usually find the speed figure more useful than pace.",
    },
    {
      question: "Why does my watch show a different pace?",
      answer:
        "GPS can drift, especially among tall buildings or trees, and course distances measured on a watch are often slightly longer than the official distance. The calculator uses exactly the distance you enter.",
    },
  ],
};

export default content;
