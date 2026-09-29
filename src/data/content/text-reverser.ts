import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Paste your text and choose how to reverse it: every character (so \"hello\" becomes \"olleh\"), the order of the words, the letters inside each word, or the order of the lines. The result updates instantly and can be copied with one click.",
  intro:
    "Reversing text sounds trivial until emoji, accents and line breaks get involved. This tool offers four different kinds of reversal and handles multi-part characters properly, so a flag or a family emoji stays intact instead of breaking into strange symbols.",
  howToUse: [
    "Type or paste text into the input.",
    "Choose a mode: reverse characters, reverse word order, reverse each word, or reverse line order.",
    "Check the output, then copy it.",
  ],
  howItWorks: [
    "Reversing characters works on graphemes, the units a reader sees as single characters. Many visible characters are made of several code points: é can be an e plus a combining accent, and 👍🏽 is a thumbs-up plus a skin-tone modifier. A naive reversal splits those apart and produces broken output. Splitting by grapheme first keeps them whole.",
    "Word-order reversal keeps each word as it is and reverses their sequence; reversing each word keeps the sequence but flips the letters within every word. Line-order reversal leaves every line untouched and flips them top to bottom, which is useful for lists, logs and CSV rows that are in the wrong order.",
    "The text is processed in the page itself, so nothing you paste is sent anywhere.",
  ],
  examples: [
    {
      title: "Reverse characters",
      steps: ["Input: Hello, world 👋", "Output: 👋 dlrow ,olleH"],
      result: "The emoji stays intact at the start of the reversed text.",
    },
    {
      title: "Reverse word order",
      steps: ["Input: one two three four", "Output: four three two one"],
      result: "Each word is unchanged; only the order flips.",
    },
    {
      title: "Reverse each word",
      steps: ["Input: stressed desserts", "Output: desserts stressed"],
      result: "A handy way to find semordnilaps, words that spell another word backwards.",
    },
    {
      title: "Reverse line order",
      steps: ["Input lines: 2024, 2025, 2026", "Output lines: 2026, 2025, 2024"],
      result: "A log or list flipped from oldest-first to newest-first.",
    },
  ],
  sections: [
    {
      heading: "How do I check whether a word is a palindrome?",
      paragraphs: [
        "Reverse its characters and compare with the original. \"level\", \"racecar\" and \"rotor\" read the same both ways. For phrases, ignore spaces, punctuation and capitals first: \"A man, a plan, a canal: Panama\" becomes \"amanaplanacanalpanama\", which is identical reversed. The text cleaner and case converter can help strip and normalize the phrase before you reverse it.",
      ],
    },
    {
      heading: "What is reversed text used for?",
      list: [
        "Word games, puzzles and palindrome hunting.",
        "Simple visual effects in social posts or usernames.",
        "Flipping the order of lists, logs and exported rows.",
        "Testing how software handles unusual input, such as right-to-left looking strings.",
      ],
      paragraphs: [
        "Reversed text is not encryption. Anyone can reverse it back in seconds, so never use it to hide passwords or private information.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why do emoji break in other text reversers?",
      answer:
        "Many emoji are several code points joined together. Tools that reverse raw code units swap those pieces around, producing question marks or separate symbols. Grapheme-aware reversal keeps each emoji as one unit.",
    },
    {
      question: "Does reversing work with Arabic or Hebrew?",
      answer:
        "The characters are reversed in memory order, but because those scripts are displayed right to left, the visual result may not be what you expect. Mixed-direction text is especially unpredictable.",
    },
    {
      question: "Does punctuation move when I reverse word order?",
      answer:
        "Punctuation stays attached to the word it touches, so \"Hello, world!\" becomes \"world! Hello,\". Tidy it by hand if you need a grammatical result.",
    },
    {
      question: "Is there a limit on text length?",
      answer:
        "No fixed limit. Very long documents may take a moment, since the work is done in your browser.",
    },
  ],
};

export default content;
