import type { ToolContent } from "@/types";

const content: ToolContent = {
  directAnswer:
    "For most accounts, generate a random password of at least 16 characters using upper and lower case letters, numbers and symbols, and store it in a password manager. A 16-character password drawn from all 94 printable characters has about 105 bits of entropy, far beyond what an attacker can guess.",
  intro:
    "The strongest password is one nobody chose, because people are predictable and random generators are not. This generator creates passwords in your browser using the operating system's secure random number source and shows an honest strength estimate based on how many possibilities an attacker would have to try.",
  howToUse: [
    "Set the length anywhere from 4 to 128 characters. 16 or more is a good default.",
    "Tick the character types you want: uppercase, lowercase, numbers and symbols.",
    "Optionally exclude look-alike characters such as 0/O and 1/l/I, useful if you will ever read or type the password by hand, and require at least one of each selected type if a website insists on it.",
    "Generate, check the strength rating, and copy the password straight into your password manager or sign-up form.",
  ],
  howItWorks: [
    "Each character is chosen with crypto.getRandomValues, the browser's cryptographically secure random source. The generator uses rejection sampling: random values that would make some characters slightly more likely than others are thrown away and redrawn, so every character in the pool has exactly the same chance. A naive approach using the remainder of a division (modulo) introduces a small bias that this avoids.",
    "Strength is measured as entropy, in bits. Every extra bit doubles the number of passwords an attacker must try. Entropy depends on only two things: the length and the size of the character pool. Adding length raises it faster than adding character types.",
    "Passwords are generated on your device and are never stored, logged or sent over the network. Once you close or reload the page, the password exists only where you pasted it.",
  ],
  formulas: [
    {
      label: "Password entropy",
      expression: "Entropy (bits) = Length × log₂(Pool size)",
      variables: [
        { symbol: "Length", meaning: "number of characters in the password" },
        { symbol: "Pool size", meaning: "how many different characters each position can be" },
      ],
      note: "Pool sizes: 26 for lowercase only, 52 for upper and lower, 62 with digits, 94 with all printable ASCII symbols. This formula holds only for randomly generated passwords, not ones a person picked.",
    },
  ],
  examples: [
    {
      title: "16 characters, all four character types",
      steps: ["Pool = 26 + 26 + 10 + 32 = 94", "log₂(94) ≈ 6.55 bits per character", "16 × 6.55 ≈ 104.9 bits"],
      result: "About 105 bits: effectively unguessable, even offline.",
    },
    {
      title: "12 characters, lowercase only",
      steps: ["Pool = 26", "log₂(26) ≈ 4.70 bits per character", "12 × 4.70 ≈ 56.4 bits"],
      result: "About 56 bits: fine against online guessing, but weak if a password database leaks and is attacked offline.",
    },
    {
      title: "20 characters, letters and numbers only",
      steps: ["Pool = 62", "log₂(62) ≈ 5.95 bits per character", "20 × 5.95 ≈ 119.1 bits"],
      result: "About 119 bits, stronger than the 16-character version with symbols, and easier to type on a phone.",
    },
  ],
  sections: [
    {
      heading: "Is it safe to use an online password generator?",
      paragraphs: [
        "It depends on where the password is made. A generator that creates passwords on a server could, in principle, log them. This one runs entirely in your browser: the page makes no network requests when you click Generate, and you can confirm that in your browser's developer tools or by generating a password while offline.",
        "The randomness comes from the same source browsers use for encryption keys, not from Math.random, which is not designed for security.",
      ],
    },
    {
      heading: "How long should a password be?",
      list: [
        "Everyday accounts stored in a password manager: 16 to 20 random characters.",
        "Email, banking and your password manager's master password: these deserve extra care. For a master password you must remember, a long passphrase of five or more random words is easier to memorise than a 16-character jumble.",
        "Wi-Fi (WPA2/WPA3): 20 or more characters; you rarely type it, so length costs little.",
        "Sites that cap length or ban symbols: use the maximum allowed length and turn off symbols rather than shortening the password.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is a good entropy score?",
      answer:
        "Around 80 bits or more is strong for almost any purpose, and 100+ bits is comfortably beyond brute force. Below about 50 bits, a leaked password hash could be cracked with enough computing power.",
    },
    {
      question: "Should I exclude look-alike characters?",
      answer:
        "Only if you will read or type the password manually. Excluding them shrinks the pool slightly, which costs a little entropy; adding one or two extra characters more than makes up for it.",
    },
    {
      question: "Do I need symbols in my password?",
      answer:
        "Not for strength if the password is long enough; length matters more. Include symbols when a site requires them, or when the site limits length and you need every bit of entropy per character.",
    },
    {
      question: "Can I reuse a strong password on several sites?",
      answer:
        "No. If one site is breached, attackers try the same email and password everywhere else. A password manager makes a unique password per site practical.",
    },
    {
      question: "Why is my password marked weak at 8 characters?",
      answer:
        "Even with all 94 characters, 8 characters gives only about 52 bits of entropy. Modern cracking hardware can test billions of guesses per second against a leaked hash, so 8 characters is no longer enough for anything important.",
    },
    {
      question: "Are generated passwords saved anywhere?",
      answer:
        "No. They exist only in the page until you copy them, and they are gone when you close the tab. Save the password in a password manager before leaving.",
    },
  ],
};

export default content;
