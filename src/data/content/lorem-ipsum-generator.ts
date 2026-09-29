import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Choose whether you want paragraphs, sentences or words, enter how many, and copy the generated lorem ipsum text. You can start with the classic \"Lorem ipsum dolor sit amet\" and wrap each paragraph in <p> tags for pasting straight into HTML.",
  intro:
    "Placeholder text lets you judge a layout, font or template before the real copy exists, without readers getting distracted by the words themselves. Lorem ipsum has served that purpose in print and on screen for decades because it looks like ordinary text but reads as nonsense to most people.",
  howToUse: [
    "Pick the unit: paragraphs, sentences or words.",
    "Enter the amount you need, for example 3 paragraphs or 50 words.",
    "Keep \"Start with Lorem ipsum dolor sit amet\" on for the familiar opening, and turn on <p> tags if the text is going into HTML.",
    "Generate and copy. Generate again for a different random arrangement.",
  ],
  howItWorks: [
    "The generator builds sentences from a vocabulary of Latin-looking words taken from the traditional lorem ipsum text, varying sentence length and grouping sentences into paragraphs of natural-looking size. The result has the rhythm of real prose, with a realistic mix of short and long words, so line lengths, word wrapping and paragraph spacing look as they will with genuine copy.",
    "With HTML output on, each paragraph is wrapped in its own <p> element. Otherwise paragraphs are separated by blank lines, which works in word processors, design tools and plain-text fields.",
  ],
  examples: [
    {
      title: "Filling a blog template",
      steps: ["Unit: paragraphs, amount: 4, <p> tags on", "Paste into the post body of a staging CMS"],
      result: "Four paragraphs of HTML that show how headings, body text and spacing work together.",
    },
    {
      title: "Testing a product card",
      steps: ["Unit: words, amount: 12 for a title-length string", "Unit: sentences, amount: 2 for a short description"],
      result: "Realistic lengths reveal whether text truncates or wraps awkwardly.",
    },
  ],
  sections: [
    {
      heading: "Where does lorem ipsum come from?",
      paragraphs: [
        "The text is derived from a passage of De finibus bonorum et malorum (On the Ends of Good and Evil), a work of philosophy written by Cicero in 45 BC. The standard version starts partway through a word: \"Lorem\" is the tail of \"dolorem\", from a line about pain and pleasure. Words have been cut, rearranged and altered, so it is not grammatical Latin and does not translate into a coherent meaning.",
        "It is often said to have been used by printers since the 1500s, but the earliest firm evidence of the familiar version is more recent. It became widespread in the 1960s through Letraset dry-transfer sheets and later through desktop publishing software, which is how it reached today's design tools.",
      ],
    },
    {
      heading: "When should you not use placeholder text?",
      paragraphs: [
        "Lorem ipsum hides problems that real content would expose: headlines that are longer in practice, translations that often run noticeably longer than the English, or a page that has nothing meaningful to say. Once a layout is settled, switch to realistic draft copy. And never leave it in anything that gets published; search engines and users will both see it.",
      ],
    },
  ],
  faqs: [
    {
      question: "What does lorem ipsum mean?",
      answer:
        "Taken as a whole, nothing. It is scrambled Latin from Cicero. The original passage roughly says that no one loves pain for its own sake, but the placeholder version has been altered too much to translate.",
    },
    {
      question: "Why use Latin rather than normal English text?",
      answer:
        "Readable text pulls attention toward the words and away from the design. Lorem ipsum has a natural distribution of letter and word lengths, but readers do not try to make sense of it.",
    },
    {
      question: "Can I use lorem ipsum in commercial projects?",
      answer:
        "Yes. The source text is more than 2,000 years old and in the public domain, and the generated text carries no restrictions.",
    },
    {
      question: "How many words are in a typical paragraph?",
      answer:
        "Generated paragraphs are usually a few sentences long, similar to web copy. If you need an exact length, switch to words mode and enter the number you want.",
    },
    {
      question: "Does every paragraph start with Lorem ipsum?",
      answer:
        "No. Only the first paragraph opens with the classic phrase when that option is on; the rest are randomly generated so the text does not look repetitive.",
    },
  ],
};

export default content;
