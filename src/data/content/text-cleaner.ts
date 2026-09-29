import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Paste messy text, tick the clean-up options you need, such as collapsing extra spaces, removing blank or duplicate lines, stripping HTML tags or converting smart quotes, and copy the cleaned result. Options can be combined, so one pass can fix text copied from a PDF, web page or spreadsheet.",
  intro:
    "Text pasted from PDFs, emails, websites and chat apps carries hidden baggage: double spaces, hard line breaks mid-sentence, curly quotes that break code, stray HTML and invisible characters that make two identical-looking strings fail to match. This cleaner removes each of those problems selectively, so you keep everything else exactly as it was.",
  howToUse: [
    "Paste your text into the input box.",
    "Tick the operations you want: trim lines, collapse spaces, remove or collapse blank lines, remove line breaks, remove duplicate lines, strip HTML tags, convert smart quotes, remove invisible characters, convert tabs to spaces or remove emoji.",
    "Review the cleaned output, which updates as you change options.",
    "Copy the result into your document, spreadsheet, code or CMS.",
  ],
  howItWorks: [
    "Each option is a separate, predictable transformation. Trim lines removes spaces at the start and end of each line; collapse spaces turns runs of spaces into one; collapse blank lines reduces several empty lines to a single one, while remove blank lines deletes them entirely. Remove line breaks joins everything into one paragraph, which fixes text copied from PDFs where every line ends with a hard break.",
    "Strip HTML removes tags such as <p> and <span> and decodes entities, so &amp; becomes & and &nbsp; becomes an ordinary space. Smart-quote conversion replaces curly quotes and apostrophes with straight ones, which code, CSV files and many forms expect.",
    "Invisible-character removal targets zero-width spaces, zero-width joiners, byte order marks and similar characters. They are common in text copied from websites and messaging apps, and they cause baffling problems: a search that finds nothing, a spreadsheet lookup that fails, or a password that is rejected. The cleaning happens in your browser; the text is not uploaded.",
  ],
  examples: [
    {
      title: "Fixing text copied from a PDF",
      steps: [
        "Input: lines broken every 70 characters, with double spaces after full stops",
        "Options: remove line breaks, collapse spaces",
        "Output: one continuous paragraph with single spaces",
      ],
      result: "Ready to paste into a document without manual rejoining.",
    },
    {
      title: "Deduplicating an email list",
      steps: [
        "Input: 1,240 lines exported from two sign-up sheets",
        "Options: trim lines, remove blank lines, remove duplicate lines",
        "Output: 1,105 unique lines",
      ],
      result: "135 exact duplicates removed. Duplicates are matched exactly, which is why trimming is worth ticking too: it catches lines that differ only by trailing spaces.",
    },
    {
      title: "Cleaning HTML from a CMS export",
      steps: [
        "Input: <p>Fish &amp; chips – <strong>£9.50</strong></p>",
        "Option: strip HTML tags",
        "Output: Fish & chips – £9.50",
      ],
      result: "Plain text with the entity decoded and the tags gone.",
    },
  ],
  sections: [
    {
      heading: "What are zero-width characters and why remove them?",
      paragraphs: [
        "Zero-width characters take up no visible space, so you cannot see them, but software treats them as real characters. The zero-width space (U+200B) is sometimes inserted by websites to allow line breaks in long words; the byte order mark (U+FEFF) appears at the start of some files; zero-width joiners are used inside emoji. When one sneaks into a product code, email address or spreadsheet cell, exact matches fail even though the text looks identical.",
        "Removing them is safe for ordinary text. Be aware that zero-width joiners also hold some multi-part emoji together, so removing invisible characters can split those emoji into their component symbols.",
      ],
    },
    {
      heading: "Why convert smart quotes to straight quotes?",
      paragraphs: [
        "Word processors automatically turn \" and ' into curly “ ” and ‘ ’. They look better in prose but cause errors in code, JSON, shell commands and CSV files, which expect the plain ASCII characters. Converting them is the quickest fix when a snippet copied from a document or chat refuses to run.",
      ],
    },
  ],
  faqs: [
    {
      question: "Does the cleaner change my words?",
      answer:
        "No. Apart from converting smart quotes, decoding HTML entities and removing emoji when you ask for those, letters and punctuation are left alone. The other options only affect whitespace, line breaks and invisible characters.",
    },
    {
      question: "Is removing duplicate lines case-sensitive?",
      answer:
        "Yes, lines must match exactly, so Apple and apple are both kept. Convert the text to lowercase with the case converter first if you want case-insensitive deduplication.",
    },
    {
      question: "Does remove duplicate lines keep the original order?",
      answer: "Yes. The first occurrence of each line stays in its original position and later copies are dropped.",
    },
    {
      question: "How many spaces does a tab become?",
      answer:
        "Each tab is replaced with a fixed number of spaces. Note that this does not realign columns the way a text editor's tab stops would.",
    },
    {
      question: "Is my text stored?",
      answer: "No. The cleaner runs in your browser and forgets the text as soon as you close or reload the page.",
    },
  ],
};

export default content;
