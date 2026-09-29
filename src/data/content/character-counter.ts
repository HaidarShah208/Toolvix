import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Type or paste your text to see the character count with and without spaces, plus live checks against common limits: 280 for an X post, 160 for a standard SMS, about 60 for a page title and about 160 for a meta description. Emoji and accented letters count as one character each, the way people see them.",
  intro:
    "Character limits are everywhere, and they are not all measured the same way. This counter shows what a reader would count as characters, what a phone network counts for SMS, and how many bytes the text takes up, so you can write to the limit that actually matters.",
  howToUse: [
    "Paste or type your text. The totals update with every keystroke.",
    "Read the headline count, then the breakdown: without spaces, letters, digits, spaces, symbols, lines and UTF-8 bytes.",
    "Check the limit bars for X, SMS, meta title, meta description and Instagram caption. Each shows how many characters you have left or how far over you are.",
    "Edit until the limits you care about turn green, then copy your text back out.",
  ],
  howItWorks: [
    "The main count uses graphemes, which are the characters a person perceives. A thumbs-up emoji, a flag, or a family emoji built from several code points all count as one. Many simple counters use JavaScript string length instead, which would count the family emoji 👨‍👩‍👧 as 8 characters rather than 1.",
    "SMS is a special case. A message written only in the GSM-7 alphabet (basic Latin letters, digits and common punctuation) fits 160 characters. A single character outside that set, such as an emoji or a curly quote, switches the whole message to UCS-2 encoding and the limit drops to 70. The counter tells you which encoding your text needs.",
    "The byte count shows how much space the text uses in UTF-8, the encoding used by most websites and databases. Plain English letters take 1 byte, accented letters like é take 2, and most emoji take 4. This matters for database fields and APIs that limit bytes rather than characters.",
  ],
  examples: [
    {
      title: "Counting \"café 👍\"",
      steps: [
        "Characters: c, a, f, é, space, 👍 = 6",
        "Without spaces: 5",
        "UTF-8 bytes: 3 (c, a, f) + 2 (é) + 1 (space) + 4 (👍) = 10",
      ],
      result: "6 characters, but 10 bytes, and the emoji forces an SMS into 70-character UCS-2 mode.",
    },
    {
      title: "A product page meta description",
      steps: [
        "Draft is 174 characters",
        "Guide limit is about 160, so trim roughly 14 characters",
      ],
      result: "Cutting a filler phrase brings it to 157 characters, so it is less likely to be truncated in search results.",
    },
  ],
  sections: [
    {
      heading: "What are the character limits on popular platforms?",
      list: [
        "X (Twitter) post: 280 characters for standard accounts. X counts every link as 23 characters, so a long URL uses less of the limit than a plain character count suggests.",
        "SMS: 160 characters in GSM-7, or 70 if the message contains emoji or other non-GSM characters. Longer messages are split into parts of 153 or 67 characters.",
        "Page title (meta title): about 50 to 60 characters shows in full on most desktop results.",
        "Meta description: about 150 to 160 characters on desktop, less on mobile.",
        "Instagram caption: 2,200 characters, though only the first line or two show before \"more\".",
      ],
    },
    {
      heading: "Why do Google title and description limits vary?",
      paragraphs: [
        "Google truncates titles and snippets by pixel width, not by character count. A title full of wide letters like W and M cuts off sooner than one with narrow letters like i and l, and Google sometimes rewrites snippets entirely. Treat 60 and 160 as practical guides and put the important words first.",
      ],
    },
  ],
  faqs: [
    {
      question: "Do spaces count as characters?",
      answer:
        "Usually, yes. X, SMS and most form fields count spaces. That is why the tool shows both totals; use the no-spaces figure only when a teacher or publisher asks for it specifically.",
    },
    {
      question: "How many characters is an emoji?",
      answer:
        "One, as far as a reader and this counter are concerned. Behind the scenes an emoji can be 2 to 11 JavaScript code units and 4 or more UTF-8 bytes, which is why some tools count them as 2 or more.",
    },
    {
      question: "Does a line break count as a character?",
      answer:
        "Yes, most platforms count a line break as one character. The line total is shown separately so you can see how many there are.",
    },
    {
      question: "Why did my SMS split into two messages at 70 characters?",
      answer:
        "Something in the text is outside the GSM-7 character set, often an emoji, a curly apostrophe or an accented letter not in that alphabet. Replacing it with a plain equivalent restores the 160-character limit.",
    },
    {
      question: "Is my text uploaded when I count it?",
      answer:
        "No. The counting runs entirely in your browser, and the text disappears when you close the page.",
    },
  ],
};

export default content;
