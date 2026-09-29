import { randomBelow } from "./random";

export type SortOrder = "none" | "asc" | "desc";

export interface RandomNumberOptions {
  min: number;
  max: number;
  count: number;
  /** 0 for integers, 1–10 for decimals. */
  decimals: number;
  allowDuplicates: boolean;
  sort: SortOrder;
}

export interface RandomNumberResult {
  /** Exact decimal strings, e.g. "3.50". */
  values: string[];
  sum: string;
  min: string;
  max: string;
  /** How many distinct values were possible. */
  possible: number;
}

export type Outcome<T> = { ok: true; value: T } | { ok: false; error: string };


/** Formats a scaled integer (value × 10^decimals) as an exact decimal string. */
function scaledToString(n: bigint, decimals: number): string {
  const neg = n < BigInt(0);
  const abs = (neg ? -n : n).toString();
  if (decimals === 0) return (neg ? "-" : "") + abs;
  const padded = abs.padStart(decimals + 1, "0");
  const int = padded.slice(0, padded.length - decimals);
  const frac = padded.slice(padded.length - decimals);
  return `${neg ? "-" : ""}${int}.${frac}`;
}

/** Checks inputs and returns the scaled integer bounds, or a friendly error. */
export function prepareRange(o: RandomNumberOptions): Outcome<{ lo: number; hi: number; size: number }> {
  if (o.min > o.max) return { ok: false, error: "The minimum must be less than or equal to the maximum." };
  const factor = 10 ** o.decimals;
  const lo = Math.ceil(Number((o.min * factor).toFixed(6)));
  const hi = Math.floor(Number((o.max * factor).toFixed(6)));
  if (!Number.isSafeInteger(lo) || !Number.isSafeInteger(hi) || !Number.isSafeInteger(hi - lo + 1)) {
    return {
      ok: false,
      error:
        o.decimals > 0
          ? "That range is too large for this many decimal places. Use fewer decimal places or a smaller range."
          : "That range is too large to generate reliably.",
    };
  }
  if (hi < lo) {
    return {
      ok: false,
      error: `There is no number with ${o.decimals} decimal place${o.decimals === 1 ? "" : "s"} between the minimum and maximum.`,
    };
  }
  return { ok: true, value: { lo, hi, size: hi - lo + 1 } };
}

export function generateRandomNumbers(o: RandomNumberOptions): Outcome<RandomNumberResult> {
  const range = prepareRange(o);
  if (!range.ok) return range;
  const { lo, size } = range.value;

  if (!o.allowDuplicates && o.count > size) {
    return {
      ok: false,
      error: `Only ${size.toLocaleString("en-US")} different value${size === 1 ? " is" : "s are"} possible in this range, so ${o.count.toLocaleString("en-US")} unique numbers can't be drawn. Allow duplicates or widen the range.`,
    };
  }

  let offsets: number[];
  if (o.allowDuplicates) {
    offsets = Array.from({ length: o.count }, () => randomBelow(size));
  } else if (size <= 100_000) {
    // Partial Fisher–Yates over the full range: exact sampling without replacement.
    const all = Array.from({ length: size }, (_, i) => i);
    for (let i = 0; i < o.count; i++) {
      const j = i + randomBelow(size - i);
      const tmp = all[i];
      all[i] = all[j];
      all[j] = tmp;
    }
    offsets = all.slice(0, o.count);
  } else {
    // Huge range, few draws: rejection of repeats terminates quickly.
    const seen = new Set<number>();
    offsets = [];
    while (offsets.length < o.count) {
      const r = randomBelow(size);
      if (!seen.has(r)) {
        seen.add(r);
        offsets.push(r);
      }
    }
  }

  let scaled = offsets.map((off) => lo + off);
  if (o.sort === "asc") scaled = [...scaled].sort((a, b) => a - b);
  else if (o.sort === "desc") scaled = [...scaled].sort((a, b) => b - a);

  let sum = BigInt(0);
  let min = scaled[0];
  let max = scaled[0];
  for (const v of scaled) {
    sum += BigInt(v);
    if (v < min) min = v;
    if (v > max) max = v;
  }

  return {
    ok: true,
    value: {
      values: scaled.map((v) => scaledToString(BigInt(v), o.decimals)),
      sum: scaledToString(sum, o.decimals),
      min: scaledToString(BigInt(min), o.decimals),
      max: scaledToString(BigInt(max), o.decimals),
      possible: size,
    },
  };
}

