import type { GuideContent } from "@/types";

const guide: GuideContent = {
  directAnswer:
    "A strong password is long, random and used for only one account. Aim for at least 12 to 16 random characters, or a passphrase of five or more randomly chosen words, and store it in a password manager. Length adds more strength than swapping letters for symbols.",
  intro:
    "Most accounts are not broken by someone cleverly guessing a password. They are compromised when a password is reused after a data breach, is predictable enough to appear in the lists attackers try first, or is handed over on a fake login page. A strong password handles the first two problems; good habits such as multi-factor authentication handle the rest.",
  steps: [
    "Use a password manager or a trusted generator to create the password, rather than inventing one yourself. People are poor at being random.",
    "Make it long: 16 or more characters for a generated password, or five to six words for a passphrase.",
    "Include a mix of character types if the site allows, but prioritize length over complexity.",
    "Use a different password for every account, so a breach at one site does not unlock the others.",
    "Turn on multi-factor authentication, especially for email, banking and your password manager.",
    "Change a password promptly if the service reports a breach or you suspect it has been exposed; routine forced changes are not otherwise necessary.",
  ],
  formulas: [
    {
      label: "Entropy of a random password",
      expression: "Entropy (bits) = L × log₂(N)",
      variables: [
        { symbol: "L", meaning: "length, the number of characters or words" },
        { symbol: "N", meaning: "the size of the pool each character or word is drawn from" },
      ],
      note: "This only applies when every character or word is chosen at random. A human-chosen password has far less real entropy than the formula suggests.",
    },
    {
      label: "Number of possible passwords",
      expression: "Combinations = N^L = 2^entropy",
      note: "Each extra bit of entropy doubles the number of guesses an attacker would need to try every option.",
    },
  ],
  examples: [
    {
      title: "8 random characters from all 94 printable keyboard symbols",
      steps: ["log₂(94) ≈ 6.55 bits per character", "8 × 6.55 ≈ 52.4 bits", "94^8 ≈ 6.1 quadrillion combinations"],
      result: "About 52 bits. As a rough illustration only, a well-equipped attacker making 10 billion guesses a second against a fast, unsalted hash could try every combination in about a week.",
    },
    {
      title: "16 random lowercase letters vs 8 characters from the full set",
      steps: ["log₂(26) ≈ 4.70 bits per letter", "16 × 4.70 ≈ 75.2 bits"],
      result: "About 75 bits, far stronger than the 52-bit mixed password, even though it uses only lowercase letters. Doubling the length beat quadrupling the pool.",
    },
    {
      title: "A passphrase of random words from a 7,776-word list",
      steps: [
        "log₂(7,776) ≈ 12.9 bits per word",
        "5 words: 5 × 12.9 ≈ 64.6 bits",
        "6 words: 6 × 12.9 ≈ 77.5 bits",
      ],
      result: "Six random words give roughly the same entropy as 16 random lowercase letters and are much easier to type and remember.",
    },
  ],
  sections: [
    {
      heading: "Why does length matter more than complexity?",
      paragraphs: [
        "Every character you add multiplies the number of possible passwords by the size of the pool. Adding symbols to the pool increases N, but only modestly: going from 26 lowercase letters to all 94 printable characters raises the bits per character from about 4.7 to about 6.6. For an 8-character password, that switch adds roughly 15 bits, while simply adding four more lowercase letters adds about 19, and length keeps paying off with every character.",
        "Complexity rules also backfire in practice. Asked to include a capital, a number and a symbol, most people produce something like Summer2024!, which follows such a common pattern that it offers little real protection. Length combined with genuine randomness is what makes a password hard to guess.",
      ],
    },
    {
      heading: "What does entropy actually tell you?",
      paragraphs: [
        "Entropy measures how many guesses an attacker would need if they knew exactly how your password was generated but not the result. It is a property of the method, not of the finished string. A random generator producing 16 characters has about 105 bits of entropy. A password you chose from your pet's name and birth year might look just as complicated to a strength meter but may fall in the first few million guesses.",
        "Real crack times depend on factors outside your control: how the site stores passwords, whether it uses a slow hashing algorithm, and how much computing power an attacker has. The time estimates in this guide are illustrations of scale, not predictions.",
      ],
    },
    {
      heading: "Are passphrases better than passwords?",
      paragraphs: [
        "They can be, if the words are picked randomly. A passphrase such as five or six words drawn by dice or a generator from a long word list is strong and memorable, which makes it a good choice for the few passwords you have to type yourself, such as your computer login or password manager.",
        "A phrase you make up, like a song lyric or a quote, is not random. Attackers include common phrases and quotations in their guess lists.",
      ],
    },
    {
      heading: "Habits that protect you more than any single password",
      list: [
        "Never reuse passwords. Credential stuffing, where attackers try leaked email and password pairs on other sites, is one of the most common ways accounts are taken over.",
        "Use a password manager so every account can have a long random password without you remembering any of them.",
        "Enable multi-factor authentication. An authenticator app or security key is stronger than text-message codes, but any second factor is better than none.",
        "Protect your email account most carefully, since it can reset almost every other password.",
        "Type addresses yourself or use bookmarks instead of logging in through links in emails; a strong password does not help if you enter it on a fake site.",
      ],
    },
    {
      heading: "Common mistakes",
      list: [
        "Predictable substitutions such as P@ssw0rd, which attackers try automatically.",
        "Keyboard patterns like qwerty123 or 1q2w3e4r.",
        "Personal details: names, birthdays, pets, teams or addresses.",
        "Adding a number to the end of an old password when forced to change it.",
        "Trusting a strength meter that only checks for character types.",
      ],
    },
  ],
  faqs: [
    {
      question: "How long should a password be?",
      answer:
        "For generated passwords stored in a manager, 16 characters or more is a comfortable choice. For a password you must remember, a random passphrase of five or six words is a practical alternative.",
    },
    {
      question: "Are password managers safe?",
      answer:
        "A reputable password manager, protected by a strong master passphrase and multi-factor authentication, is generally far safer than reusing or writing down passwords. It concentrates your risk, so that master passphrase must be unique and strong.",
    },
    {
      question: "Should I change my passwords regularly?",
      answer:
        "Current guidance from security bodies such as NIST advises against forced periodic changes, because they encourage predictable patterns. Change a password when there is a reason, such as a breach.",
    },
    {
      question: "Is it safe to use an online password generator?",
      answer:
        "It is safest when the password is generated locally in your browser with a cryptographically secure random source and never sent over the network. Toolora's password generator works that way.",
    },
    {
      question: "What makes a password weak even if it is long?",
      answer:
        "Predictability. A long password built from a famous phrase, repeated words or personal details can be guessed much faster than its length suggests, because it was not chosen at random.",
    },
  ],
};

export default guide;
