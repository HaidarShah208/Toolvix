/** Calendar date without time or time zone. Months are 1–12. */
export interface CalendarDate {
  year: number;
  month: number;
  day: number;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/** Parses "YYYY-MM-DD" (the value of <input type="date">). Rejects impossible dates such as 2023-02-29. */
export function parseISODate(value: string): CalendarDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < 1 || month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function toISODate(d: CalendarDate): string {
  return `${String(d.year).padStart(4, "0")}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

/** Days since 1970-01-01, computed in UTC so daylight saving never interferes. */
export function toDayNumber(d: CalendarDate): number {
  const date = new Date(Date.UTC(2000, d.month - 1, d.day));
  date.setUTCFullYear(d.year);
  return Math.round(date.getTime() / 86_400_000);
}

export function fromDayNumber(n: number): CalendarDate {
  const date = new Date(n * 86_400_000);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function compareDates(a: CalendarDate, b: CalendarDate): number {
  return toDayNumber(a) - toDayNumber(b);
}

/** Today's date in the user's local time zone. Call only on the client. */
export function today(): CalendarDate {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

export interface YMD {
  years: number;
  months: number;
  days: number;
}

/**
 * Whole years, months and days from `start` to `end` (end >= start), counted
 * the way ages are usually stated: complete months first, then leftover days.
 */
export function diffYMD(start: CalendarDate, end: CalendarDate): YMD {
  let years = end.year - start.year;
  let months = end.month - start.month;
  let days = end.day - start.day;

  if (days < 0) {
    months -= 1;
    // Borrow the length of the month before `end`'s month.
    const prevMonth = end.month === 1 ? 12 : end.month - 1;
    const prevYear = end.month === 1 ? end.year - 1 : end.year;
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/** Adds whole months, clamping the day to the target month's length (31 Jan + 1 month = 28/29 Feb). */
export function addMonths(d: CalendarDate, months: number): CalendarDate {
  const total = d.year * 12 + (d.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total - year * 12) + 1;
  return { year, month, day: Math.min(d.day, daysInMonth(year, month)) };
}

export function addDays(d: CalendarDate, days: number): CalendarDate {
  return fromDayNumber(toDayNumber(d) + days);
}

/** 0 = Sunday … 6 = Saturday */
export function dayOfWeek(d: CalendarDate): number {
  return (((toDayNumber(d) + 4) % 7) + 7) % 7;
}

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatCalendarDate(d: CalendarDate): string {
  return `${WEEKDAYS[dayOfWeek(d)]}, ${MONTHS[d.month - 1]} ${d.day}, ${d.year}`;
}

export function plural(n: number, word: string, pluralWord = `${word}s`): string {
  return `${n.toLocaleString("en-US")} ${n === 1 ? word : pluralWord}`;
}
