/** Largest magnitude accepted by numeric inputs before we refuse to calculate. */
export const MAX_INPUT = 1e15;

export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

export interface ParseOptions {
  label?: string;
  min?: number;
  max?: number;
  /** Reject zero (e.g. divisors). */
  nonZero?: boolean;
  integer?: boolean;
  /** Defaults to true. */
  allowNegative?: boolean;
}

/**
 * Parses a user-typed number. Accepts thousands separators ("1,250.5") and
 * surrounding whitespace. Returns a friendly error instead of NaN.
 */
export function parseNumber(raw: string, opts: ParseOptions = {}): ParseResult {
  const label = opts.label ?? "Value";
  const cleaned = raw.trim().replace(/[\s_]/g, "").replace(/,(?=\d{3}(?:\D|$))/g, "");
  if (cleaned === "") {
    return { ok: false, error: `${label} is required.` };
  }
  if (!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?$/i.test(cleaned)) {
    return { ok: false, error: `${label} must be a number.` };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value) || Math.abs(value) > MAX_INPUT) {
    return { ok: false, error: `${label} is too large to calculate reliably.` };
  }
  if (opts.allowNegative === false && value < 0) {
    return { ok: false, error: `${label} cannot be negative.` };
  }
  if (opts.integer && !Number.isInteger(value)) {
    return { ok: false, error: `${label} must be a whole number.` };
  }
  if (opts.nonZero && value === 0) {
    return { ok: false, error: `${label} cannot be zero.` };
  }
  if (opts.min !== undefined && value < opts.min) {
    return { ok: false, error: `${label} must be at least ${formatNumber(opts.min)}.` };
  }
  if (opts.max !== undefined && value > opts.max) {
    return { ok: false, error: `${label} must be no more than ${formatNumber(opts.max)}.` };
  }
  return { ok: true, value };
}

/** Rounds away floating point noise such as 0.1 + 0.2 = 0.30000000000000004. */
export function roundTo(value: number, decimals = 10): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function scientific(value: number, digits: number): string {
  const [mantissa, exp] = value.toExponential(digits).split("e");
  const trimmed = mantissa.includes(".") ? mantissa.replace(/\.?0+$/, "") : mantissa;
  return `${trimmed} × 10^${Number(exp)}`;
}

/**
 * Formats a number for display with digit grouping. Very large or very small
 * values switch to scientific notation, and non-finite values render as a
 * dash, so "NaN" or "Infinity" never reach the UI.
 */
export function formatNumber(value: number, maxDecimals = 4, minDecimals = 0): string {
  if (!Number.isFinite(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e15) return scientific(value, 6);
  if (abs !== 0 && abs < 10 ** -maxDecimals) {
    return abs < 1e-12 ? "0" : scientific(value, 3);
  }
  const result = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxDecimals,
    minimumFractionDigits: Math.min(minDecimals, maxDecimals),
  }).format(value);
  return /^-0(\.0+)?$/.test(result) ? result.slice(1) : result;
}

/** Formats as money with two decimals; no currency is assumed. */
export function formatMoney(value: number, symbol = ""): string {
  if (!Number.isFinite(value)) return "—";
  const sign = value < 0 ? "-" : "";
  return `${sign}${symbol}${formatNumber(Math.abs(value), 2, 2)}`;
}

export function formatPercent(value: number, maxDecimals = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${formatNumber(value, maxDecimals)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

/** Number of decimal places in a finite number. */
export function decimalPlaces(value: number): number {
  if (!Number.isFinite(value) || Number.isInteger(value)) return 0;
  const s = value.toString();
  if (s.includes("e-")) {
    const [base, exp] = s.split("e-");
    return (base.split(".")[1]?.length ?? 0) + Number(exp);
  }
  return s.split(".")[1]?.length ?? 0;
}
