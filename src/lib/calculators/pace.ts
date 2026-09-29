import type { CalcResult } from "@/lib/calculators/percentage";

export const KM_PER_MILE = 1.609344;

export type DistanceUnit = "km" | "mi";

export const RACES = [
  { key: "5k", label: "5K", km: 5 },
  { key: "10k", label: "10K", km: 10 },
  { key: "half", label: "Half marathon", km: 21.0975 },
  { key: "marathon", label: "Marathon", km: 42.195 },
] as const;

export function toKm(distance: number, unit: DistanceUnit): number {
  return unit === "km" ? distance : distance * KM_PER_MILE;
}

export function fromKm(km: number, unit: DistanceUnit): number {
  return unit === "km" ? km : km / KM_PER_MILE;
}

/** Converts a pace in seconds per `unit` to seconds per kilometer. */
export function paceToPerKm(secondsPerUnit: number, unit: DistanceUnit): number {
  return unit === "km" ? secondsPerUnit : secondsPerUnit / KM_PER_MILE;
}

export interface PaceSummary {
  distanceKm: number;
  timeSeconds: number;
  paceSecPerKm: number;
  paceSecPerMile: number;
  kmh: number;
  mph: number;
  projections: { key: string; label: string; km: number; seconds: number }[];
}

const MAX_KM = 20_000;
const MAX_SECONDS = 1000 * 3600;

function summarise(distanceKm: number, timeSeconds: number): CalcResult<PaceSummary> {
  if (!(distanceKm > 0) || !(timeSeconds > 0)) return { ok: false, error: "Distance, time and pace must all be greater than zero." };
  if (distanceKm > MAX_KM) return { ok: false, error: "That distance is too large (the limit is 20,000 km)." };
  if (timeSeconds > MAX_SECONDS) return { ok: false, error: "That time is too long (the limit is 1,000 hours)." };
  const paceSecPerKm = timeSeconds / distanceKm;
  const kmh = 3600 / paceSecPerKm;
  return {
    ok: true,
    value: {
      distanceKm,
      timeSeconds,
      paceSecPerKm,
      paceSecPerMile: paceSecPerKm * KM_PER_MILE,
      kmh,
      mph: kmh / KM_PER_MILE,
      projections: RACES.map((r) => ({ key: r.key, label: r.label, km: r.km, seconds: r.km * paceSecPerKm })),
    },
  };
}

export function paceFromDistanceTime(distanceKm: number, timeSeconds: number): CalcResult<PaceSummary> {
  return summarise(distanceKm, timeSeconds);
}

export function timeFromDistancePace(distanceKm: number, paceSecPerKm: number): CalcResult<PaceSummary> {
  if (!(paceSecPerKm > 0)) return { ok: false, error: "Pace must be greater than zero." };
  return summarise(distanceKm, distanceKm * paceSecPerKm);
}

export function distanceFromTimePace(timeSeconds: number, paceSecPerKm: number): CalcResult<PaceSummary> {
  if (!(paceSecPerKm > 0)) return { ok: false, error: "Pace must be greater than zero." };
  return summarise(timeSeconds / paceSecPerKm, timeSeconds);
}

/** h:mm:ss (or m:ss under an hour), rounded to the nearest second. */
export function formatDuration(seconds: number): string {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h.toLocaleString("en-US")}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
}
