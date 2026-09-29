import { countSentences, graphemes, splitLines, utf8Bytes, words } from "./segment";

export const READING_WPM = 238;
export const SPEAKING_WPM = 140;

/** Common English function words ignored in keyword density. */
const STOPWORDS = new Set(
  (
    "a about above after again against all also am an and any are aren't as at be because been before being below " +
    "between both but by can can't cannot could couldn't did didn't do does doesn't doing don't down during each " +
    "even ever every few for from further get gets got had hadn't has hasn't have haven't having he he'd he'll he's " +
    "her here here's hers herself him himself his how how's however i i'd i'll i'm i've if in into is isn't it it's " +
    "its itself just let's like made make many may me might more most much must mustn't my myself no nor not now of " +
    "off on once one only or other ought our ours ourselves out over own per quite rather really said same say says " +
    "shall shan't she she'd she'll she's should shouldn't since so some still such than that that's the their theirs " +
    "them themselves then there there's these they they'd they'll they're they've this those though through thus to " +
    "too under until up upon us use used using very via was wasn't we we'd we'll we're we've well were weren't what " +
    "what's when when's where where's whether which while who who's whom whose why why's will with within without " +
    "won't would wouldn't yet you you'd you'll you're you've your yours yourself yourselves"
  ).split(" "),
);

export interface Keyword {
  word: string;
  count: number;
  /** Share of all words, in percent. */
  density: number;
}

export interface WordStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  /** Average letters/digits per word; 0 when there are no words. */
  averageWordLength: number;
  readingSeconds: number;
  speakingSeconds: number;
  keywords: Keyword[];
}

const WHITESPACE = /^\s+$/u;
const WORD_CHAR = /[\p{L}\p{N}]/gu;

export function wordStats(text: string, keywordLimit = 5): WordStats {
  const list = words(text);
  const chars = graphemes(text);
  let noSpaces = 0;
  for (const g of chars) if (!WHITESPACE.test(g)) noSpaces++;

  let letterTotal = 0;
  const counts = new Map<string, number>();
  for (const w of list) {
    letterTotal += (w.match(WORD_CHAR) ?? []).length;
    const key = w.toLowerCase().replace(/’/g, "'");
    const letters = (key.match(/\p{L}/gu) ?? []).length;
    if (letters < 3 || STOPWORDS.has(key)) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const total = list.length;
  const keywords = [...counts.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, keywordLimit)
    .map(([word, count]) => ({ word, count, density: total ? (count / total) * 100 : 0 }));

  const paragraphs = text.trim() ? splitLines(text).filter((l) => l.trim() !== "").length : 0;

  return {
    words: total,
    characters: chars.length,
    charactersNoSpaces: noSpaces,
    sentences: countSentences(text),
    paragraphs,
    averageWordLength: total ? letterTotal / total : 0,
    readingSeconds: Math.round((total / READING_WPM) * 60),
    speakingSeconds: Math.round((total / SPEAKING_WPM) * 60),
    keywords,
  };
}

/** "2 min 10 sec", "< 1 min", "1 hr 5 min", or "0 min" for no text. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0 min";
  const s = Math.round(seconds);
  if (s < 60) return "< 1 min";
  if (s >= 3600) {
    const h = Math.floor(s / 3600);
    const m = Math.round((s % 3600) / 60);
    return m ? `${h} hr ${m} min` : `${h} hr`;
  }
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec ? `${m} min ${sec} sec` : `${m} min`;
}

export interface CharStats {
  characters: number;
  charactersNoSpaces: number;
  letters: number;
  digits: number;
  spaces: number;
  punctuation: number;
  lines: number;
  bytes: number;
}

export function charStats(text: string): CharStats {
  const chars = graphemes(text);
  const out: CharStats = {
    characters: chars.length,
    charactersNoSpaces: 0,
    letters: 0,
    digits: 0,
    spaces: 0,
    punctuation: 0,
    lines: text === "" ? 0 : splitLines(text).length,
    bytes: utf8Bytes(text),
  };
  for (const g of chars) {
    const isSpace = WHITESPACE.test(g);
    if (!isSpace) out.charactersNoSpaces++;
    if (/^\p{L}/u.test(g)) out.letters++;
    else if (/^\p{Nd}/u.test(g) && !g.includes("\u20E3")) out.digits++;
    else if (isSpace) {
      if (!/[\r\n\u2028\u2029]/.test(g)) out.spaces++;
    } else if (/^[\p{P}\p{S}\p{Extended_Pictographic}\p{Regional_Indicator}]/u.test(g) || g.includes("\u20E3")) {
      out.punctuation++;
    }
  }
  return out;
}

/* ---------- X (Twitter) weighted length ---------- */

const URL_RE = /\bhttps?:\/\/[^\s<>"]+|\bwww\.[^\s<>"]+/giu;
const EMOJI_RE = /\p{Extended_Pictographic}|\p{Regional_Indicator}|\u20E3/u;

function weightOfCodePoint(cp: number): number {
  if (
    (cp >= 0 && cp <= 4351) ||
    (cp >= 8192 && cp <= 8205) ||
    (cp >= 8208 && cp <= 8223) ||
    (cp >= 8242 && cp <= 8247)
  ) {
    return 1;
  }
  return 2;
}

/**
 * Approximates X's weighted character count: links count as 23, emoji as
 * 2, CJK and most non-Latin scripts as 2 per character, Latin text as 1.
 */
export function xWeightedLength(text: string): number {
  if (!text) return 0;
  let total = 0;
  const withoutUrls = text.replace(URL_RE, () => {
    total += 23;
    return "";
  });
  for (const g of graphemes(withoutUrls.normalize("NFC"))) {
    if (EMOJI_RE.test(g)) {
      total += 2;
      continue;
    }
    for (const ch of g) total += weightOfCodePoint(ch.codePointAt(0) ?? 0);
  }
  return total;
}

/* ---------- SMS encoding ---------- */

const GSM_BASIC = new Set(
  Array.from(
    "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà",
  ),
);
const GSM_EXTENDED = new Set(Array.from("^{}\\[~]|€\f"));

export interface SmsInfo {
  encoding: "GSM-7" | "UCS-2";
  /** Septets for GSM-7, UTF-16 code units for UCS-2. */
  units: number;
  singleLimit: number;
  multiLimit: number;
  segments: number;
  /** Up to 5 distinct characters that forced UCS-2. */
  nonGsmChars: string[];
}

export function smsInfo(text: string): SmsInfo {
  let septets = 0;
  const nonGsm: string[] = [];
  for (const ch of text) {
    if (GSM_BASIC.has(ch)) septets += 1;
    else if (GSM_EXTENDED.has(ch)) septets += 2;
    else if (!nonGsm.includes(ch)) nonGsm.push(ch);
  }
  if (nonGsm.length === 0) {
    return {
      encoding: "GSM-7",
      units: septets,
      singleLimit: 160,
      multiLimit: 153,
      segments: septets === 0 ? 0 : septets <= 160 ? 1 : Math.ceil(septets / 153),
      nonGsmChars: [],
    };
  }
  const units = text.length;
  return {
    encoding: "UCS-2",
    units,
    singleLimit: 70,
    multiLimit: 67,
    segments: units <= 70 ? 1 : Math.ceil(units / 67),
    nonGsmChars: nonGsm.slice(0, 5),
  };
}
