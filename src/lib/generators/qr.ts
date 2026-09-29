/**
 * Builds QR code payloads (URL, text, email, phone, Wi-Fi) and checks
 * color choices for scannability. Rendering is done by the `qrcode` package.
 */
import { contrastRatio, hexToRgb, relativeLuminance } from "@/lib/converters/color";

export type QrContentType = "url" | "text" | "email" | "phone" | "wifi";
export type ErrorLevel = "L" | "M" | "Q" | "H";
export type WifiEncryption = "WPA" | "WEP" | "nopass";

export interface QrFields {
  url: string;
  text: string;
  email: string;
  subject: string;
  body: string;
  phone: string;
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export type PayloadResult =
  | { ok: true; payload: string; hint?: string }
  | { ok: false; error: string; field?: keyof QrFields; empty?: boolean };

/** Maximum bytes in byte mode at version 40 for each error correction level. */
export const BYTE_CAPACITY: Record<ErrorLevel, number> = { L: 2953, M: 2331, Q: 1663, H: 1273 };

export function normalizeUrl(input: string): { url: string; added: boolean } | null {
  const raw = input.trim();
  if (!raw || /\s/.test(raw)) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
  const candidate = hasScheme ? raw : `https://${raw}`;
  try {
    const u = new URL(candidate);
    if ((u.protocol === "http:" || u.protocol === "https:") && !/^[^.]+\.[^.]+/.test(u.hostname) && u.hostname !== "localhost") {
      return null;
    }
    return { url: candidate, added: !hasScheme };
  } catch {
    return null;
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Escapes Wi-Fi QR special characters: \ ; , : " */
export function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function buildPayload(type: QrContentType, f: QrFields): PayloadResult {
  switch (type) {
    case "url": {
      if (!f.url.trim()) return { ok: false, error: "Enter a URL.", field: "url", empty: true };
      const n = normalizeUrl(f.url);
      if (!n) return { ok: false, error: "That doesn't look like a valid web address, e.g. example.com/page.", field: "url" };
      return { ok: true, payload: n.url, hint: n.added ? `No scheme given, so https:// was added: ${n.url}` : undefined };
    }
    case "text": {
      if (!f.text.trim()) return { ok: false, error: "Enter some text.", field: "text", empty: true };
      return { ok: true, payload: f.text };
    }
    case "email": {
      const addr = f.email.trim();
      if (!addr) return { ok: false, error: "Enter an email address.", field: "email", empty: true };
      if (!EMAIL_RE.test(addr)) return { ok: false, error: "Enter a valid email address, e.g. name@example.com.", field: "email" };
      const params: string[] = [];
      if (f.subject.trim()) params.push(`subject=${encodeURIComponent(f.subject.trim())}`);
      if (f.body.trim()) params.push(`body=${encodeURIComponent(f.body)}`);
      return { ok: true, payload: `mailto:${addr}${params.length ? `?${params.join("&")}` : ""}` };
    }
    case "phone": {
      const raw = f.phone.trim();
      if (!raw) return { ok: false, error: "Enter a phone number.", field: "phone", empty: true };
      const cleaned = raw.replace(/[\s().-]/g, "");
      if (!/^\+?[0-9*#]{3,20}$/.test(cleaned)) {
        return {
          ok: false,
          error: "Phone numbers can contain digits, a leading +, spaces, dashes and brackets.",
          field: "phone",
        };
      }
      return { ok: true, payload: `tel:${cleaned}` };
    }
    case "wifi": {
      if (!f.ssid.trim()) return { ok: false, error: "Enter the network name (SSID).", field: "ssid", empty: true };
      if (f.encryption !== "nopass") {
        if (!f.password) return { ok: false, error: "Enter the Wi-Fi password, or choose “None”.", field: "password" };
        if (f.encryption === "WPA" && (f.password.length < 8 || f.password.length > 63)) {
          return { ok: false, error: "WPA passwords are 8 to 63 characters long.", field: "password" };
        }
      }
      const parts = [`T:${f.encryption}`, `S:${escapeWifi(f.ssid)}`];
      if (f.encryption !== "nopass") parts.push(`P:${escapeWifi(f.password)}`);
      if (f.hidden) parts.push("H:true");
      return { ok: true, payload: `WIFI:${parts.join(";")};;` };
    }
  }
}

export function utf8Length(s: string): number {
  return new TextEncoder().encode(s).length;
}

export interface ColorCheck {
  ratio: number;
  lowContrast: boolean;
  inverted: boolean;
}

/** Scanners need dark modules on a light background with strong contrast. */
export function checkColors(foreground: string, background: string): ColorCheck | null {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  if (!fg || !bg) return null;
  const ratio = contrastRatio(fg, bg);
  return { ratio, lowContrast: ratio < 4, inverted: relativeLuminance(fg) > relativeLuminance(bg) };
}

/** Friendly message for errors thrown by the qrcode library. */
export function describeQrError(err: unknown, level: ErrorLevel): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/too big|amount of data/i.test(msg)) {
    return `This content is too long for a QR code at error correction ${level}. Shorten it or choose a lower level (L holds the most, about ${BYTE_CAPACITY.L.toLocaleString("en-US")} bytes).`;
  }
  return "The QR code could not be generated from this content.";
}
