import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Paste or type your text and the word count appears instantly, along with characters, sentences, paragraphs and estimated reading time. At an average adult reading speed of 238 words per minute, 1,000 words takes about 4 minutes to read.",
  intro:
    "Essays, cover letters, articles and speeches often come with a word limit, and it helps to know more than the raw total. This counter also tracks sentence and paragraph counts, average word length, reading and speaking time, and the words you repeat most, so you can tighten a draft as well as measure it.",
  howToUse: [
    "Paste your text into the box or start typing. All counts update live.",
    "Read the main totals: words, characters (with and without spaces), sentences and paragraphs.",
    "Check reading time and speaking time if the text is for a blog post, presentation or video script.",
    "Look at the top keywords list to spot words you have overused, then edit in place and watch the numbers change.",
  ],
  howItWorks: [
    "Words are counted as runs of letters and numbers separated by spaces, with hyphenated terms like well-known and contractions like don't treated as single words, the way word processors count them. Sentences are counted from ending punctuation (full stops, question marks and exclamation marks), and paragraphs are blocks of text separated by blank lines.",
    "Reading time divides the word count by 238 words per minute, a widely cited average for silent reading of non-fiction by adults. Speaking time uses 140 words per minute, a comfortable pace for presentations. Both are estimates: technical material reads slower and conversational speech is often faster.",
    "The keyword list shows the most repeated words with their density, meaning the share of all words they make up. Your text stays in the browser while you work; nothing is saved or uploaded.",
  ],
  formulas: [
    {
      label: "Reading time",
      expression: "Minutes = Words ÷ 238",
    },
    {
      label: "Speaking time",
      expression: "Minutes = Words ÷ 140",
    },
    {
      label: "Keyword density",
      expression: "Density % = (Times the word appears ÷ Total words) × 100",
    },
  ],
  examples: [
    {
      title: "A 1,500-word blog post",
      steps: ["Reading: 1,500 ÷ 238 ≈ 6.3 minutes", "Speaking: 1,500 ÷ 140 ≈ 10.7 minutes"],
      result: "Roughly a 6-minute read, or an 11-minute talk if read aloud.",
    },
    {
      title: "A 5-minute wedding speech",
      steps: ["5 minutes × 140 words per minute = 700 words"],
      result: "Aim for about 650 to 750 words to leave room for pauses and laughter.",
    },
    {
      title: "Checking keyword repetition",
      steps: ["The word \"project\" appears 18 times in an 800-word report", "18 ÷ 800 × 100 = 2.25%"],
      result: "A density of 2.25% suggests it is worth swapping in a few synonyms or pronouns.",
    },
  ],
  sections: [
    {
      heading: "How long is a 1,000-word essay?",
      paragraphs: [
        "In a standard format of 12-point type with double line spacing, 1,000 words fills roughly four pages; single-spaced, it is about two. It usually runs to five to eight paragraphs. Reading it takes around 4 minutes, and reading it aloud takes about 7.",
      ],
      list: [
        "300 words ≈ 1 page double-spaced, about 1.3 minutes to read",
        "500 words ≈ 2 pages double-spaced, about 2 minutes to read",
        "1,000 words ≈ 4 pages double-spaced, about 4 minutes to read",
        "2,000 words ≈ 8 pages double-spaced, about 8.4 minutes to read",
      ],
    },
    {
      heading: "Why does my word count differ from Word or Google Docs?",
      paragraphs: [
        "Counters disagree on edge cases: whether a dash surrounded by spaces is a word, how to treat URLs and email addresses, and whether numbers such as 3.14 count. The difference is usually only a few words in a long document. If a teacher or publisher sets a strict limit, check which tool they use and leave a small margin.",
      ],
    },
  ],
  faqs: [
    {
      question: "Do numbers count as words?",
      answer:
        "Yes. A number such as 2026 or 45 is counted as one word, which matches how most word processors treat them.",
    },
    {
      question: "Are hyphenated words one word or two?",
      answer:
        "One. Terms like mother-in-law or long-term count as a single word, which matches Microsoft Word and Google Docs.",
    },
    {
      question: "How many words can you read in a minute?",
      answer:
        "Most adults read non-fiction silently at about 200 to 260 words per minute, with 238 a commonly quoted average. Skimming is faster; dense technical or legal text is slower.",
    },
    {
      question: "How many words is a 10-minute speech?",
      answer:
        "At a relaxed 140 words per minute, about 1,400 words. Fast speakers may manage 1,600 or more, but a slightly shorter script leaves room for pauses.",
    },
    {
      question: "Is my text saved or sent anywhere?",
      answer:
        "No. Counting happens in your browser, so drafts, coursework and confidential documents never leave your device.",
    },
    {
      question: "What is a good keyword density for SEO?",
      answer:
        "There is no target number that search engines reward. Write naturally for the reader; if one word is well above 2 to 3% of the text, it usually reads as repetitive to people too.",
    },
  ],
};

export default content;
