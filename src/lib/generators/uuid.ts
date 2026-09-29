import { randomBytes } from "./random";

export type UuidVersion = "v4" | "v7";

export interface UuidFormat {
  uppercase: boolean;
  hyphens: boolean;
  braces: boolean;
}

function toHex(bytes: Uint8Array): string {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
    if (i === 3 || i === 5 || i === 7 || i === 9) hex += "-";
  }
  return hex;
}

/** Random (version 4) UUID. Uses crypto.randomUUID when available. */
export function uuidV4(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const b = randomBytes(16);
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant 10
  return toHex(b);
}

let lastMs = -1;
let lastRandA = 0;

/**
 * Time-ordered (version 7) UUID per RFC 9562: 48-bit big-endian Unix
 * timestamp in milliseconds, 4-bit version (7), 12-bit rand_a, 2-bit
 * variant (10), 62-bit rand_b. Within the same millisecond rand_a is
 * incremented (RFC 9562 §6.2, method 1) so a batch sorts in creation order.
 */
export function uuidV7(nowMs: number = Date.now()): string {
  const b = randomBytes(16);
  let ms = Math.max(0, Math.floor(nowMs));
  let randA = ((b[6] & 0x0f) << 8) | b[7];

  if (ms <= lastMs) {
    ms = lastMs;
    randA = lastRandA + 1;
    if (randA > 0xfff) {
      // Counter exhausted: borrow the next millisecond.
      ms = lastMs + 1;
      randA = ((b[6] & 0x07) << 8) | b[7];
    }
  } else {
    // Leave head-room for increments by clearing rand_a's top bit.
    randA &= 0x7ff;
  }
  lastMs = ms;
  lastRandA = randA;

  // 48-bit timestamp, most significant byte first.
  const hi = Math.floor(ms / 0x1_0000_0000);
  const lo = ms >>> 0;
  b[0] = (hi >>> 8) & 0xff;
  b[1] = hi & 0xff;
  b[2] = (lo >>> 24) & 0xff;
  b[3] = (lo >>> 16) & 0xff;
  b[4] = (lo >>> 8) & 0xff;
  b[5] = lo & 0xff;
  b[6] = 0x70 | ((randA >>> 8) & 0x0f);
  b[7] = randA & 0xff;
  b[8] = (b[8] & 0x3f) | 0x80;
  return toHex(b);
}

export function generateUuids(version: UuidVersion, count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(version === "v7" ? uuidV7() : uuidV4());
  return out;
}

export function formatUuid(uuid: string, f: UuidFormat): string {
  let s = f.hyphens ? uuid : uuid.replace(/-/g, "");
  s = f.uppercase ? s.toUpperCase() : s.toLowerCase();
  return f.braces ? `{${s}}` : s;
}

/** Reads the embedded timestamp from a v7 UUID (milliseconds since the Unix epoch). */
export function uuidV7Timestamp(uuid: string): number | null {
  const hex = uuid.replace(/[^0-9a-f]/gi, "");
  if (hex.length !== 32 || hex[12] !== "7") return null;
  return parseInt(hex.slice(0, 12), 16);
}
