import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "Choose version 4 for fully random UUIDs or version 7 for time-ordered ones, set how many you need (up to 500), and click Generate. You can switch to uppercase, remove hyphens or wrap each UUID in braces, then copy the whole list at once.",
  intro:
    "A UUID (universally unique identifier) is a 128-bit value written as 32 hexadecimal digits, such as 3f2b8c1e-7a4d-4e2f-9b61-0c5d8e9a1f47. It lets separate systems create IDs independently without asking a central database for the next number. This generator produces both of the versions developers use most today.",
  howToUse: [
    "Select UUID version 4 (random) or version 7 (Unix timestamp plus random).",
    "Enter how many to generate, from 1 to 500.",
    "Choose formatting options: uppercase, no hyphens, or braces for systems such as the Windows registry that expect {…}.",
    "Generate, then copy the list, one UUID per line.",
  ],
  howItWorks: [
    "Version 4 UUIDs contain 122 random bits; the remaining 6 bits mark the version and variant. The random bits come from crypto.getRandomValues, the browser's cryptographically secure generator, so values are unpredictable as well as unique.",
    "Version 7, defined in RFC 9562 (published in 2024), puts a 48-bit Unix timestamp in milliseconds at the front, followed by random bits. Because the timestamp comes first, v7 UUIDs sort in roughly the order they were created. That makes them friendlier as database primary keys: new rows are appended near the end of an index instead of being scattered through it, as happens with random v4 values.",
    "UUIDs are generated in your browser and are not recorded or sent anywhere. The version digit is the first character of the third group: 4 for v4, 7 for v7.",
  ],
  formulas: [
    {
      label: "Birthday-bound collision estimate",
      expression: "P(collision) ≈ n² ÷ (2 × 2¹²²)",
      variables: [{ symbol: "n", meaning: "number of v4 UUIDs generated" }],
      note: "Valid when P is small. It assumes a correctly working random number generator; flawed or badly seeded generators are the realistic source of duplicates.",
    },
  ],
  examples: [
    {
      title: "Chance of a duplicate among one billion v4 UUIDs",
      steps: ["n = 10⁹, so n² = 10¹⁸", "2 × 2¹²² ≈ 1.06 × 10³⁷", "10¹⁸ ÷ 1.06 × 10³⁷ ≈ 9.4 × 10⁻²⁰"],
      result: "About 1 in 10 quintillion (10¹⁹): negligible for any practical system.",
    },
    {
      title: "How many v4 UUIDs for a 50% chance of any duplicate?",
      steps: ["Solve n ≈ √(2 × 2¹²² × ln 2)", "n ≈ 2.7 × 10¹⁸"],
      result: "About 2.7 quintillion UUIDs, or a billion per second for roughly 86 years.",
    },
    {
      title: "Reading a v7 UUID",
      steps: [
        "Example: 0192a4f3-6b10-7c3e-8d21-5f4e9a0b7c62",
        "The first 12 hex digits (0192a4f36b10) are the millisecond timestamp",
        "The 7 at the start of the third group marks version 7",
      ],
      result: "Later UUIDs from the same clock will sort after this one.",
    },
  ],
  sections: [
    {
      heading: "Should I use UUID v4 or v7?",
      list: [
        "Use v7 for database primary keys and anything you want to sort by creation time. It keeps B-tree indexes compact and inserts fast.",
        "Use v4 when the ID must reveal nothing, including when it was created, such as public tokens or identifiers in URLs.",
        "Either works for general unique IDs such as file names, message IDs or correlation IDs in logs.",
      ],
      paragraphs: [
        "Neither version is a secret. A UUID should not be used as a password or as the only protection for a private link, even though v4 values are hard to guess.",
      ],
    },
  ],
  faqs: [
    {
      question: "Can two UUIDs ever be the same?",
      answer:
        "It is mathematically possible but, with a proper random source, so unlikely that it can be ignored in practice. Real-world duplicates almost always come from bugs, such as copying an ID or using a weak random generator.",
    },
    {
      question: "What is the difference between a UUID and a GUID?",
      answer:
        "Nothing meaningful. GUID (globally unique identifier) is Microsoft's name for the same 128-bit format, often written in uppercase with braces.",
    },
    {
      question: "Does a v7 UUID reveal when it was created?",
      answer:
        "Yes. Anyone can read the millisecond timestamp from the first 48 bits. If creation time is sensitive, use v4.",
    },
    {
      question: "Are UUIDs case-sensitive?",
      answer:
        "No. The hex digits a–f and A–F are equivalent, and RFC 9562 recommends lowercase output. Some systems store them uppercase, so the option is provided.",
    },
    {
      question: "How many random bits does a v7 UUID have?",
      answer:
        "Up to 74, after the 48-bit timestamp and the 6 version and variant bits. Collisions within the same millisecond are still extremely unlikely at normal volumes.",
    },
    {
      question: "What happened to UUID versions 1 to 3 and 5?",
      answer:
        "They still exist. Version 1 uses a timestamp and MAC address, and versions 3 and 5 are derived by hashing a name. Version 7 is now generally recommended over v1 for time-based IDs.",
    },
  ],
};

export default content;
