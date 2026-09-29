import type { CalcResult } from "@/lib/calculators/percentage";
import {
  addMonths,
  compareDates,
  dayOfWeek,
  daysInMonth,
  isLeapYear,
  toDayNumber,
  type CalendarDate,
  type YMD,
} from "@/lib/utils/date";

export interface AgeResult {
  age: YMD;
  totalMonths: number;
  totalWeeks: number;
  /** Days left over after whole weeks. */
  weekRemainderDays: number;
  totalDays: number;
  /** 0 = Sunday … 6 = Saturday */
  bornWeekday: number;
  nextBirthday: CalendarDate;
  daysUntilBirthday: number;
  /** Age reached on the next birthday. */
  turning: number;
  isBirthdayToday: boolean;
  /** Born on 29 February. */
  leapDayBirth: boolean;
  /** The next birthday falls in a common year, so it is observed on 28 February. */
  birthdayMovedTo28Feb: boolean;
}

/** The birthday observed in `year`: 29 Feb becomes 28 Feb in common years. */
export function birthdayInYear(dob: CalendarDate, year: number): CalendarDate {
  return { year, month: dob.month, day: Math.min(dob.day, daysInMonth(year, dob.month)) };
}

/**
 * Age from `dob` to `on`. Whole months are counted by stepping forward from the
 * birth date, clamping to the month length, so someone born on 29 February
 * turns a year older on 28 February in common years.
 */
export function calculateAge(dob: CalendarDate, on: CalendarDate): CalcResult<AgeResult> {
  if (compareDates(dob, on) > 0) {
    return {
      ok: false,
      error: "The date of birth is after the date you are calculating the age on. Check both dates.",
    };
  }

  let months = (on.year - dob.year) * 12 + (on.month - dob.month);
  while (months > 0 && compareDates(addMonths(dob, months), on) > 0) months -= 1;
  const anchor = addMonths(dob, months);
  const days = toDayNumber(on) - toDayNumber(anchor);
  const totalDays = toDayNumber(on) - toDayNumber(dob);

  let bYear = on.year;
  let next = birthdayInYear(dob, bYear);
  if (compareDates(next, on) < 0 || (bYear === dob.year)) {
    bYear += 1;
    next = birthdayInYear(dob, bYear);
  }
  const daysUntil = toDayNumber(next) - toDayNumber(on);
  const leapDayBirth = dob.month === 2 && dob.day === 29;

  return {
    ok: true,
    value: {
      age: { years: Math.floor(months / 12), months: months % 12, days },
      totalMonths: months,
      totalWeeks: Math.floor(totalDays / 7),
      weekRemainderDays: totalDays % 7,
      totalDays,
      bornWeekday: dayOfWeek(dob),
      nextBirthday: next,
      daysUntilBirthday: daysUntil,
      turning: bYear - dob.year,
      isBirthdayToday: daysUntil === 0,
      leapDayBirth,
      birthdayMovedTo28Feb: leapDayBirth && !isLeapYear(bYear),
    },
  };
}
