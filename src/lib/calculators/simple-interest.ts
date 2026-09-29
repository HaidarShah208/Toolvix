import type { CalcResult } from "@/lib/calculators/percentage";
import { roundTo } from "@/lib/utils/number";

export type TimeUnit = "years" | "months" | "days";

export const MAX_RATE = 1000;
export const MAX_YEARS = 1000;
export const MAX_BREAKDOWN_ROWS = 100;

/** Converts a time value to years. Days use a 365-day year. */
export function toYears(time: number, unit: TimeUnit): number {
  if (unit === "months") return time / 12;
  if (unit === "days") return time / 365;
  return time;
}

export interface InterestYearRow {
  /** Year number; fractional for the final partial year. */
  year: number;
  /** Length of this row in years (1, or less for the final partial year). */
  span: number;
  interest: number;
  cumulativeInterest: number;
  balance: number;
}

export interface SimpleInterestResult {
  years: number;
  interest: number;
  total: number;
  yearlyInterest: number;
  breakdown: InterestYearRow[];
  /** True when the breakdown was cut short at MAX_BREAKDOWN_ROWS. */
  truncated: boolean;
}

export function calculateSimpleInterest(
  principal: number,
  ratePercent: number,
  time: number,
  unit: TimeUnit,
): CalcResult<SimpleInterestResult> {
  if (principal < 0) return { ok: false, error: "Principal cannot be negative." };
  if (ratePercent < 0 || ratePercent > MAX_RATE) {
    return { ok: false, error: `Interest rate must be between 0% and ${MAX_RATE}%.` };
  }
  if (!(time > 0)) return { ok: false, error: "Time must be greater than zero." };
  const years = toYears(time, unit);
  if (years > MAX_YEARS) return { ok: false, error: `Time can be at most ${MAX_YEARS} years.` };

  const yearlyInterest = (principal * ratePercent) / 100;
  const interest = yearlyInterest * years;

  const breakdown: InterestYearRow[] = [];
  let truncated = false;
  if (years >= 1) {
    const whole = Math.floor(roundTo(years, 9));
    const partial = roundTo(years - whole, 9);
    const rowCount = whole + (partial > 0 ? 1 : 0);
    const shown = Math.min(rowCount, MAX_BREAKDOWN_ROWS);
    truncated = rowCount > MAX_BREAKDOWN_ROWS;
    for (let i = 1; i <= shown; i++) {
      const span = i <= whole ? 1 : partial;
      const elapsed = i <= whole ? i : years;
      const cumulative = yearlyInterest * elapsed;
      breakdown.push({
        year: roundTo(elapsed, 6),
        span,
        interest: roundTo(yearlyInterest * span),
        cumulativeInterest: roundTo(cumulative),
        balance: roundTo(principal + cumulative),
      });
    }
  }

  return {
    ok: true,
    value: {
      years,
      interest: roundTo(interest),
      total: roundTo(principal + interest),
      yearlyInterest: roundTo(yearlyInterest),
      breakdown,
      truncated,
    },
  };
}
