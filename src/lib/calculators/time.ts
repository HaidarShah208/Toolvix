import type { CalcResult } from "@/lib/calculators/percentage";

export interface DurationRow {
  sign: 1 | -1;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Rounds to milliseconds so 0.1 + 0.2 style noise never shows. */
function roundMs(seconds: number): number {
  return Math.round(seconds * 1000) / 1000;
}

export function sumDurations(rows: DurationRow[]): number {
  return roundMs(rows.reduce((t, r) => t + r.sign * (r.hours * 3600 + r.minutes * 60 + r.seconds), 0));
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function secondsPart(s: number): string {
  const whole = Math.floor(s);
  const frac = roundMs(s - whole);
  if (frac === 0) return pad2(whole);
  return `${pad2(whole)}${String(frac).slice(1)}`;
}

/** Formats seconds as h:mm:ss (with a leading − for negatives). */
export function formatHMS(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? "−" : "";
  const abs = roundMs(Math.abs(totalSeconds));
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs - h * 3600) / 60);
  const s = roundMs(abs - h * 3600 - m * 60);
  return `${sign}${h.toLocaleString("en-US")}:${pad2(m)}:${secondsPart(s)}`;
}

export interface DurationBreakdown {
  negative: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function breakdown(totalSeconds: number): DurationBreakdown {
  const abs = roundMs(Math.abs(totalSeconds));
  const days = Math.floor(abs / 86400);
  const hours = Math.floor((abs - days * 86400) / 3600);
  const minutes = Math.floor((abs - days * 86400 - hours * 3600) / 60);
  const seconds = roundMs(abs - days * 86400 - hours * 3600 - minutes * 60);
  return { negative: totalSeconds < 0, days, hours, minutes, seconds };
}

/** Parses "HH:MM" or "HH:MM:SS" (24-hour) into seconds after midnight. */
export function parseClock(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  const s = m[3] ? Number(m[3]) : 0;
  if (h > 23 || min > 59 || s > 59) return null;
  return h * 3600 + min * 60 + s;
}

export interface ClockSpan {
  /** End is earlier than start, so it must be on the next day. */
  autoNextDay: boolean;
  nextDay: boolean;
  grossSeconds: number;
  breakSeconds: number;
  netSeconds: number;
}

export function clockDifference(
  startSec: number,
  endSec: number,
  forceNextDay: boolean,
  breakMinutes: number,
): CalcResult<ClockSpan> {
  const autoNextDay = endSec < startSec;
  const nextDay = autoNextDay || forceNextDay;
  const grossSeconds = endSec - startSec + (nextDay ? 86400 : 0);
  const breakSeconds = roundMs(breakMinutes * 60);
  if (breakMinutes < 0) return { ok: false, error: "Break minutes cannot be negative." };
  if (breakSeconds > grossSeconds) {
    return { ok: false, error: "The break is longer than the time between the start and end." };
  }
  return {
    ok: true,
    value: { autoNextDay, nextDay, grossSeconds, breakSeconds, netSeconds: roundMs(grossSeconds - breakSeconds) },
  };
}
