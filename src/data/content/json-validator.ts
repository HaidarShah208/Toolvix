import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Paste your JSON and the validator tells you immediately whether it is valid. If it is not, you get the line and column of the problem and a plain-English explanation, such as a trailing comma, a single-quoted string or an unquoted key.",
  intro:
    "A single stray comma can break an API request, a deployment config or an import job, and the default error from most parsers is a cryptic \"Unexpected token at position 3,184\". This validator translates that into something you can act on, and for valid JSON it summarises what the document actually contains.",
  howToUse: [
    "Paste or type JSON into the editor. Validation runs as you type.",
    "If there is an error, read the line and column and the explanation, then jump to that spot and fix it.",
    "Once the status shows valid, review the structure summary: counts of objects, arrays, strings, numbers, booleans and nulls, the maximum nesting depth and the size in bytes.",
  ],
  howItWorks: [
    "The text is checked against the JSON standard (RFC 8259) using the browser's strict parser. JSON is deliberately small: objects, arrays, double-quoted strings, numbers, true, false and null, and nothing else. Anything that JavaScript tolerates but JSON does not is reported as an error.",
    "When parsing fails, the character position of the failure is converted into a line and column number, and the surrounding characters are inspected to explain the most likely cause in plain language. The reported position is where the parser noticed the problem, which is sometimes just after the real mistake, so look at the preceding line too.",
    "For valid input, the validator walks the whole tree to count each value type and measure the deepest level of nesting. All of this runs in your browser; nothing is uploaded.",
  ],
  examples: [
    {
      title: "Trailing comma",
      steps: ["Input: {\"a\": 1, \"b\": 2,}", "Error at line 1, column 17: a property name was expected after the comma"],
      result: "Delete the comma after 2. JSON does not allow a comma before a closing } or ].",
    },
    {
      title: "Single quotes copied from JavaScript",
      steps: ["Input: {'name': 'Ada'}", "Error at line 1, column 2: strings and keys must use double quotes"],
      result: "Change to {\"name\": \"Ada\"}.",
    },
    {
      title: "Structure summary for a valid file",
      steps: [
        "Input: {\"users\": [{\"id\": 1, \"active\": true}, {\"id\": 2, \"active\": false}]}",
        "Objects: 3 · Arrays: 1 · Numbers: 2 · Booleans: 2",
        "Maximum depth: 3 (root object → users array → user object)",
      ],
      result: "Valid JSON, with a quick check that the shape matches what you expected.",
    },
  ],
  sections: [
    {
      heading: "What are the most common JSON errors?",
      list: [
        "Trailing commas after the last item in an object or array.",
        "Single quotes around strings or keys. JSON requires double quotes.",
        "Unquoted keys, as in {name: \"Ada\"}. Every key must be a double-quoted string.",
        "Comments (// or /* */). JSON has no comment syntax at all.",
        "Missing commas between items, often after copying lines around.",
        "Values JSON does not support: undefined, NaN, Infinity, functions, or dates written without quotes.",
        "Unescaped characters inside strings, such as a raw line break or a lone backslash in a Windows path. Use \\n and \\\\ instead.",
      ],
    },
    {
      heading: "Is valid JSON the same as correct data?",
      paragraphs: [
        "No. Validation checks syntax only. A document can be perfectly valid JSON and still have a missing required field, a number where a string was expected, or a misspelled key. Checking those rules needs a JSON Schema validator or your application's own tests. The structure summary here helps you spot obvious shape problems, like an array that should hold objects but contains strings.",
      ],
    },
  ],
  faqs: [
    {
      question: "Why does my JSON work in JavaScript but fail here?",
      answer:
        "JavaScript object literals are more permissive: they accept single quotes, unquoted keys, trailing commas and comments. JSON is a stricter data format, and APIs and config parsers expect the strict form.",
    },
    {
      question: "Can JSON have comments?",
      answer:
        "No. The standard has no comment syntax. Some tools accept JSON with comments (often called JSONC), but a strict parser will reject it. A common workaround is a key such as \"_comment\" with a string value.",
    },
    {
      question: "Is a single value like 42 or \"hello\" valid JSON?",
      answer:
        "Yes. Under RFC 8259 any JSON value can be the top level, including a number, string, true, false or null. Some older parsers expected an object or array, so check what your target system accepts.",
    },
    {
      question: "Are duplicate keys allowed?",
      answer:
        "The standard says keys should be unique but does not forbid duplicates, so they pass validation. Most parsers keep only the last value, which can hide bugs, so avoid them.",
    },
    {
      question: "Does the validator send my JSON anywhere?",
      answer:
        "No. Parsing and analysis happen in your browser tab, so it is safe for internal configs and data that should not leave your machine.",
    },
  ],
};

export default content;
