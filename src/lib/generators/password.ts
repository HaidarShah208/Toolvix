import { randomPick, secureShuffle } from "./random";

export const PASSWORD_MIN = 4;
export const PASSWORD_MAX = 128;

export interface PasswordOptions {
  length: number;
  upper: boolean;
  lower: boolean;
  digits: boolean;
  symbols: boolean;
  excludeLookAlike: boolean;
  requireEach: boolean;
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 16,
  upper: true,
  lower: true,
  digits: true,
  symbols: true,
  excludeLookAlike: false,
  requireEach: true,
};

const SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~|",
} as const;

const LOOK_ALIKE = new Set(["I", "l", "1", "O", "0"]);

/** The character groups selected by the options, with look-alikes removed if requested. */
export function characterGroups(o: PasswordOptions): string[][] {
  const groups: string[][] = [];
  (Object.keys(SETS) as (keyof typeof SETS)[]).forEach((key) => {
    if (!o[key]) return;
    let chars = Array.from(SETS[key]);
    if (o.excludeLookAlike) chars = chars.filter((c) => !LOOK_ALIKE.has(c));
    groups.push(chars);
  });
  return groups;
}

export function poolSize(o: PasswordOptions): number {
  return characterGroups(o).reduce((n, g) => n + g.length, 0);
}

/** Entropy in bits for a uniformly random password: length × log2(pool size). */
export function entropyBits(length: number, pool: number): number {
  if (pool < 2 || length < 1) return 0;
  return length * Math.log2(pool);
}

export type StrengthLabel = "Very weak" | "Weak" | "Fair" | "Strong" | "Very strong";

export function strengthLabel(bits: number): StrengthLabel {
  if (bits < 28) return "Very weak";
  if (bits < 36) return "Weak";
  if (bits < 60) return "Fair";
  if (bits < 128) return "Strong";
  return "Very strong";
}

export type PasswordResult = { ok: true; value: string } | { ok: false; error: string };

export function generatePassword(o: PasswordOptions): PasswordResult {
  const groups = characterGroups(o);
  if (groups.length === 0) {
    return { ok: false, error: "Select at least one character type (uppercase, lowercase, numbers or symbols)." };
  }
  if (!Number.isInteger(o.length) || o.length < PASSWORD_MIN || o.length > PASSWORD_MAX) {
    return { ok: false, error: `Length must be a whole number from ${PASSWORD_MIN} to ${PASSWORD_MAX}.` };
  }
  const pool = groups.flat();
  const chars: string[] = [];
  if (o.requireEach) {
    for (const g of groups) chars.push(randomPick(g));
  }
  while (chars.length < o.length) chars.push(randomPick(pool));
  // Shuffle so the guaranteed characters are not always at the start.
  return { ok: true, value: secureShuffle(chars).join("") };
}
