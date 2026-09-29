import type { CalcResult } from "@/lib/calculators/percentage";
import { decimalPlaces, gcd } from "@/lib/utils/number";

export interface SimplifiedRatio {
  /** Original terms scaled to whole numbers (before dividing by the GCD). */
  scaled: number[];
  /** Power of ten used to scale decimals to whole numbers (1 when none). */
  scale: number;
  divisor: number;
  simplified: number[];
  /** A ÷ B (two-term ratios only; null when B is 0). */
  decimal: number | null;
  /** The ratio rewritten as 1 : n (: m); null when the first term is 0. */
  unitForm: number[] | null;
}

const MAX_DECIMALS = 8;

export function simplifyRatio(terms: number[]): CalcResult<SimplifiedRatio> {
  if (terms.length < 2) return { ok: false, error: "Enter at least two terms." };
  if (terms.some((t) => t < 0)) {
    return { ok: false, error: "Ratio terms can't be negative. Enter the size of each part as zero or more." };
  }
  if (terms.every((t) => t === 0)) return { ok: false, error: "At least one term must be greater than zero." };

  const places = Math.max(...terms.map(decimalPlaces));
  if (places > MAX_DECIMALS) {
    return { ok: false, error: `Use at most ${MAX_DECIMALS} decimal places per term.` };
  }
  const scale = 10 ** places;
  const scaled = terms.map((t) => Math.round(t * scale));
  if (scaled.some((s) => !Number.isSafeInteger(s))) {
    return { ok: false, error: "These numbers are too large to simplify exactly." };
  }
  const divisor = scaled.reduce((g, s) => gcd(g, s), 0);
  const simplified = scaled.map((s) => s / divisor);

  const [a, b] = terms;
  return {
    ok: true,
    value: {
      scaled,
      scale,
      divisor,
      simplified,
      decimal: terms.length === 2 && b !== 0 ? a / b : null,
      unitForm: a !== 0 ? terms.map((t) => t / a) : null,
    },
  };
}

export type ProportionKey = "a" | "b" | "c" | "d";

export interface ProportionSolution {
  missing: ProportionKey;
  value: number;
  /** Human-readable formula used, e.g. "A = B × C ÷ D". */
  formula: string;
  numerator: number;
  denominator: number;
}

/**
 * Solves A : B = C : D (A·D = B·C) for the one term that is `null`.
 */
export function solveProportion(values: Record<ProportionKey, number | null>): CalcResult<ProportionSolution> {
  const missing = (Object.keys(values) as ProportionKey[]).filter((k) => values[k] === null);
  if (missing.length !== 1) {
    return { ok: false, error: "Leave exactly one of the four boxes empty — that's the value to solve for." };
  }
  const key = missing[0];
  const { a, b, c, d } = values;
  let numerator = 0;
  let denominator = 0;
  let formula = "";
  let zeroName = "";
  switch (key) {
    case "a":
      numerator = (b as number) * (c as number);
      denominator = d as number;
      formula = "A = B × C ÷ D";
      zeroName = "D";
      break;
    case "b":
      numerator = (a as number) * (d as number);
      denominator = c as number;
      formula = "B = A × D ÷ C";
      zeroName = "C";
      break;
    case "c":
      numerator = (a as number) * (d as number);
      denominator = b as number;
      formula = "C = A × D ÷ B";
      zeroName = "B";
      break;
    case "d":
      numerator = (b as number) * (c as number);
      denominator = a as number;
      formula = "D = B × C ÷ A";
      zeroName = "A";
      break;
  }
  if (denominator === 0) {
    return {
      ok: false,
      error: `${zeroName} is 0, so there's no single answer: the proportion can't be solved by dividing by zero.`,
    };
  }
  const value = numerator / denominator;
  if (!Number.isFinite(value)) return { ok: false, error: "The answer is too large to calculate reliably." };
  return { ok: true, value: { missing: key, value, formula, numerator, denominator } };
}

export interface RatioShares {
  sumOfParts: number;
  perPart: number;
  shares: number[];
}

export function divideInRatio(total: number, parts: number[]): CalcResult<RatioShares> {
  if (parts.some((p) => p < 0)) return { ok: false, error: "Ratio parts can't be negative." };
  const sumOfParts = parts.reduce((s, p) => s + p, 0);
  if (sumOfParts === 0) return { ok: false, error: "The ratio parts add up to 0, so the total can't be shared out." };
  const perPart = total / sumOfParts;
  return { ok: true, value: { sumOfParts, perPart, shares: parts.map((p) => p * perPart) } };
}
