/**
 * Color parsing, conversion and WCAG contrast. Channels are 0–255 for RGB,
 * alpha is 0–1, hue is 0–360, and percentages are 0–100.
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** The 148 CSS named colors (CSS Color Module Level 4), including gray/grey spellings. */
export const CSS_NAMED_COLORS: Record<string, string> = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  rebeccapurple: "#663399",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};

export const ACCEPTED_FORMATS_HELP =
  "HEX (#1e90ff, #fff, #1e90ff80), rgb(30, 144, 255), rgba(30 144 255 / 0.5), hsl(210, 100%, 56%), hsv(210, 88%, 100%), cmyk(88%, 44%, 0%, 0%) or a CSS color name such as tomato.";

export type ParseColorResult = { ok: true; color: RGBA; format: string } | { ok: false; error: string };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function parseHex(s: string): RGBA | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(s);
  if (!m) return null;
  let h = m[1];
  if (h.length <= 4) h = h.split("").map((c) => c + c).join("");
  const n = (i: number) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? Math.round((n(6) / 255) * 1000) / 1000 : 1 };
}

/** Splits "a, b, c" or "a b c / d" into parts. */
function splitArgs(body: string): string[] | null {
  const t = body.trim();
  if (!t) return null;
  if (t.includes(",")) {
    const parts = t.split(",").map((x) => x.trim());
    return parts.some((p) => p === "") ? null : parts;
  }
  const [main, alpha] = t.split("/").map((x) => x.trim());
  const parts = main.split(/\s+/).filter(Boolean);
  if (alpha !== undefined) {
    if (!alpha) return null;
    parts.push(alpha);
  }
  return parts;
}

function num(token: string): number | null {
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(token)) return null;
  const v = Number(token);
  return Number.isFinite(v) ? v : null;
}

/** "50%" → 50, "0.5" (when allowFraction) → 50, "50" → 50. */
function percent(token: string): number | null {
  const t = token.endsWith("%") ? token.slice(0, -1) : token;
  const v = num(t);
  return v === null ? null : v;
}

function alphaValue(token: string | undefined): number | null {
  if (token === undefined) return 1;
  if (token.endsWith("%")) {
    const v = num(token.slice(0, -1));
    return v === null ? null : clamp(v / 100, 0, 1);
  }
  const v = num(token);
  return v === null ? null : clamp(v, 0, 1);
}

function hue(token: string): number | null {
  const t = token.replace(/deg$/i, "");
  const v = num(t);
  if (v === null) return null;
  return ((v % 360) + 360) % 360;
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const S = s / 100;
  const L = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return { r: f(0) * 255, g: f(8) * 255, b: f(4) * 255 };
}

export function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const S = s / 100;
  const V = v / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return V - V * S * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return { r: f(5) * 255, g: f(3) * 255, b: f(1) * 255 };
}

export function parseColor(input: string): ParseColorResult {
  const raw = input.trim().toLowerCase();
  const fail = (): ParseColorResult => ({
    ok: false,
    error: `That color was not recognized. Try ${ACCEPTED_FORMATS_HELP}`,
  });
  if (!raw) return { ok: false, error: "Enter a color." };

  const named = CSS_NAMED_COLORS[raw.replace(/\s+/g, "")];
  if (named) {
    const c = parseHex(named);
    return c ? { ok: true, color: c, format: "name" } : fail();
  }

  const hex = parseHex(raw);
  if (hex && (raw.startsWith("#") || /^[0-9a-f]{6}$|^[0-9a-f]{8}$/.test(raw))) return { ok: true, color: hex, format: "hex" };

  const fn = /^([a-z]+)\((.*)\)$/.exec(raw);
  if (!fn) return fail();
  const name = fn[1];
  const args = splitArgs(fn[2]);
  if (!args) return fail();

  const outOfRange = (what: string): ParseColorResult => ({ ok: false, error: `${what} is out of range.` });

  if (name === "rgb" || name === "rgba") {
    if (args.length !== 3 && args.length !== 4) return fail();
    const ch = args.slice(0, 3).map((t) => {
      if (t.endsWith("%")) {
        const v = num(t.slice(0, -1));
        return v === null ? null : (v / 100) * 255;
      }
      return num(t);
    });
    if (ch.some((v) => v === null)) return fail();
    const [r, g, b] = ch as number[];
    if ([r, g, b].some((v) => v < 0 || v > 255)) return outOfRange("An RGB channel (0–255)");
    const a = alphaValue(args[3]);
    if (a === null) return fail();
    return { ok: true, color: { r, g, b, a }, format: "rgb" };
  }

  if (name === "hsl" || name === "hsla" || name === "hsv" || name === "hsb") {
    if (args.length !== 3 && args.length !== 4) return fail();
    const h = hue(args[0]);
    const s = percent(args[1]);
    const l = percent(args[2]);
    if (h === null || s === null || l === null) return fail();
    if (s < 0 || s > 100 || l < 0 || l > 100) return outOfRange("Saturation and lightness/value (0–100%)");
    const a = alphaValue(args[3]);
    if (a === null) return fail();
    const rgb = name.startsWith("hsl") ? hslToRgb(h, s, l) : hsvToRgb(h, s, l);
    return { ok: true, color: { ...rgb, a }, format: name.startsWith("hsl") ? "hsl" : "hsv" };
  }

  if (name === "cmyk") {
    if (args.length !== 4) return fail();
    const vals = args.map((t) => {
      const p = percent(t);
      if (p === null) return null;
      // Accept 0–1 fractions without % as well as 0–100.
      return !t.endsWith("%") && p <= 1 && args.every((x) => !x.endsWith("%") && (num(x) ?? 2) <= 1) ? p * 100 : p;
    });
    if (vals.some((v) => v === null)) return fail();
    const [c, m, y, k] = vals as number[];
    if ([c, m, y, k].some((v) => v < 0 || v > 100)) return outOfRange("A CMYK value (0–100%)");
    const K = 1 - k / 100;
    return {
      ok: true,
      color: { r: 255 * (1 - c / 100) * K, g: 255 * (1 - m / 100) * K, b: 255 * (1 - y / 100) * K, a: 1 },
      format: "cmyk",
    };
  }

  return fail();
}

/* ------------------------------ Conversions ------------------------------ */

export function roundRgb(c: RGBA): RGBA {
  return {
    r: clamp(Math.round(c.r), 0, 255),
    g: clamp(Math.round(c.g), 0, 255),
    b: clamp(Math.round(c.b), 0, 255),
    a: Math.round(clamp(c.a, 0, 1) * 1000) / 1000,
  };
}

const hex2 = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, "0");

export function toHex(c: RGBA, includeAlpha = c.a < 1): string {
  const base = `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`;
  return includeAlpha ? `${base}${hex2(c.a * 255)}` : base;
}

export function rgbToHsl(c: RGBA): { h: number; s: number; l: number } {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function rgbToHsv(c: RGBA): { h: number; s: number; v: number } {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const { h } = rgbToHsl(c);
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

export function rgbToCmyk(c: RGBA): { c: number; m: number; y: number; k: number } {
  const r = c.r / 255;
  const g = c.g / 255;
  const b = c.b / 255;
  const k = 1 - Math.max(r, g, b);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: ((1 - r - k) / (1 - k)) * 100,
    m: ((1 - g - k) / (1 - k)) * 100,
    y: ((1 - b - k) / (1 - k)) * 100,
    k: k * 100,
  };
}

const r0 = (n: number) => Math.round(n);
const r1 = (n: number) => {
  const v = Math.round(n * 10) / 10;
  return Object.is(v, -0) ? 0 : v;
};
const alphaText = (a: number) => String(Math.round(a * 1000) / 1000);

export interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
}

export function formatColor(input: RGBA): ColorFormats {
  const c = roundRgb(input);
  const hasAlpha = c.a < 1;
  const hsl = rgbToHsl(c);
  const hsv = rgbToHsv(c);
  const cmyk = rgbToCmyk(c);
  return {
    hex: toHex(c),
    rgb: hasAlpha ? `rgba(${c.r}, ${c.g}, ${c.b}, ${alphaText(c.a)})` : `rgb(${c.r}, ${c.g}, ${c.b})`,
    hsl: hasAlpha
      ? `hsla(${r0(hsl.h)}, ${r1(hsl.s)}%, ${r1(hsl.l)}%, ${alphaText(c.a)})`
      : `hsl(${r0(hsl.h)}, ${r1(hsl.s)}%, ${r1(hsl.l)}%)`,
    hsv: `hsv(${r0(hsv.h)}, ${r1(hsv.s)}%, ${r1(hsv.v)}%)`,
    cmyk: `cmyk(${r0(cmyk.c)}%, ${r0(cmyk.m)}%, ${r0(cmyk.y)}%, ${r0(cmyk.k)}%)`,
  };
}

/* ---------------------------- Nearest name ---------------------------- */

function toLab(c: { r: number; g: number; b: number }) {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const R = lin(c.r);
  const G = lin(c.g);
  const B = lin(c.b);
  const x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  const y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t: number) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);
  return { L: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/** Closest CSS named color by CIE76 ΔE in Lab space. */
export function nearestNamedColor(c: RGBA): { name: string; hex: string; exact: boolean; distance: number } {
  const target = toLab(c);
  let best = { name: "black", hex: "#000000", distance: Infinity };
  for (const [name, hex] of Object.entries(CSS_NAMED_COLORS)) {
    const rgb = parseHex(hex);
    if (!rgb) continue;
    const lab = toLab(rgb);
    const d = Math.hypot(lab.L - target.L, lab.a - target.a, lab.b - target.b);
    if (d < best.distance) best = { name, hex, distance: d };
  }
  const rounded = roundRgb(c);
  return { ...best, exact: toHex(rounded, false) === best.hex };
}

/* ------------------------------ Contrast ------------------------------ */

export function relativeLuminance(c: { r: number; g: number; b: number }): number {
  const ch = (v: number) => {
    const s = clamp(v, 0, 255) / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * ch(c.r) + 0.7152 * ch(c.g) + 0.0722 * ch(c.b);
}

export function contrastRatio(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

/** Composites a translucent color over an opaque background. */
export function composite(fg: RGBA, bg: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  };
}

export interface WcagResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
}

export function wcag(ratio: number): WcagResult {
  // WCAG compares the unrounded ratio against the thresholds.
  return { ratio, aaNormal: ratio >= 4.5, aaLarge: ratio >= 3, aaaNormal: ratio >= 7, aaaLarge: ratio >= 4.5 };
}

/* ------------------------------ Palette ------------------------------ */

function mix(c: RGBA, with_: { r: number; g: number; b: number }, amount: number): RGBA {
  return {
    r: c.r + (with_.r - c.r) * amount,
    g: c.g + (with_.g - c.g) * amount,
    b: c.b + (with_.b - c.b) * amount,
    a: c.a,
  };
}

const MIX_STEPS = [0.15, 0.3, 0.45, 0.6, 0.75];

/** Five tints (mixed with white) and five shades (mixed with black). */
export function tintsAndShades(c: RGBA): { tints: RGBA[]; shades: RGBA[] } {
  return {
    tints: MIX_STEPS.map((s) => roundRgb(mix(c, { r: 255, g: 255, b: 255 }, s))),
    shades: MIX_STEPS.map((s) => roundRgb(mix(c, { r: 0, g: 0, b: 0 }, s))),
  };
}

/** Parses "#rrggbb" (e.g. from <input type="color">) into RGB. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const c = parseHex(hex);
  return c ? { r: c.r, g: c.g, b: c.b } : null;
}
