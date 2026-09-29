import type { CalcResult } from "@/lib/calculators/percentage";
import {
  addDays,
  addMonths,
  dayOfWeek,
  diffYMD,
  toDayNumber,
  type CalendarDate,
  type YMD,
} from "@/lib/utils/date";

export interface DateDifference {
  /** True when the end date was before the start date and the two were swapped. */
  swapped: boolean;
  start: CalendarDate;
  end: CalendarDate;
  includeEnd: boolean;
  ymd: YMD;
  totalDays: number;
  weeks: number;
  remainingDays: number;
  totalMonths: number;
  /** Monday–Friday days in the counted span. No public holidays are removed. */
  businessDays: number;
  weekendDays: number;
}

/**
 * Counts the days from `start` up to (but not including) `end`. With
 * `includeEnd`, the end date itself is counted too, adding one day.
 */
export function dateDifference(a: CalendarDate, b: CalendarDate, includeEnd: boolean): DateDifference {
  const swapped = toDayNumber(b) < toDayNumber(a);
  const start = swapped ? b : a;
  const end = swapped ? a : b;
  const endExclusive = includeEnd ? addDays(end, 1) : end;

  const startN = toDayNumber(start);
  const totalDays = toDayNumber(endExclusive) - startN;
  const ymd = diffYMD(start, endExclusive);

  // Count weekdays in [start, endExclusive): whole weeks contribute 5 each.
  const fullWeeks = Math.floor(totalDays / 7);
  let businessDays = fullWeeks * 5;
  const startDow = dayOfWeek(start);
  for (let i = 0; i < totalDays % 7; i++) {
    const dow = (startDow + i) % 7;
    if (dow !== 0 && dow !== 6) businessDays += 1;
  }

  return {
    swapped,
    start,
    end,
    includeEnd,
    ymd,
    totalDays,
    weeks: fullWeeks,
    remainingDays: totalDays % 7,
    totalMonths: ymd.years * 12 + ymd.months,
    businessDays,
    weekendDays: totalDays - businessDays,
  };
}

export interface DateOffset {
  years: number;
  months: number;
  weeks: number;
  days: number;
}

/**
 * Adds (sign = 1) or subtracts (sign = −1) an offset. Years and months are
 * applied first (clamping to the end of shorter months), then weeks and days.
 */
export function shiftDate(date: CalendarDate, offset: DateOffset, sign: 1 | -1): CalcResult<{ result: CalendarDate; clamped: boolean }> {
  const totalMonths = sign * (offset.years * 12 + offset.months);
  const afterMonths = addMonths(date, totalMonths);
  const clamped = afterMonths.day !== date.day;
  if (afterMonths.year < 1 || afterMonths.year > 9999) {
    return { ok: false, error: "The result falls outside the years 1 to 9999." };
  }
  const result = addDays(afterMonths, sign * (offset.weeks * 7 + offset.days));
  if (result.year < 1 || result.year > 9999 || toDayNumber(result) < toDayNumber({ year: 1, month: 1, day: 1 })) {
    return { ok: false, error: "The result falls outside the years 1 to 9999." };
  }
  return { ok: true, value: { result, clamped } };
}
