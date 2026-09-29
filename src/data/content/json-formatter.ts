import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Paste your JSON and choose Format to pretty-print it with 2 spaces, 4 spaces or tabs, or Minify to strip all whitespace. If the JSON is broken, the formatter shows the line and column of the first error so you can fix it quickly.",
  intro:
    "API responses, log entries and config files often arrive as a single unreadable line. Formatting them reveals the structure at a glance; minifying does the reverse when you need a compact payload. You can also sort keys alphabetically, which makes two JSON documents far easier to compare.",
  howToUse: [
    "Paste JSON into the input, or load the sample to see how it works.",
    "Choose an indent style (2 spaces, 4 spaces or tab) and click Format, or click Minify for the most compact output.",
    "Tick Sort keys to order every object's keys alphabetically, at every level of nesting.",
    "Copy the output or download it as a .json file. If there is an error, the message points to the line and column to check.",
  ],
  howItWorks: [
    "The input is parsed with the browser's standard JSON parser, the same strict parser JavaScript applications use, and then serialized again with the indentation you chose. Because the text is fully parsed first, formatting also acts as a validity check: nothing is output from invalid JSON.",
    "Minifying serialises with no whitespace between tokens. Whitespace inside strings is part of the data and is left untouched. Sorting keys rebuilds each object with its keys in alphabetical order; arrays keep their original order, since the order of array elements is meaningful.",
    "The JSON is processed locally. API keys, tokens or customer records in a payload are not sent to any server, which is worth checking before pasting production data into any online tool.",
  ],
  examples: [
    {
      title: "Formatting a compact API response",
      steps: [
        "Input: {\"id\":42,\"name\":\"Ada\",\"roles\":[\"admin\",\"editor\"],\"active\":true}",
        "Format with 2 spaces",
        "Each key moves to its own line; the roles array is expanded with one item per line",
      ],
      result: "A readable, indented document with exactly the same data.",
    },
    {
      title: "Comparing two configs with Sort keys",
      steps: [
        "File A lists keys as port, host, debug; file B as debug, host, port",
        "Format both with Sort keys on",
        "Both now read debug, host, port",
      ],
      result: "A text diff shows only real value differences, not ordering noise.",
    },
    {
      title: "Finding a syntax error",
      steps: [
        "Input contains a trailing comma: {\"a\": 1, \"b\": 2,}",
        "Format reports an error at line 1, column 17, where the closing brace appears after a comma",
      ],
      result: "Remove the comma after 2 and the document formats normally.",
    },
  ],
  sections: [
    {
      heading: "Should I use 2 spaces, 4 spaces or tabs?",
      paragraphs: [
        "It is a style choice with no effect on the data. Two spaces is the most common in JavaScript projects and in package.json files; four spaces is typical in Python-oriented tools; tabs let each reader set their own width. Match whatever the project or team already uses.",
      ],
    },
    {
      heading: "When should JSON be minified?",
      paragraphs: [
        "Minify when size or bandwidth matters: embedding JSON in a URL or HTML attribute, storing it in a database column, or sending it over the network. Web servers usually gzip responses anyway, which removes most of the benefit for API traffic. Keep formatted JSON for anything a person will read or edit, such as config files in version control.",
      ],
    },
  ],
  faqs: [
    {
      question: "Does formatting change my data?",
      answer:
        "No. Only whitespace between tokens changes, unless you enable Sort keys, which reorders object keys. Values, types and array order stay the same.",
    },
    {
      question: "Can it format JSON with comments?",
      answer:
        "No. Comments are not part of the JSON standard, so the strict parser reports them as errors. Remove the comments first, or keep such files as JSONC or JSON5 in tools that support those formats.",
    },
    {
      question: "Why did my large numbers change after formatting?",
      answer:
        "JavaScript stores numbers as 64-bit floating point, which can represent integers exactly only up to 9,007,199,254,740,991. Larger IDs lose precision when parsed, so APIs usually send them as strings.",
    },
    {
      question: "Is there a size limit?",
      answer:
        "There is no fixed limit, but very large documents of tens of megabytes may make the page slow, since everything is processed in your browser.",
    },
    {
      question: "Is it safe to paste API responses containing tokens?",
      answer:
        "The formatter runs locally and does not send the text anywhere. Still, treat secrets carefully and rotate any key that you have shared somewhere you should not have.",
    },
  ],
};

export default content;
