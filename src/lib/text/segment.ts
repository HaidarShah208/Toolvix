/**
 * Unicode-aware text segmentation helpers. Uses Intl.Segmenter when the
 * runtime provides it and falls back to regular expressions otherwise, so
 * results are sensible in every browser and during server rendering.
 */

type SegmenterCtor = new (
  locale?: string,
  options?: { granularity?: "grapheme" | "word" | "sentence" },
) => {
  segment(input: string): Iterable<{ segment: string; index: number; isWordLike?: boolean }>;
};

function getSegmenter(): SegmenterCtor | null {
  const intl = Intl as unknown as { Segmenter?: SegmenterCtor };
  return typeof intl.Segmenter === "function" ? intl.Segmenter : null;
}

let graphemeSegmenter: InstanceType<SegmenterCtor> | null | undefined;
let wordSegmenter: InstanceType<SegmenterCtor> | null | undefined;
let sentenceSegmenter: InstanceType<SegmenterCtor> | null | undefined;

function graphemeSeg() {
  if (graphemeSegmenter === undefined) {
    const S = getSegmenter();
    graphemeSegmenter = S ? new S(undefined, { granularity: "grapheme" }) : null;
  }
  return graphemeSegmenter;
}

function wordSeg() {
  if (wordSegmenter === undefined) {
    const S = getSegmenter();
    wordSegmenter = S ? new S(undefined, { granularity: "word" }) : null;
  }
  return wordSegmenter;
}

function sentenceSeg() {
  if (sentenceSegmenter === undefined) {
    const S = getSegmenter();
    sentenceSegmenter = S ? new S(undefined, { granularity: "sentence" }) : null;
  }
  return sentenceSegmenter;
}

/**
 * Approximate grapheme clusters without Intl.Segmenter: a base code point
 * followed by combining marks, variation selectors, skin-tone modifiers,
 * emoji tags and ZWJ-joined sequences. Regional-indicator pairs form flags.
 */
const GRAPHEME_FALLBACK =
  /\r\n|[\u{1F1E6}-\u{1F1FF}]{2}|(?:[\0-\u{10FFFF}])(?:[\p{M}\uFE0E\uFE0F\u{1F3FB}-\u{1F3FF}\u{E0020}-\u{E007F}\u20E3]|\u200D[\0-\u{10FFFF}])*/gu;

/** Splits text into user-perceived characters (emoji and accented letters count once). */
export function graphemes(text: string): string[] {
  if (!text) return [];
  const seg = graphemeSeg();
  if (seg) {
    const out: string[] = [];
    for (const s of seg.segment(text)) out.push(s.segment);
    return out;
  }
  return text.match(GRAPHEME_FALLBACK) ?? [];
}

export function countGraphemes(text: string): number {
  if (!text) return 0;
  const seg = graphemeSeg();
  if (seg) {
    let n = 0;
    for (const s of seg.segment(text)) {
      void s;
      n++;
    }
    return n;
  }
  return (text.match(GRAPHEME_FALLBACK) ?? []).length;
}

const WORD_FALLBACK = /[\p{L}\p{N}\p{M}]+(?:['’\-‐][\p{L}\p{N}\p{M}]+)*/gu;
const JOINERS = new Set(["'", "’", "-", "‐"]);

/**
 * Returns the words in the text. Hyphenated words ("well-known") and
 * contractions ("don't") count as one word, matching word processors.
 */
export function words(text: string): string[] {
  if (!text) return [];
  const seg = wordSeg();
  if (!seg) return text.match(WORD_FALLBACK) ?? [];

  const out: string[] = [];
  let pendingJoiner: string | null = null;
  let lastWasWord = false;
  for (const s of seg.segment(text)) {
    if (s.isWordLike) {
      if (lastWasWord && pendingJoiner !== null && out.length > 0) {
        out[out.length - 1] += pendingJoiner + s.segment;
      } else {
        out.push(s.segment);
      }
      pendingJoiner = null;
      lastWasWord = true;
    } else if (lastWasWord && pendingJoiner === null && JOINERS.has(s.segment)) {
      pendingJoiner = s.segment;
    } else {
      pendingJoiner = null;
      lastWasWord = false;
    }
  }
  return out;
}

const HAS_WORD_CHAR = /[\p{L}\p{N}]/u;

/** Counts sentences. Lines without end punctuation (headings, list items) count as sentences too. */
export function countSentences(text: string): number {
  if (!text.trim()) return 0;
  const seg = sentenceSeg();
  let n = 0;
  if (seg) {
    for (const s of seg.segment(text)) {
      if (HAS_WORD_CHAR.test(s.segment)) n++;
    }
    return n;
  }
  for (const part of text.split(/[.!?…]+["'”’)\]]*(?:\s+|$)|\n+/)) {
    if (HAS_WORD_CHAR.test(part)) n++;
  }
  return n;
}

/** Splits into lines, treating CRLF, CR and LF as line breaks. */
export function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

/** UTF-8 encoded size of the text in bytes. */
export function utf8Bytes(text: string): number {
  let bytes = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c < 0x80) bytes += 1;
    else if (c < 0x800) bytes += 2;
    else if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        bytes += 4;
        i++;
      } else bytes += 3;
    } else bytes += 3;
  }
  return bytes;
}
