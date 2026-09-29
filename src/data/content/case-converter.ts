import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Paste your text and click a case style to convert it: UPPERCASE, lowercase, Sentence case, Title Case, camelCase, snake_case, kebab-case and more. Copy the result with one click; the original stays in the box so you can try another style.",
  intro:
    "Retyping a heading because caps lock was on, or renaming a list of fields from one naming convention to another, is tedious and error-prone. This converter handles 13 styles, from everyday writing cases to the identifiers programmers use in code, URLs and config files.",
  howToUse: [
    "Paste or type your text into the input box.",
    "Choose a case: UPPER, lower, Sentence, Title, Capitalize Each Word, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, aLtErNaTiNg or iNVERSE.",
    "Check the converted text in the output area.",
    "Copy the result, or pick another style to compare.",
  ],
  howItWorks: [
    "The writing cases change letters but keep your spacing and punctuation. Sentence case lowercases everything and then capitalises the first letter of each sentence. Title Case capitalises the main words but keeps short minor words such as a, an, the, and, of, in and to lowercase unless they start the title. Capitalize Each Word is the simpler version that capitalises every word regardless.",
    "The programming cases first split the text into words, treating spaces, hyphens, underscores, dots and changes from lower to upper case as boundaries. So \"user first name\", \"user-first-name\" and \"userFirstName\" all break into the same three words, which are then joined in the new style.",
    "Conversion is done in your browser, so you can safely paste variable names from private code or unpublished copy.",
  ],
  examples: [
    {
      title: "One phrase, several developer styles",
      steps: [
        "Input: Order total amount",
        "camelCase: orderTotalAmount",
        "PascalCase: OrderTotalAmount",
        "snake_case: order_total_amount",
        "kebab-case: order-total-amount",
        "CONSTANT_CASE: ORDER_TOTAL_AMOUNT",
        "dot.case: order.total.amount",
      ],
      result: "Ready for a JavaScript variable, a class name, a database column, a URL slug, an environment variable and a config key.",
    },
    {
      title: "Title Case vs Capitalize Each Word",
      steps: [
        "Input: the lord of the rings and the return of the king",
        "Title Case: The Lord of the Rings and the Return of the King",
        "Capitalize Each Word: The Lord Of The Rings And The Return Of The King",
      ],
      result: "Title Case follows headline style; Capitalize Each Word is purely mechanical.",
    },
    {
      title: "Fixing caps lock",
      steps: ["Input: tHANK YOU FOR YOUR ORDER", "iNVERSE: Thank you for your order"],
      result: "Inverse case swaps every letter, which undoes accidental caps lock in one step.",
    },
  ],
  sections: [
    {
      heading: "Which case should I use in code?",
      list: [
        "camelCase: variables and functions in JavaScript, TypeScript and Java.",
        "PascalCase: classes, types and React components.",
        "snake_case: variables and functions in Python and Ruby, and many database column names.",
        "CONSTANT_CASE: constants and environment variables, such as API_BASE_URL.",
        "kebab-case: URL slugs, CSS class names and file names.",
        "dot.case: some configuration keys and logging namespaces.",
      ],
      paragraphs: [
        "When a codebase already has a convention, follow it. Consistency matters more than which style you pick.",
      ],
    },
    {
      heading: "What is the difference between Title Case and Sentence case?",
      paragraphs: [
        "Title Case capitalises the important words, and is common for book titles and headlines in US publications. Sentence case capitalises only the first word and proper nouns, which many style guides and UK newspapers prefer for headings because it reads more naturally. Note that Sentence case cannot know which words are names, so check proper nouns like London or iPhone after converting.",
      ],
    },
  ],
  faqs: [
    {
      question: "Does Title Case follow AP or Chicago style?",
      answer:
        "It follows the common rule shared by most styles: minor words like articles, short conjunctions and short prepositions stay lowercase unless they come first. Guides differ on details such as whether to capitalize longer prepositions like between, so review important headlines against your house style.",
    },
    {
      question: "Will converting to lowercase remove my acronyms?",
      answer:
        "Yes. Lowercase and Sentence case turn NASA into nasa, because the tool cannot tell an acronym from an ordinary shouted word. Fix acronyms by hand after converting.",
    },
    {
      question: "Does it work with accented and non-English letters?",
      answer:
        "Yes. Letters such as é, ß and Cyrillic or Greek characters are converted using the browser's Unicode case rules. Scripts without upper and lower case, like Chinese or Arabic, are left unchanged.",
    },
    {
      question: "What happens to punctuation in snake_case or kebab-case?",
      answer:
        "Punctuation and symbols are treated as word separators and dropped, so \"Hello, world!\" becomes hello_world or hello-world.",
    },
    {
      question: "What is alternating case used for?",
      answer:
        "aLtErNaTiNg case is mostly used for jokes and memes to suggest a mocking tone. It is not suitable for anything formal and can be hard for screen readers to read aloud.",
    },
  ],
};

export default content;
