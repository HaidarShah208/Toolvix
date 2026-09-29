/**
 * Cryptographically secure, unbiased random helpers built on
 * crypto.getRandomValues. Call only in the browser from event handlers or
 * after mount, never during server rendering.
 */

const TWO_32 = 0x1_0000_0000;
const TWO_53 = 2 ** 53;

export function hasSecureRandom(): boolean {
  return typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function";
}

function uint32(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

/**
 * Uniform integer in [0, n) for 1 ≤ n ≤ 2^53, using rejection sampling so
 * no value is more likely than another (no modulo bias).
 */
export function randomBelow(n: number): number {
  if (!Number.isInteger(n) || n < 1 || n > TWO_53) {
    throw new RangeError("randomBelow: n must be an integer between 1 and 2^53.");
  }
  if (n === 1) return 0;
  if (n <= TWO_32) {
    // Largest multiple of n that fits in 32 bits; reject draws above it.
    const limit = TWO_32 - (TWO_32 % n);
    let x: number;
    do x = uint32();
    while (x >= limit);
    return x % n;
  }
  // Two 32-bit draws give 53 uniform bits (21 high + 32 low).
  const limit = TWO_53 - (TWO_53 % n);
  let x: number;
  do x = (uint32() & 0x1f_ffff) * TWO_32 + uint32();
  while (x >= limit);
  return x % n;
}

/** Uniform integer in [min, max] inclusive. Requires max − min + 1 ≤ 2^53. */
export function randomInt(min: number, max: number): number {
  return min + randomBelow(max - min + 1);
}

/** In-place Fisher–Yates shuffle driven by secure randomness. */
export function secureShuffle<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1);
    const tmp = items[i];
    items[i] = items[j];
    items[j] = tmp;
  }
  return items;
}

/** Picks one element uniformly at random. */
export function randomPick<T>(items: readonly T[]): T {
  return items[randomBelow(items.length)];
}

export function randomBytes(length: number): Uint8Array {
  const buf = new Uint8Array(length);
  crypto.getRandomValues(buf);
  return buf;
}
