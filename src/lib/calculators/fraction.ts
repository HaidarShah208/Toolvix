import type { CalcResult } from "@/lib/calculators/percentage";

/** A fraction with an always-positive denominator. BigInt keeps every step exact. */
export interface Fraction {
  n: bigint;
  d: bigint;
}

export interface FractionFields {
  whole: string;
  numerator: string;
  denominator: string;
}

export type FractionOp = "add" | "subtract" | "multiply" | "divide";

export const OP_SYMBOL: Record<FractionOp, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const TEN = BigInt(10);
const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);

const TOO_LARGE =
  "The numbers involved grow beyond 9,007,199,254,740,991 (the largest whole number we handle exactly). Try smaller values.";

function abs(x: bigint): bigint {
  return x < ZERO ? -x : x;
}

export function bigGcd(a: bigint, b: bigint): bigint {
  a = abs(a);
  b = abs(b);
  while (b !== ZERO) {
    [a, b] = [b, a % b];
  }
  return a;
}

function safe(...values: bigint[]): boolean {
  return values.every((v) => abs(v) <= MAX_SAFE);
}

/** Formats a BigInt with digit grouping and a proper minus sign. */
export function formatBig(x: bigint): string {
  const s = abs(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return x < ZERO ? `−${s}` : s;
}

export function fractionText(f: Fraction): string {
  return f.d === ONE ? formatBig(f.n) : `${formatBig(f.n)}/${formatBig(f.d)}`;
}

export function isFieldsEmpty(f: FractionFields): boolean {
  return f.whole.trim() === "" && f.numerator.trim() === "" && f.denominator.trim() === "";
}

function parseInteger(raw: string, label: string): CalcResult<bigint> {
  const s = raw.trim().replace(/[−–]/g, "-").replace(/[\s,_]/g, "");
  if (!/^[-+]?\d+$/.test(s)) return { ok: false, error: `${label} must be a whole number (no decimals).` };
  const v = BigInt(s.replace(/^\+/, ""));
  if (abs(v) > MAX_SAFE) return { ok: false, error: `${label} is too large.` };
  return { ok: true, value: v };
}

/** Reads a (possibly mixed) fraction from its three text fields. */
export function parseFraction(fields: FractionFields, name: string): CalcResult<Fraction> {
  const hasWhole = fields.whole.trim() !== "";
  const hasNum = fields.numerator.trim() !== "";
  const hasDen = fields.denominator.trim() !== "";

  if (!hasWhole && !hasNum && !hasDen) return { ok: false, error: `Enter ${name}.` };
  if (hasNum && !hasDen) return { ok: false, error: `Enter a denominator for ${name}.` };
  if (hasDen && !hasNum) return { ok: false, error: `Enter a numerator for ${name}.` };

  let whole = ZERO;
  let wholeNegative = false;
  if (hasWhole) {
    const w = parseInteger(fields.whole, `The whole number in ${name}`);
    if (!w.ok) return w;
    whole = w.value;
    wholeNegative = fields.whole.trim().replace(/−/g, "-").startsWith("-");
  }
  if (!hasNum) return { ok: true, value: { n: whole, d: ONE } };

  const n = parseInteger(fields.numerator, `The numerator of ${name}`);
  if (!n.ok) return n;
  const d = parseInteger(fields.denominator, `The denominator of ${name}`);
  if (!d.ok) return d;
  if (d.value === ZERO) return { ok: false, error: `The denominator of ${name} can't be 0 — division by zero is undefined.` };

  if (hasWhole) {
    if (n.value < ZERO || d.value < ZERO) {
      return { ok: false, error: `In a mixed number, put the minus sign on the whole number only (${name}).` };
    }
    const magnitude = abs(whole) * d.value + n.value;
    if (!safe(magnitude)) return { ok: false, error: TOO_LARGE };
    return { ok: true, value: { n: wholeNegative ? -magnitude : magnitude, d: d.value } };
  }
  return { ok: true, value: normalize({ n: n.value, d: d.value }) };
}

function normalize(f: Fraction): Fraction {
  return f.d < ZERO ? { n: -f.n, d: -f.d } : f;
}

export interface SimplifyOutcome {
  result: Fraction;
  divisor: bigint;
}

export function simplify(f: Fraction): SimplifyOutcome {
  const nf = normalize(f);
  const g = bigGcd(nf.n, nf.d);
  if (g === ZERO || g === ONE) return { result: nf.n === ZERO ? { n: ZERO, d: ONE } : nf, divisor: g === ZERO ? ONE : g };
  return { result: { n: nf.n / g, d: nf.d / g }, divisor: g };
}

export interface MixedNumber {
  whole: bigint;
  n: bigint;
  d: bigint;
  negative: boolean;
}

export function toMixed(f: Fraction): MixedNumber {
  const negative = f.n < ZERO;
  const a = abs(f.n);
  return { whole: a / f.d, n: a % f.d, d: f.d, negative };
}

export function mixedText(f: Fraction): string {
  const m = toMixed(f);
  const sign = m.negative ? "−" : "";
  if (m.n === ZERO) return `${sign}${formatBig(m.whole)}`;
  if (m.whole === ZERO) return `${sign}${formatBig(m.n)}/${formatBig(m.d)}`;
  return `${sign}${formatBig(m.whole)} ${formatBig(m.n)}/${formatBig(m.d)}`;
}

export interface DecimalForm {
  /** Rounded to at most `places` decimals, trailing zeros trimmed. */
  rounded: string;
  /** True when the decimal ends within the shown places (no rounding happened). */
  exact: boolean;
  /** Repeating notation such as "0.1(6)", when a repeat was found. */
  repeating: string | null;
}

function groupInt(s: string): string {
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function toDecimal(f: Fraction, places = 10): DecimalForm {
  const negative = f.n < ZERO;
  const a = abs(f.n);
  const d = f.d;
  const intPart = a / d;

  // Rounded value (half away from zero).
  const factor = TEN ** BigInt(places);
  const scaled = (a * factor * TWO + d) / (TWO * d);
  const scaledInt = scaled / factor;
  const frac = (scaled % factor).toString().padStart(places, "0").replace(/0+$/, "");
  const roundedAbs = frac ? `${groupInt(scaledInt.toString())}.${frac}` : groupInt(scaledInt.toString());
  const rounded = negative && scaled !== ZERO ? `−${roundedAbs}` : roundedAbs;

  // Long division to detect termination or a repeating block.
  let rem = a % d;
  const seen = new Map<string, number>();
  const digits: string[] = [];
  let repeating: string | null = null;
  let terminatesAt = -1;
  for (let i = 0; i < 200; i++) {
    if (rem === ZERO) {
      terminatesAt = i;
      break;
    }
    const key = rem.toString();
    const prev = seen.get(key);
    if (prev !== undefined) {
      const sign = negative ? "−" : "";
      repeating = `${sign}${groupInt(intPart.toString())}.${digits.slice(0, prev).join("")}(${digits.slice(prev).join("")})`;
      break;
    }
    seen.set(key, i);
    rem *= TEN;
    digits.push((rem / d).toString());
    rem %= d;
  }
  const exact = terminatesAt !== -1 && terminatesAt <= places;
  return { rounded, exact, repeating };
}

export interface FractionCalcOutput {
  a: Fraction;
  b: Fraction;
  raw: Fraction;
  result: Fraction;
  divisor: bigint;
  steps: string[];
}

export function calculateFractions(a: Fraction, b: Fraction, op: FractionOp): CalcResult<FractionCalcOutput> {
  const steps: string[] = [];
  let raw: Fraction;

  if (op === "add" || op === "subtract") {
    const g = bigGcd(a.d, b.d);
    const lcm = (a.d / g) * b.d;
    const an = a.n * (lcm / a.d);
    const bn = b.n * (lcm / b.d);
    const n = op === "add" ? an + bn : an - bn;
    if (!safe(lcm, an, bn, n)) return { ok: false, error: TOO_LARGE };
    if (a.d === b.d) {
      steps.push(`Both fractions already share the denominator ${formatBig(lcm)}.`);
    } else {
      steps.push(`Find a common denominator: LCM(${formatBig(a.d)}, ${formatBig(b.d)}) = ${formatBig(lcm)}.`);
      steps.push(
        `Rewrite each fraction: ${fractionText(a)} = ${formatBig(an)}/${formatBig(lcm)} and ${fractionText(b)} = ${formatBig(bn)}/${formatBig(lcm)}.`,
      );
    }
    steps.push(
      `${op === "add" ? "Add" : "Subtract"} the numerators: ${formatBig(an)} ${OP_SYMBOL[op]} ${bn < ZERO ? `(${formatBig(bn)})` : formatBig(bn)} = ${formatBig(n)}, giving ${formatBig(n)}/${formatBig(lcm)}.`,
    );
    raw = { n, d: lcm };
  } else {
    let right = b;
    if (op === "divide") {
      if (b.n === ZERO) return { ok: false, error: "You can't divide by a fraction equal to zero." };
      right = normalize({ n: b.d, d: b.n });
      steps.push(`Dividing by a fraction means multiplying by its reciprocal: flip ${fractionText(b)} to ${fractionText(right)}.`);
    }
    const n = a.n * right.n;
    const d = a.d * right.d;
    if (!safe(n, d)) return { ok: false, error: TOO_LARGE };
    steps.push(
      `Multiply the numerators and the denominators: (${formatBig(a.n)} × ${formatBig(right.n)}) / (${formatBig(a.d)} × ${formatBig(right.d)}) = ${formatBig(n)}/${formatBig(d)}.`,
    );
    raw = { n, d };
  }

  const { result, divisor } = simplify(raw);
  if (raw.n === ZERO) {
    steps.push("The numerator is 0, so the result is 0.");
  } else if (divisor > ONE) {
    steps.push(
      `Simplify: the greatest common divisor of ${formatBig(abs(raw.n))} and ${formatBig(raw.d)} is ${formatBig(divisor)}, so divide both by it to get ${fractionText(result)}.`,
    );
  } else {
    steps.push(`${fractionText(raw)} is already in its simplest form (GCD = 1).`);
  }
  return { ok: true, value: { a, b, raw, result, divisor, steps } };
}
