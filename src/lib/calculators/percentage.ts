import { roundTo } from "@/lib/utils/number";

export type CalcResult<T> = { ok: true; value: T } | { ok: false; error: string };

/** X% of Y */
export function percentOf(percent: number, whole: number): CalcResult<number> {
  return { ok: true, value: roundTo((percent / 100) * whole) };
}

/** X is what percent of Y */
export function whatPercent(part: number, whole: number): CalcResult<number> {
  if (whole === 0) {
    return { ok: false, error: "The whole (Y) cannot be zero, because a percentage of zero is undefined." };
  }
  return { ok: true, value: roundTo((part / whole) * 100) };
}

/** Percentage change from `from` to `to`. Positive = increase. */
export function percentChange(from: number, to: number): CalcResult<{ change: number; difference: number }> {
  if (from === 0) {
    return {
      ok: false,
      error: "The starting value cannot be zero. Percentage change from zero is undefined.",
    };
  }
  return {
    ok: true,
    value: {
      change: roundTo(((to - from) / Math.abs(from)) * 100),
      difference: roundTo(to - from),
    },
  };
}

/** X is P% of what number? */
export function wholeFromPercent(part: number, percent: number): CalcResult<number> {
  if (percent === 0) {
    return { ok: false, error: "The percentage cannot be zero when solving for the whole." };
  }
  return { ok: true, value: roundTo(part / (percent / 100)) };
}
