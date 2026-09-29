import { countGraphemes } from "./segment";

export interface CleanOptions {
  trimLines: boolean;
  collapseSpaces: boolean;
  removeBlankLines: boolean;
  collapseBlankLines: boolean;
  removeLineBreaks: boolean;
  removeDuplicateLines: boolean;
  stripHtml: boolean;
  plainPunctuation: boolean;
  removeInvisible: boolean;
  tabsToSpaces: boolean;
  removeEmoji: boolean;
}

export const DEFAULT_CLEAN_OPTIONS: CleanOptions = {
  trimLines: true,
  collapseSpaces: true,
  removeBlankLines: false,
  collapseBlankLines: true,
  removeLineBreaks: false,
  removeDuplicateLines: false,
  stripHtml: false,
  plainPunctuation: false,
  removeInvisible: true,
  tabsToSpaces: false,
  removeEmoji: false,
};

export const TAB_WIDTH = 4;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  ndash: "–",
  mdash: "—",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  copy: "©",
  reg: "®",
  trade: "™",
  deg: "°",
  middot: "·",
  bull: "•",
  euro: "€",
  pound: "£",
  cent: "¢",
  yen: "¥",
  times: "×",
  divide: "÷",
};

/** Decodes common named entities and all numeric ones in a single pass (no double-decoding). */
export function decodeEntities(text: string): string {
  return text.replace(/&(#\d{1,7}|#x[0-9a-f]{1,6}|[a-z]{2,8});/gi, (match, body: string) => {
    if (body[0] === "#") {
      const cp = body[1] === "x" || body[1] === "X" ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
      if (!Number.isFinite(cp) || cp <= 0 || cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) return match;
      return cp === 0xa0 ? " " : String.fromCodePoint(cp);
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named ?? match;
  });
}

/**
 * Removes HTML markup using plain string processing. The input is never
 * parsed into a live document or rendered, so scripts cannot run.
 */
export function stripHtml(text: string): string {
  return decodeEntities(
    text
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<(script|style|noscript|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|tr|blockquote|pre|section|article|header|footer|ul|ol|table)\s*>/gi, "\n")
      .replace(/<\/?[a-z][^<>]*>/gi, "")
      .replace(/<![a-z][^<>]*>/gi, ""),
  );
}

export function toPlainPunctuation(text: string): string {
  return text
    .replace(/[‘’‚‛′‹›]/g, "'")
    .replace(/[“”„‟″«»]/g, '"')
    .replace(/[‐‑‒–—―−]/g, "-")
    .replace(/…/g, "...")
    .replace(/\u00A0/g, " ");
}

const INVISIBLE = /[\u200B-\u200D\uFEFF\u00AD\u2060]/g;

const EMOJI_SEQUENCE =
  /(?:[0-9#*]\uFE0F?\u20E3|[\u{1F1E6}-\u{1F1FF}]{1,2}|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F)(?:[\u{1F3FB}-\u{1F3FF}]|\uFE0F|[\u{E0020}-\u{E007F}])*(?:\u200D(?:\p{Extended_Pictographic})\uFE0F?(?:[\u{1F3FB}-\u{1F3FF}])?)*)/gu;

/** Removes emoji, including skin tones, ZWJ sequences, flags and keycaps. ©, ® and ™ are kept. */
export function removeEmoji(text: string): string {
  return text.replace(EMOJI_SEQUENCE, "");
}

export interface CleanResult {
  text: string;
  charsBefore: number;
  charsAfter: number;
  linesBefore: number;
  linesAfter: number;
}

function lineCount(text: string): number {
  return text === "" ? 0 : text.split("\n").length;
}

export function cleanText(input: string, o: CleanOptions): CleanResult {
  let t = input.replace(/\r\n?/g, "\n");
  const linesBefore = lineCount(t);

  if (o.stripHtml) t = stripHtml(t);
  if (o.removeInvisible) t = t.replace(INVISIBLE, "");
  if (o.plainPunctuation) t = toPlainPunctuation(t);
  if (o.removeEmoji) t = removeEmoji(t);
  if (o.tabsToSpaces) t = t.replace(/\t/g, " ".repeat(TAB_WIDTH));

  let lines = t.split("\n");
  if (o.collapseSpaces) lines = lines.map((l) => l.replace(/[ \u00A0\u2000-\u200A\u202F\u205F\u3000]{2,}/g, " "));
  if (o.trimLines) lines = lines.map((l) => l.trim());

  if (o.removeDuplicateLines) {
    const seen = new Set<string>();
    lines = lines.filter((l) => {
      if (l.trim() === "") return true;
      if (seen.has(l)) return false;
      seen.add(l);
      return true;
    });
  }

  if (o.removeBlankLines || o.removeLineBreaks) {
    lines = lines.filter((l) => l.trim() !== "");
  } else if (o.collapseBlankLines) {
    lines = lines.filter((l, i) => !(l.trim() === "" && i > 0 && lines[i - 1].trim() === ""));
  }

  let out: string;
  if (o.removeLineBreaks) {
    out = lines.join(" ");
    if (o.collapseSpaces) out = out.replace(/ {2,}/g, " ");
  } else {
    out = lines.join("\n");
  }
  if (o.trimLines) out = out.replace(/^\s*\n/, "").replace(/\n\s*$/, "");

  return {
    text: out,
    charsBefore: countGraphemes(input),
    charsAfter: countGraphemes(out),
    linesBefore,
    linesAfter: lineCount(out),
  };
}
