/**
 * Time zone helpers built on Intl.DateTimeFormat. Converts a wall-clock time
 * in an IANA zone to an absolute instant, detecting daylight-saving gaps
 * (times that never happen) and overlaps (times that happen twice).
 */

/** Used when Intl.supportedValuesOf is unavailable. */
export const FALLBACK_TIME_ZONES = [
  "UTC",
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Denver",
  "America/Chicago",
  "America/Mexico_City",
  "America/New_York",
  "America/Toronto",
  "America/Bogota",
  "America/Halifax",
  "America/Sao_Paulo",
  "America/Argentina/Buenos_Aires",
  "America/St_Johns",
  "Atlantic/Reykjavik",
  "Europe/London",
  "Europe/Dublin",
  "Europe/Lisbon",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Europe/Athens",
  "Europe/Istanbul",
  "Europe/Moscow",
  "Africa/Lagos",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Nairobi",
  "Asia/Dubai",
  "Asia/Tehran",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Asia/Dhaka",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Manila",
  "Asia/Seoul",
  "Asia/Tokyo",
  "Australia/Perth",
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Sydney",
  "Pacific/Auckland",
];

export const DEFAULT_TARGET_ZONES = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Australia/Sydney",
];

let zoneCache: string[] | null = null;

/** All IANA zones the runtime knows, always including "UTC". Call only on the client. */
export function getTimeZones(): string[] {
  if (zoneCache) return zoneCache;
  let list: string[] = [];
  try {
    const intl = Intl as unknown as { supportedValuesOf?: (key: string) => string[] };
    if (typeof intl.supportedValuesOf === "function") list = intl.supportedValuesOf("timeZone");
  } catch {
    list = [];
  }
  // Some engines list legacy canonical names (e.g. Asia/Calcutta); merge in the
  // modern names people search for.
  const set = new Set(list);
  for (const z of FALLBACK_TIME_ZONES) set.add(z);
  set.delete("UTC");
  list = ["UTC", ...Array.from(set).sort()];
  zoneCache = list;
  return list;
}

const formatterCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(zone: string): Intl.DateTimeFormat {
  let f = formatterCache.get(zone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
      era: "short",
    });
    formatterCache.set(zone, f);
  }
  return f;
}

/** Returns the canonical spelling of a zone (case-insensitive), or null if unknown. */
export function normalizeTimeZone(input: string, known?: readonly string[]): string | null {
  const raw = input.trim().replace(/\s+/g, "_");
  if (!raw) return null;
  if (/^(utc|gmt|z)$/i.test(raw)) return "UTC";
  const lower = raw.toLowerCase();
  const match =
    known?.find((z) => z.toLowerCase() === lower) ?? FALLBACK_TIME_ZONES.find((z) => z.toLowerCase() === lower);
  const candidate = match ?? raw;
  try {
    const resolved = new Intl.DateTimeFormat("en-US", { timeZone: candidate }).resolvedOptions().timeZone;
    return match ?? resolved ?? candidate;
  } catch {
    return null;
  }
}

export interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: string;
}

export function getZonedParts(instant: number, zone: string): ZonedParts {
  const parts = partsFormatter(zone).formatToParts(new Date(instant));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  let year = Number(get("year"));
  if (get("era") === "BC" || get("era") === "B") year = 1 - year;
  const hour = Number(get("hour")) % 24;
  return {
    year,
    month: Number(get("month")),
    day: Number(get("day")),
    hour,
    minute: Number(get("minute")),
    second: Number(get("second")),
    weekday: get("weekday"),
  };
}

function utcFromParts(p: { year: number; month: number; day: number; hour: number; minute: number; second?: number }) {
  const d = new Date(Date.UTC(2000, p.month - 1, p.day, p.hour, p.minute, p.second ?? 0));
  d.setUTCFullYear(p.year);
  return d.getTime();
}

/** Offset of the zone from UTC at the given instant, in minutes (e.g. +330 for India). */
export function getOffsetMinutes(instant: number, zone: string): number {
  const whole = Math.floor(instant / 1000) * 1000;
  const local = utcFromParts(getZonedParts(whole, zone));
  return Math.round((local - whole) / 60_000);
}

/** "UTC+05:30", "UTC-04:00", "UTC+00:00". */
export function formatOffset(minutes: number): string {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

export interface WallTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export type ResolveResult =
  | { kind: "exact"; instant: number; offset: number }
  | {
      kind: "ambiguous";
      /** First occurrence (before clocks go back). */
      earlier: { instant: number; offset: number };
      later: { instant: number; offset: number };
    }
  | {
      kind: "gap";
      /** The instant the wall time maps to if the old offset still applied (i.e. shifted forward). */
      instant: number;
      offsetBefore: number;
      offsetAfter: number;
    };

/**
 * Converts a wall-clock time in `zone` to an instant. Tries every offset in
 * force within a day either side and keeps the ones that round-trip.
 */
export function resolveWallTime(wall: WallTime, zone: string): ResolveResult {
  const local = utcFromParts(wall);
  const DAY = 86_400_000;
  const candidates = new Set<number>([
    getOffsetMinutes(local - DAY, zone),
    getOffsetMinutes(local, zone),
    getOffsetMinutes(local + DAY, zone),
  ]);
  const valid: { instant: number; offset: number }[] = [];
  for (const offset of candidates) {
    const instant = local - offset * 60_000;
    if (getOffsetMinutes(instant, zone) === offset) valid.push({ instant, offset });
  }
  valid.sort((a, b) => a.instant - b.instant);
  if (valid.length === 1) return { kind: "exact", ...valid[0] };
  if (valid.length >= 2) return { kind: "ambiguous", earlier: valid[0], later: valid[valid.length - 1] };
  const offsetBefore = getOffsetMinutes(local - DAY, zone);
  const offsetAfter = getOffsetMinutes(local + DAY, zone);
  return { kind: "gap", instant: local - offsetBefore * 60_000, offsetBefore, offsetAfter };
}

export interface ZonedDisplay {
  zone: string;
  isoDate: string;
  /** e.g. "Mon, 2 Nov 2026" */
  dateLabel: string;
  weekday: string;
  /** 24-hour "14:30" */
  time24: string;
  /** "2:30 PM" */
  time12: string;
  offset: number;
  offsetLabel: string;
  /** Calendar-day difference from the reference date (e.g. +1 = next day). */
  dayDiff: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function describeInstant(instant: number, zone: string, reference?: WallTime): ZonedDisplay {
  const p = getZonedParts(instant, zone);
  const offset = getOffsetMinutes(instant, zone);
  const pad = (n: number) => String(n).padStart(2, "0");
  const h12 = p.hour % 12 === 0 ? 12 : p.hour % 12;
  const dayNum = (y: number, m: number, d: number) => Math.round(utcFromParts({ year: y, month: m, day: d, hour: 0, minute: 0 }) / 86_400_000);
  const dayDiff = reference ? dayNum(p.year, p.month, p.day) - dayNum(reference.year, reference.month, reference.day) : 0;
  return {
    zone,
    isoDate: `${String(p.year).padStart(4, "0")}-${pad(p.month)}-${pad(p.day)}`,
    dateLabel: `${p.weekday}, ${p.day} ${MONTHS[p.month - 1]} ${p.year}`,
    weekday: p.weekday,
    time24: `${pad(p.hour)}:${pad(p.minute)}`,
    time12: `${h12}:${pad(p.minute)} ${p.hour < 12 ? "AM" : "PM"}`,
    offset,
    offsetLabel: formatOffset(offset),
    dayDiff,
  };
}

export function dayDiffLabel(diff: number): string {
  if (diff === 0) return "Same day";
  return `(${diff > 0 ? "+" : "−"}${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"})`;
}

/** Parses "HH:MM" or "HH:MM:SS" from <input type="time">. */
export function parseTime(value: string): { hour: number; minute: number } | null {
  const m = /^(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?$/.exec(value.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

/** The runtime's own zone (client only). */
export function getLocalTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}
