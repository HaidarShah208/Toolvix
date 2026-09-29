import { utf8Bytes } from "@/lib/text/segment";

export type Indent = "2" | "4" | "tab";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function indentUnit(indent: Indent): string {
  return indent === "tab" ? "\t" : " ".repeat(Number(indent));
}

/**
 * Serialises a parsed JSON value. Unlike JSON.stringify with a replacer,
 * this keeps the requested key order even for integer-like keys (which
 * JavaScript objects always enumerate first) and handles "__proto__" keys.
 */
export function stringifyJson(value: unknown, opts: { indent: Indent | null; sortKeys: boolean }): string {
  const unit = opts.indent === null ? "" : indentUnit(opts.indent);
  const nl = opts.indent === null ? "" : "\n";
  const colon = opts.indent === null ? ":" : ": ";

  function write(v: Json, depth: number): string {
    if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
    const pad = unit.repeat(depth + 1);
    const close = unit.repeat(depth);
    if (Array.isArray(v)) {
      if (v.length === 0) return "[]";
      return `[${nl}${v.map((item) => pad + write(item, depth + 1)).join(`,${nl}`)}${nl}${close}]`;
    }
    let keys = Object.keys(v);
    if (keys.length === 0) return "{}";
    if (opts.sortKeys) keys = [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    const parts = keys.map((k) => `${pad}${JSON.stringify(k)}${colon}${write(v[k], depth + 1)}`);
    return `{${nl}${parts.join(`,${nl}`)}${nl}${close}}`;
  }

  return write(value as Json, 0);
}

export interface JsonSummary {
  rootType: "object" | "array" | "string" | "number" | "boolean" | "null";
  /** Keys for an object root, items for an array root, otherwise 0. */
  rootSize: number;
  objects: number;
  arrays: number;
  strings: number;
  numbers: number;
  booleans: number;
  nulls: number;
  /** Depth of nesting; a scalar root is 0, `{}` is 1. */
  maxDepth: number;
  bytes: number;
}

function typeOf(v: unknown): JsonSummary["rootType"] {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  const t = typeof v;
  return t === "object" || t === "string" || t === "number" || t === "boolean" ? t : "null";
}

/** Counts every value in a parsed document (iteratively, so deep input cannot overflow the stack). */
export function summarizeJson(value: unknown, source: string): JsonSummary {
  const s: JsonSummary = {
    rootType: typeOf(value),
    rootSize: Array.isArray(value) ? value.length : value && typeof value === "object" ? Object.keys(value).length : 0,
    objects: 0,
    arrays: 0,
    strings: 0,
    numbers: 0,
    booleans: 0,
    nulls: 0,
    maxDepth: 0,
    bytes: utf8Bytes(source),
  };
  const stack: { v: unknown; d: number }[] = [{ v: value, d: 0 }];
  while (stack.length) {
    const { v, d } = stack.pop()!;
    const t = typeOf(v);
    if (t === "array") {
      s.arrays++;
      s.maxDepth = Math.max(s.maxDepth, d + 1);
      for (const item of v as unknown[]) stack.push({ v: item, d: d + 1 });
    } else if (t === "object") {
      s.objects++;
      s.maxDepth = Math.max(s.maxDepth, d + 1);
      for (const item of Object.values(v as Record<string, unknown>)) stack.push({ v: item, d: d + 1 });
    } else if (t === "string") s.strings++;
    else if (t === "number") s.numbers++;
    else if (t === "boolean") s.booleans++;
    else s.nulls++;
  }
  return s;
}

export const SAMPLE_JSON = `{
  "orderId": "ORD-2024-10583",
  "createdAt": "2024-11-18T14:32:07Z",
  "status": "shipped",
  "customer": {
    "name": "Maria Lopez",
    "email": "maria.lopez@example.com",
    "loyaltyMember": true
  },
  "items": [
    { "sku": "KB-104", "name": "Mechanical keyboard", "quantity": 1, "unitPrice": 89.99 },
    { "sku": "MS-220", "name": "Wireless mouse", "quantity": 2, "unitPrice": 24.5 }
  ],
  "shipping": {
    "carrier": "UPS",
    "trackingNumber": "1Z999AA10123456784",
    "address": { "city": "Austin", "state": "TX", "postalCode": "78701", "country": "US" }
  },
  "discountCode": null,
  "total": 138.99
}`;
