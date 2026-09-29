/**
 * Lorem ipsum generator. Uses a small seeded PRNG so the same seed always
 * gives the same text: the first render can be produced on the server
 * without a hydration mismatch, and "Generate" simply picks a new seed.
 */

export type LoremUnit = "paragraphs" | "sentences" | "words";

export const LOREM_LIMITS: Record<LoremUnit, number> = {
  paragraphs: 100,
  sentences: 500,
  words: 5000,
};

export interface LoremOptions {
  unit: LoremUnit;
  amount: number;
  startWithLorem: boolean;
  htmlParagraphs: boolean;
}

const CLASSIC = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
const CLASSIC_WORDS = ["lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit"];

/** Vocabulary from the traditional lorem ipsum passage (Cicero, De finibus). */
const WORDS = (
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore " +
  "magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo " +
  "consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur " +
  "sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum perspiciatis " +
  "unde omnis iste natus error voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae " +
  "ab illo inventore veritatis quasi architecto beatae vitae dicta explicabo nemo ipsam quia voluptas " +
  "aspernatur aut odit fugit consequuntur magni dolores eos ratione sequi nesciunt neque porro quisquam " +
  "dolorem adipisci numquam eius modi tempora incidunt magnam quaerat etiam minima nostrum exercitationem " +
  "ullam corporis suscipit laboriosam aliquid commodi consequatur autem vel eum iure quam nihil molestiae " +
  "illum dolorum pariatur at vero accusamus iusto odio dignissimos ducimus blanditiis praesentium " +
  "voluptatum deleniti atque corrupti quos quas molestias excepturi occaecati cupiditate provident " +
  "similique mollitia animi facilis expedita distinctio nam libero tempore soluta nobis eligendi optio " +
  "cumque impedit quo minus maxime placeat facere possimus assumenda repellendus temporibus quibusdam " +
  "officiis debitis rerum necessitatibus saepe eveniet voluptates repudiandae recusandae itaque earum hic " +
  "tenetur sapiente delectus reiciendis voluptatibus maiores alias perferendis doloribus asperiores repellat"
).split(" ");

/** mulberry32: tiny, fast, deterministic PRNG. Not for security use. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

class Writer {
  private rand: () => number;
  private last = "";
  constructor(seed: number) {
    this.rand = mulberry32(seed);
  }
  int(min: number, max: number): number {
    return min + Math.floor(this.rand() * (max - min + 1));
  }
  word(): string {
    let w: string;
    do w = WORDS[Math.floor(this.rand() * WORDS.length)];
    while (w === this.last);
    this.last = w;
    return w;
  }
  /** A sentence of `n` words with a capital, an occasional comma and a period. */
  sentence(n = this.int(5, 15)): string {
    const ws: string[] = [];
    for (let i = 0; i < n; i++) ws.push(this.word());
    if (n >= 8 && this.rand() < 0.6) {
      const at = this.int(2, n - 4);
      ws[at] += ",";
    }
    ws[0] = capitalize(ws[0]);
    return `${ws.join(" ")}.`;
  }
  paragraph(first?: string): string {
    const count = this.int(4, 8);
    const out: string[] = [];
    if (first) out.push(first);
    while (out.length < count) out.push(this.sentence());
    return out.join(" ");
  }
}

/** Generates exactly `count` words as one or more sentences. */
function wordsText(w: Writer, count: number, startWithLorem: boolean): string {
  const sentences: string[] = [];
  let remaining = count;
  if (startWithLorem) {
    if (count < CLASSIC_WORDS.length) {
      const part = CLASSIC_WORDS.slice(0, count);
      part[0] = capitalize(part[0]);
      return `${part.join(" ").replace(/,$/, "")}.`;
    }
    sentences.push(CLASSIC);
    remaining -= CLASSIC_WORDS.length;
  }
  while (remaining > 0) {
    let n = Math.min(remaining, w.int(5, 15));
    // Avoid a dangling 1–2 word sentence at the end.
    if (remaining - n > 0 && remaining - n < 3) n = remaining;
    sentences.push(w.sentence(n));
    remaining -= n;
  }
  return sentences.join(" ");
}

export function generateLorem(o: LoremOptions, seed: number): string {
  const w = new Writer(seed);
  const amount = Math.max(1, Math.min(LOREM_LIMITS[o.unit], Math.floor(o.amount)));
  let paragraphs: string[];

  if (o.unit === "paragraphs") {
    paragraphs = [];
    for (let i = 0; i < amount; i++) paragraphs.push(w.paragraph(i === 0 && o.startWithLorem ? CLASSIC : undefined));
  } else if (o.unit === "sentences") {
    const s: string[] = [];
    for (let i = 0; i < amount; i++) s.push(i === 0 && o.startWithLorem ? CLASSIC : w.sentence());
    paragraphs = [s.join(" ")];
  } else {
    paragraphs = [wordsText(w, amount, o.startWithLorem)];
  }

  return o.htmlParagraphs ? paragraphs.map((p) => `<p>${p}</p>`).join("\n\n") : paragraphs.join("\n\n");
}

/** Words in generated text, ignoring any <p> tags. */
export function countLoremWords(text: string): number {
  const plain = text.replace(/<\/?p>/g, " ").trim();
  return plain ? plain.split(/\s+/).length : 0;
}
