import { splitLines } from "./segment";

export type CaseId =
  | "upper"
  | "lower"
  | "sentence"
  | "title"
  | "capitalize"
  | "camel"
  | "pascal"
  | "snake"
  | "kebab"
  | "constant"
  | "dot"
  | "alternating"
  | "inverse";

export const CASES: readonly { id: CaseId; label: string; example: string }[] = [
  { id: "upper", label: "UPPERCASE", example: "THE QUICK FOX" },
  { id: "lower", label: "lowercase", example: "the quick fox" },
  { id: "sentence", label: "Sentence case", example: "The quick fox" },
  { id: "title", label: "Title Case", example: "The Fox and the Hound" },
  { id: "capitalize", label: "Capitalize Each Word", example: "The Fox And The Hound" },
  { id: "camel", label: "camelCase", example: "quickBrownFox" },
  { id: "pascal", label: "PascalCase", example: "QuickBrownFox" },
  { id: "snake", label: "snake_case", example: "quick_brown_fox" },
  { id: "kebab", label: "kebab-case", example: "quick-brown-fox" },
  { id: "constant", label: "CONSTANT_CASE", example: "QUICK_BROWN_FOX" },
  { id: "dot", label: "dot.case", example: "quick.brown.fox" },
  { id: "alternating", label: "aLtErNaTiNg", example: "aLtErNaTiNg" },
  { id: "inverse", label: "InVeRsE", example: "sWAP cASE" },
];

const MINOR_WORDS = new Set([
  "a", "an", "the", "and", "but", "or", "for", "nor", "of", "on", "in", "to", "at", "by", "as",
]);

const IS_LETTER = /\p{L}/u;

/** Uppercases the first letter of a word and lowercases the rest. */
function capitalizeWord(word: string): string {
  const lower = word.toLowerCase();
  let out = "";
  let done = false;
  for (const ch of lower) {
    if (!done && IS_LETTER.test(ch)) {
      out += ch.toUpperCase();
      done = true;
    } else out += ch;
  }
  return out;
}

const WORD_TOKEN = /[\p{L}\p{N}\p{M}]+(?:['’][\p{L}\p{N}\p{M}]+)*/gu;

function sentenceCase(text: string): string {
  const lower = text.toLowerCase();
  let out = "";
  let capNext = true;
  for (const ch of lower) {
    if (capNext && IS_LETTER.test(ch)) {
      out += ch.toUpperCase();
      capNext = false;
      continue;
    }
    if (/[.!?]/.test(ch) || ch === "\n") capNext = true;
    else if (capNext && /[\p{N}]/u.test(ch)) capNext = false;
    out += ch;
  }
  // The pronoun "I" and its contractions stay capitalized.
  return out.replace(/(^|[^\p{L}\p{N}])i(?=$|[^\p{L}\p{N}]|['’](?:m|d|ll|ve)\b)/gu, "$1I");
}

function titleCaseLine(line: string): string {
  const matches: { word: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  WORD_TOKEN.lastIndex = 0;
  while ((m = WORD_TOKEN.exec(line)) !== null) matches.push({ word: m[0], index: m.index });
  if (matches.length === 0) return line;

  let out = "";
  let cursor = 0;
  matches.forEach(({ word, index }, i) => {
    const gap = line.slice(cursor, index);
    // A colon, dash or end punctuation before the word starts a new phrase.
    const startsPhrase = i === 0 || /[:.!?—–]/.test(gap);
    const isLast = i === matches.length - 1;
    const lower = word.toLowerCase();
    const next = startsPhrase || isLast || !MINOR_WORDS.has(lower) ? capitalizeWord(word) : lower;
    out += gap + next;
    cursor = index + word.length;
  });
  return out + line.slice(cursor);
}

function capitalizeEachWord(text: string): string {
  return text.replace(WORD_TOKEN, (w) => capitalizeWord(w));
}

/** Splits an identifier or phrase into words, honouring camelCase and acronym boundaries. */
export function splitIdentifierWords(text: string): string[] {
  return (
    text.match(
      /\p{Lu}+(?=\p{Lu}[\p{Ll}\p{M}])|\p{Lu}?[\p{Ll}\p{M}]+\p{N}*|\p{Lu}[\p{Lu}\p{M}]*\p{N}*|\p{N}+|[\p{Lo}\p{Lm}\p{Lt}][\p{Lo}\p{Lm}\p{Lt}\p{M}]*/gu,
    ) ?? []
  );
}

function perLine(text: string, fn: (line: string) => string): string {
  return splitLines(text).map(fn).join("\n");
}

function joinWords(line: string, sep: string, mode: "lower" | "upper"): string {
  const ws = splitIdentifierWords(line).map((w) => (mode === "upper" ? w.toUpperCase() : w.toLowerCase()));
  return ws.join(sep);
}

function camel(line: string, pascal: boolean): string {
  return splitIdentifierWords(line)
    .map((w, i) => (i === 0 && !pascal ? w.toLowerCase() : capitalizeWord(w)))
    .join("");
}

function alternating(text: string): string {
  let out = "";
  let upper = false;
  for (const ch of text) {
    if (IS_LETTER.test(ch)) {
      out += upper ? ch.toUpperCase() : ch.toLowerCase();
      upper = !upper;
    } else out += ch;
  }
  return out;
}

function inverse(text: string): string {
  let out = "";
  for (const ch of text) {
    const up = ch.toUpperCase();
    const low = ch.toLowerCase();
    if (ch === up && ch !== low) out += low;
    else if (ch === low && ch !== up) out += up;
    else out += ch;
  }
  return out;
}

export function convertCase(text: string, id: CaseId): string {
  switch (id) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "sentence":
      return sentenceCase(text);
    case "title":
      return perLine(text, titleCaseLine);
    case "capitalize":
      return capitalizeEachWord(text);
    case "camel":
      return perLine(text, (l) => camel(l, false));
    case "pascal":
      return perLine(text, (l) => camel(l, true));
    case "snake":
      return perLine(text, (l) => joinWords(l, "_", "lower"));
    case "kebab":
      return perLine(text, (l) => joinWords(l, "-", "lower"));
    case "constant":
      return perLine(text, (l) => joinWords(l, "_", "upper"));
    case "dot":
      return perLine(text, (l) => joinWords(l, ".", "lower"));
    case "alternating":
      return alternating(text);
    case "inverse":
      return inverse(text);
  }
}
