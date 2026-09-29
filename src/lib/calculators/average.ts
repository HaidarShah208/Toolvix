import type { CalcResult } from "@/lib/calculators/percentage";
import { MAX_INPUT } from "@/lib/utils/number";

export const MAX_VALUES = 10_000;

export interface ParsedList {
  values: number[];
  /** Tokens that were not plain numbers, in the order they appeared. */
  invalid: string[];
}

const NUMBER_TOKEN = /^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i;

/**
 * Splits text on commas, semicolons, spaces, tabs and new lines. Commas are
 * always separators, so "1,000" is read as two numbers: 1 and 0.
 */
export function parseNumberList(text: string): ParsedList {
  const values: number[] = [];
  const invalid: string[] = [];
  for (const raw of text.split(/[\s,;]+/)) {
    const token = raw.trim();
    if (token === "") continue;
    if (!NUMBER_TOKEN.test(token)) {
      invalid.push(token);
      continue;
    }
    const v = Number(token);
    if (!Number.isFinite(v) || Math.abs(v) > MAX_INPUT) {
      invalid.push(token);
      continue;
    }
    values.push(v === 0 ? 0 : v);
  }
  return { values, invalid };
}

export interface AverageStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  /** Most frequent values; empty when there is no mode. */
  modes: number[];
  modeFrequency: number;
  /** Why there is no mode, when `modes` is empty. */
  noModeReason?: string;
  min: number;
  max: number;
  range: number;
  /** Only when every value is greater than zero. */
  geometricMean: number | null;
  sorted: number[];
}

/** Neumaier-compensated sum to limit floating point drift over long lists. */
function preciseSum(values: number[]): number {
  let sum = 0;
  let c = 0;
  for (const v of values) {
    const t = sum + v;
    c += Math.abs(sum) >= Math.abs(v) ? sum - t + v : v - t + sum;
    sum = t;
  }
  return sum + c;
}

export function averageStats(values: number[]): CalcResult<AverageStats> {
  if (values.length === 0) return { ok: false, error: "Enter at least one number." };
  if (values.length > MAX_VALUES) {
    return {
      ok: false,
      error: `That's ${values.length.toLocaleString("en-US")} numbers. The limit is ${MAX_VALUES.toLocaleString("en-US")} per calculation.`,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = preciseSum(sorted);
  const mean = sum / count;
  const mid = Math.floor(count / 2);
  const median = count % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

  const freq = new Map<number, number>();
  for (const v of sorted) freq.set(v, (freq.get(v) ?? 0) + 1);
  let modeFrequency = 0;
  for (const f of freq.values()) modeFrequency = Math.max(modeFrequency, f);

  let modes: number[] = [];
  let noModeReason: string | undefined;
  if (modeFrequency === 1) {
    noModeReason = count === 1 ? "Only one value was entered." : "Every value appears only once.";
  } else if (freq.size > 1 && [...freq.values()].every((f) => f === modeFrequency)) {
    noModeReason = `Every value appears the same number of times (${modeFrequency}).`;
  } else {
    modes = [...freq.entries()].filter(([, f]) => f === modeFrequency).map(([v]) => v);
  }

  const min = sorted[0];
  const max = sorted[count - 1];

  let geometricMean: number | null = null;
  if (min > 0) {
    geometricMean = Math.exp(preciseSum(sorted.map(Math.log)) / count);
  }

  return {
    ok: true,
    value: {
      count,
      sum,
      mean,
      median,
      modes,
      modeFrequency,
      noModeReason,
      min,
      max,
      range: max - min,
      geometricMean: geometricMean !== null && Number.isFinite(geometricMean) ? geometricMean : null,
      sorted,
    },
  };
}
