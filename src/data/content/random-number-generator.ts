import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Enter a minimum and maximum, choose how many numbers you want (up to 1,000), and generate. Turn on No duplicates to draw unique numbers, as in a raffle, and Sort to list them in order. Every value in the range has an equal chance of being picked.",
  intro:
    "Picking a raffle winner, assigning random groups, rolling dice for a tabletop game or sampling rows from a spreadsheet all need numbers that are genuinely fair. This generator uses your browser's cryptographic random source rather than a basic pseudo-random function, and removes the subtle bias that simpler tools introduce.",
  howToUse: [
    "Set the minimum and maximum. Both ends are included, so 1 to 6 can return 1 or 6.",
    "Choose how many numbers to generate, from 1 to 1,000.",
    "Pick integers or decimals; for decimals, set 1 to 10 decimal places.",
    "Tick No duplicates if each number may appear only once, and Sort to order the results. Generate, then copy the list.",
  ],
  howItWorks: [
    "Random values come from crypto.getRandomValues, which draws on the operating system's secure random number generator. The same source is used to create encryption keys, so its output cannot practically be predicted from previous results.",
    "Turning raw random bits into a number in your range needs care. The common shortcut of taking the remainder after division (modulo) makes some numbers slightly more likely whenever the range does not divide evenly into the generator's output. This tool uses rejection sampling instead: any raw value that would cause that imbalance is discarded and a fresh one drawn, so every number in the range is exactly equally likely.",
    "With No duplicates on, the draw works like pulling numbers from a hat without putting them back. The range must therefore contain at least as many possible values as you ask for; 10 unique numbers cannot come from 1 to 5, and the tool will tell you so.",
  ],
  formulas: [
    {
      label: "Probability of a specific integer",
      expression: "P = 1 ÷ (Max − Min + 1)",
    },
    {
      label: "Chance of at least one repeat when duplicates are allowed",
      expression: "P(repeat) = 1 − (N × (N − 1) × … × (N − k + 1)) ÷ Nᵏ",
      variables: [
        { symbol: "N", meaning: "number of possible values in the range" },
        { symbol: "k", meaning: "how many numbers you draw" },
      ],
    },
  ],
  examples: [
    {
      title: "Draw 3 raffle winners from 250 tickets",
      steps: ["Min 1, max 250, count 3, No duplicates on", "Each ticket has a 3 ÷ 250 = 1.2% chance of being among the winners"],
      result: "Three different ticket numbers, for example 17, 142 and 203.",
    },
    {
      title: "Roll two six-sided dice",
      steps: ["Min 1, max 6, count 2, duplicates allowed", "Each die: P = 1 ÷ 6 ≈ 16.7% for any face"],
      result: "Two independent rolls; doubles happen about 1 time in 6.",
    },
    {
      title: "Why repeats show up sooner than expected",
      steps: [
        "Draw 10 numbers from 1 to 100 with duplicates allowed",
        "P(no repeat) = (100 × 99 × … × 91) ÷ 100¹⁰ ≈ 0.628",
        "P(at least one repeat) ≈ 1 − 0.628 = 0.372",
      ],
      result: "About a 37% chance of a repeat, which is why the No duplicates option exists.",
    },
  ],
  sections: [
    {
      heading: "Is this random number generator truly random?",
      paragraphs: [
        "It uses a cryptographically secure pseudo-random number generator, seeded by your operating system from unpredictable hardware events. That is not the same as a physical process like radioactive decay, but for any practical purpose the output is unpredictable and evenly distributed. It is far stronger than Math.random, which is fine for animations but not designed for fairness or security.",
        "It is suitable for games, classroom activities, raffles among friends, giveaways and random sampling. It is not a certified random number generator, so it should not be used for regulated gambling or official lotteries, which require audited hardware and procedures.",
      ],
    },
    {
      heading: "How do I run a fair giveaway draw?",
      list: [
        "Number your entries in a fixed list, such as a spreadsheet, before generating anything.",
        "Announce the range and the number of winners in advance.",
        "Generate once with No duplicates on, and record or screenshot the result with a timestamp.",
        "Match each winning number to the entry in that position of your list.",
      ],
    },
  ],
  faqs: [
    {
      question: "Are the minimum and maximum included?",
      answer: "Yes. Both ends of the range can be drawn, for integers and decimals alike.",
    },
    {
      question: "Can I generate negative numbers?",
      answer: "Yes. Set a negative minimum, for example −50 to 50.",
    },
    {
      question: "How do decimal results work?",
      answer:
        "Values are spread evenly across the range and given to the number of decimal places you choose, from 1 to 10. For example, 0 to 1 with two places returns results such as 0.37 or 0.82.",
    },
    {
      question: "Can the same result come up twice in a row?",
      answer:
        "Yes, if duplicates are allowed. Each draw is independent, so a streak does not make a number more or less likely next time.",
    },
    {
      question: "Are my results stored or sent anywhere?",
      answer:
        "No. Numbers are generated in your browser and disappear when you leave the page, so keep a copy if you need a record of a draw.",
    },
  ],
};

export default content;
