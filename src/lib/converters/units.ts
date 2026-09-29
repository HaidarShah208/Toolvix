/**
 * Unit conversion engine. Every linear unit is defined by an exact factor to
 * its category's base unit (meter, kilogram, square meter, liter, meter per
 * second, second, byte). Temperature is affine and uses formulas instead.
 */

export type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume" | "speed" | "time" | "data";

export interface UnitDef {
  id: string;
  /** Full name, e.g. "foot". */
  name: string;
  symbol: string;
  /** Multiply by this to get the base unit. Unused for temperature. */
  factor: number;
}

export interface CategoryDef {
  id: UnitCategory;
  label: string;
  /** Singular noun for error messages, e.g. "Length". */
  noun: string;
  base: string;
  units: UnitDef[];
  defaultFrom: string;
  defaultTo: string;
}

const u = (id: string, name: string, symbol: string, factor: number): UnitDef => ({ id, name, symbol, factor });

const INCH = 0.0254;
const FOOT = 0.3048;
const YARD = 0.9144;
const MILE = 1609.344;
const POUND = 0.45359237;
const US_GALLON = 3.785411784;
const UK_GALLON = 4.54609;
const DAY = 86_400;
const YEAR = 365.2425 * DAY;

export const CATEGORIES: Record<UnitCategory, CategoryDef> = {
  length: {
    id: "length",
    label: "Length",
    noun: "Length",
    base: "m",
    defaultFrom: "m",
    defaultTo: "ft",
    units: [
      u("nm", "nanometer", "nm", 1e-9),
      u("um", "micrometer", "µm", 1e-6),
      u("mm", "millimeter", "mm", 0.001),
      u("cm", "centimeter", "cm", 0.01),
      u("m", "meter", "m", 1),
      u("km", "kilometer", "km", 1000),
      u("in", "inch", "in", INCH),
      u("ft", "foot", "ft", FOOT),
      u("yd", "yard", "yd", YARD),
      u("mi", "mile", "mi", MILE),
      u("nmi", "nautical mile", "nmi", 1852),
    ],
  },
  weight: {
    id: "weight",
    label: "Weight",
    noun: "Weight",
    base: "kg",
    defaultFrom: "kg",
    defaultTo: "lb",
    units: [
      u("mg", "milligram", "mg", 1e-6),
      u("g", "gram", "g", 0.001),
      u("kg", "kilogram", "kg", 1),
      u("t", "tonne (metric)", "t", 1000),
      u("oz", "ounce", "oz", POUND / 16),
      u("lb", "pound", "lb", POUND),
      u("st", "stone", "st", POUND * 14),
      u("ton-us", "short ton (US)", "US ton", POUND * 2000),
      u("ton-uk", "long ton (UK)", "UK ton", POUND * 2240),
    ],
  },
  temperature: {
    id: "temperature",
    label: "Temperature",
    noun: "Temperature",
    base: "k",
    defaultFrom: "c",
    defaultTo: "f",
    units: [
      u("c", "Celsius", "°C", 1),
      u("f", "Fahrenheit", "°F", 1),
      u("k", "Kelvin", "K", 1),
      u("r", "Rankine", "°R", 1),
    ],
  },
  area: {
    id: "area",
    label: "Area",
    noun: "Area",
    base: "m2",
    defaultFrom: "m2",
    defaultTo: "ft2",
    units: [
      u("mm2", "square millimeter", "mm²", 1e-6),
      u("cm2", "square centimeter", "cm²", 1e-4),
      u("m2", "square meter", "m²", 1),
      u("ha", "hectare", "ha", 10_000),
      u("km2", "square kilometer", "km²", 1e6),
      u("in2", "square inch", "in²", INCH * INCH),
      u("ft2", "square foot", "ft²", FOOT * FOOT),
      u("yd2", "square yard", "yd²", YARD * YARD),
      u("ac", "acre", "ac", 4046.8564224),
      u("mi2", "square mile", "mi²", MILE * MILE),
    ],
  },
  volume: {
    id: "volume",
    label: "Volume",
    noun: "Volume",
    base: "l",
    defaultFrom: "l",
    defaultTo: "gal-us",
    units: [
      u("ml", "milliliter", "mL", 0.001),
      u("cl", "centiliter", "cL", 0.01),
      u("l", "liter", "L", 1),
      u("m3", "cubic meter", "m³", 1000),
      u("cm3", "cubic centimeter", "cm³", 0.001),
      u("in3", "cubic inch", "in³", 0.016387064),
      u("ft3", "cubic foot", "ft³", 28.316846592),
      u("tsp-us", "teaspoon (US)", "tsp", US_GALLON / 768),
      u("tbsp-us", "tablespoon (US)", "tbsp", US_GALLON / 256),
      u("floz-us", "fluid ounce (US)", "US fl oz", 0.0295735295625),
      u("cup-us", "cup (US)", "cup", US_GALLON / 16),
      u("pt-us", "pint (US)", "US pt", US_GALLON / 8),
      u("qt-us", "quart (US)", "US qt", US_GALLON / 4),
      u("gal-us", "gallon (US)", "US gal", US_GALLON),
      u("floz-uk", "fluid ounce (UK)", "UK fl oz", UK_GALLON / 160),
      u("pt-uk", "pint (UK)", "UK pt", UK_GALLON / 8),
      u("gal-uk", "gallon (UK)", "UK gal", UK_GALLON),
    ],
  },
  speed: {
    id: "speed",
    label: "Speed",
    noun: "Speed",
    base: "ms",
    defaultFrom: "kmh",
    defaultTo: "mph",
    units: [
      u("ms", "meter per second", "m/s", 1),
      u("kmh", "kilometer per hour", "km/h", 1 / 3.6),
      u("mph", "mile per hour", "mph", MILE / 3600),
      u("fts", "foot per second", "ft/s", FOOT),
      u("kn", "knot", "kn", 1852 / 3600),
    ],
  },
  time: {
    id: "time",
    label: "Time",
    noun: "Duration",
    base: "s",
    defaultFrom: "h",
    defaultTo: "min",
    units: [
      u("ns", "nanosecond", "ns", 1e-9),
      u("us", "microsecond", "µs", 1e-6),
      u("ms", "millisecond", "ms", 0.001),
      u("s", "second", "s", 1),
      u("min", "minute", "min", 60),
      u("h", "hour", "h", 3600),
      u("d", "day", "d", DAY),
      u("wk", "week", "wk", 7 * DAY),
      u("mo", "month (average Gregorian)", "mo", YEAR / 12),
      u("yr", "year (average Gregorian)", "yr", YEAR),
    ],
  },
  data: {
    id: "data",
    label: "Data",
    noun: "Data size",
    base: "B",
    defaultFrom: "GB",
    defaultTo: "GiB",
    units: [
      u("bit", "bit", "bit", 0.125),
      u("B", "byte", "B", 1),
      u("kbit", "kilobit", "kbit", 125),
      u("Mbit", "megabit", "Mbit", 125_000),
      u("Gbit", "gigabit", "Gbit", 125_000_000),
      u("kB", "kilobyte", "kB", 1e3),
      u("MB", "megabyte", "MB", 1e6),
      u("GB", "gigabyte", "GB", 1e9),
      u("TB", "terabyte", "TB", 1e12),
      u("PB", "petabyte", "PB", 1e15),
      u("KiB", "kibibyte", "KiB", 1024),
      u("MiB", "mebibyte", "MiB", 1024 ** 2),
      u("GiB", "gibibyte", "GiB", 1024 ** 3),
      u("TiB", "tebibyte", "TiB", 1024 ** 4),
      u("PiB", "pebibyte", "PiB", 1024 ** 5),
    ],
  },
};

export const CATEGORY_ORDER: UnitCategory[] = [
  "length",
  "weight",
  "temperature",
  "area",
  "volume",
  "speed",
  "time",
  "data",
];

export function getUnit(category: UnitCategory, id: string): UnitDef | undefined {
  return CATEGORIES[category].units.find((x) => x.id === id);
}

/* ---------------------------------------------------------------- */
/* Temperature                                                      */
/* ---------------------------------------------------------------- */

export type TempUnit = "c" | "f" | "k" | "r";

export function toKelvin(value: number, unit: TempUnit): number {
  switch (unit) {
    case "c":
      return value + 273.15;
    case "f":
      return ((value - 32) * 5) / 9 + 273.15;
    case "k":
      return value;
    case "r":
      return (value * 5) / 9;
  }
}

export function fromKelvin(kelvin: number, unit: TempUnit): number {
  switch (unit) {
    case "c":
      return kelvin - 273.15;
    case "f":
      return (kelvin * 9) / 5 - 459.67;
    case "k":
      return kelvin;
    case "r":
      return (kelvin * 9) / 5;
  }
}

/** Direct conversion using the textbook formula for each pair (avoids rounding through Kelvin). */
export function convertTemperature(value: number, from: TempUnit, to: TempUnit): number {
  if (from === to) return value;
  const key = `${from}-${to}`;
  switch (key) {
    case "c-f":
      return (value * 9) / 5 + 32;
    case "c-k":
      return value + 273.15;
    case "c-r":
      return ((value + 273.15) * 9) / 5;
    case "f-c":
      return ((value - 32) * 5) / 9;
    case "f-k":
      return ((value - 32) * 5) / 9 + 273.15;
    case "f-r":
      return value + 459.67;
    case "k-c":
      return value - 273.15;
    case "k-f":
      return (value * 9) / 5 - 459.67;
    case "k-r":
      return (value * 9) / 5;
    case "r-k":
      return (value * 5) / 9;
    case "r-c":
      return ((value - 491.67) * 5) / 9;
    case "r-f":
      return value - 459.67;
    default:
      return fromKelvin(toKelvin(value, from), to);
  }
}

export const TEMP_SYMBOL: Record<TempUnit, string> = { c: "°C", f: "°F", k: "K", r: "°R" };
export const TEMP_NAME: Record<TempUnit, string> = { c: "Celsius", f: "Fahrenheit", k: "Kelvin", r: "Rankine" };

/** General formula, e.g. "°F = °C × 9/5 + 32". */
export function temperatureFormula(from: TempUnit, to: TempUnit): string {
  const f = TEMP_SYMBOL[from];
  const t = TEMP_SYMBOL[to];
  if (from === to) return `${t} = ${f}`;
  const body: Record<string, string> = {
    "c-f": `${f} × 9/5 + 32`,
    "c-k": `${f} + 273.15`,
    "c-r": `(${f} + 273.15) × 9/5`,
    "f-c": `(${f} − 32) × 5/9`,
    "f-k": `(${f} − 32) × 5/9 + 273.15`,
    "f-r": `${f} + 459.67`,
    "k-c": `${f} − 273.15`,
    "k-f": `${f} × 9/5 − 459.67`,
    "k-r": `${f} × 9/5`,
    "r-k": `${f} × 5/9`,
    "r-c": `(${f} − 491.67) × 5/9`,
    "r-f": `${f} − 459.67`,
  };
  return `${t} = ${body[`${from}-${to}`]}`;
}

/** Formula with the actual numbers, e.g. "25 °C × 9/5 + 32 = 77 °F". */
export function temperatureWorking(value: number, from: TempUnit, to: TempUnit): string {
  const v = `${formatSig(value)} ${TEMP_SYMBOL[from]}`;
  const r = `${formatSig(convertTemperature(value, from, to))} ${TEMP_SYMBOL[to]}`;
  const body: Record<string, string> = {
    "c-f": `${v} × 9/5 + 32`,
    "c-k": `${v} + 273.15`,
    "c-r": `(${v} + 273.15) × 9/5`,
    "f-c": `(${v} − 32) × 5/9`,
    "f-k": `(${v} − 32) × 5/9 + 273.15`,
    "f-r": `${v} + 459.67`,
    "k-c": `${v} − 273.15`,
    "k-f": `${v} × 9/5 − 459.67`,
    "k-r": `${v} × 9/5`,
    "r-k": `${v} × 5/9`,
    "r-c": `(${v} − 491.67) × 5/9`,
    "r-f": `${v} − 459.67`,
  };
  if (from === to) return `${v} = ${r}`;
  return `${body[`${from}-${to}`]} = ${r}`;
}

/** Absolute zero expressed in each scale. */
export const ABSOLUTE_ZERO: Record<TempUnit, number> = { c: -273.15, f: -459.67, k: 0, r: 0 };

/* ---------------------------------------------------------------- */
/* Conversion                                                       */
/* ---------------------------------------------------------------- */

export type ConvertResult = { ok: true; value: number } | { ok: false; error: string };

/** Checks a value is physically meaningful for the category and unit. */
export function validateValue(value: number, category: UnitCategory, from: string): string | null {
  if (!Number.isFinite(value)) return "Enter a finite number.";
  if (category === "temperature") {
    const unit = from as TempUnit;
    // Allow a hair of float tolerance at exactly absolute zero.
    if (toKelvin(value, unit) < -1e-9) {
      return `That is below absolute zero (${formatSig(ABSOLUTE_ZERO[unit])} ${TEMP_SYMBOL[unit]}), the lowest possible temperature.`;
    }
    return null;
  }
  if (value < 0) {
    return `${CATEGORIES[category].noun} cannot be negative.`;
  }
  return null;
}

export function convert(value: number, category: UnitCategory, from: string, to: string): ConvertResult {
  const err = validateValue(value, category, from);
  if (err) return { ok: false, error: err };
  if (category === "temperature") {
    const r = convertTemperature(value, from as TempUnit, to as TempUnit);
    return Number.isFinite(r) ? { ok: true, value: cleanFloat(r) } : { ok: false, error: "That value is too large to convert." };
  }
  const f = getUnit(category, from);
  const t = getUnit(category, to);
  if (!f || !t) return { ok: false, error: "Unknown unit." };
  const r = f.id === t.id ? value : (value * f.factor) / t.factor;
  if (!Number.isFinite(r)) return { ok: false, error: "That value is too large to convert." };
  return { ok: true, value: cleanFloat(r) };
}

/** Converts a value into every unit of its category. */
export function convertAll(
  value: number,
  category: UnitCategory,
  from: string,
): { unit: UnitDef; value: number }[] | null {
  const out: { unit: UnitDef; value: number }[] = [];
  for (const unit of CATEGORIES[category].units) {
    const r = convert(value, category, from, unit.id);
    if (!r.ok) return null;
    out.push({ unit, value: r.value });
  }
  return out;
}

/** Human description of the factor, e.g. "1 ft = 0.3048 m", or a formula for temperature. */
export function describeFactor(category: UnitCategory, from: string, to: string): string {
  if (category === "temperature") return temperatureFormula(from as TempUnit, to as TempUnit);
  const f = getUnit(category, from);
  const t = getUnit(category, to);
  if (!f || !t) return "";
  return `1 ${f.symbol} = ${formatSig(cleanFloat(f.factor / t.factor))} ${t.symbol}`;
}

/** Removes binary floating-point noise by rounding to 15 significant digits. */
export function cleanFloat(value: number): number {
  if (!Number.isFinite(value) || value === 0) return value;
  return Number(value.toPrecision(15));
}

/**
 * Formats with up to `digits` significant digits, trims trailing zeros and
 * groups thousands. Very large or tiny values use scientific notation.
 */
export function formatSig(value: number, digits = 10): string {
  if (!Number.isFinite(value)) return "—";
  if (value === 0 || Object.is(value, -0)) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e15 || abs < 1e-6) {
    const [mantissa, exp] = value.toExponential(digits - 1).split("e");
    const m = mantissa.includes(".") ? mantissa.replace(/\.?0+$/, "") : mantissa;
    return `${m} × 10^${Number(exp)}`;
  }
  const rounded = Number(value.toPrecision(digits));
  const text = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: digits,
    useGrouping: true,
  }).format(rounded);
  return text === "-0" ? "0" : text;
}

/** Plain (ungrouped) string for copying, e.g. "3280.839895". */
export function plainSig(value: number, digits = 10): string {
  if (!Number.isFinite(value)) return "";
  if (value === 0) return "0";
  const abs = Math.abs(value);
  if (abs >= 1e15 || abs < 1e-6) {
    const [mantissa, exp] = value.toExponential(digits - 1).split("e");
    const m = mantissa.includes(".") ? mantissa.replace(/\.?0+$/, "") : mantissa;
    return `${m}e${exp}`;
  }
  return String(Number(value.toPrecision(digits)));
}

/** Splits pounds into stones and pounds, e.g. 154.3 lb → { stones: 11, pounds: 0.3 }. */
export function toStonesAndPounds(pounds: number): { stones: number; pounds: number } {
  const stones = Math.floor(pounds / 14 + 1e-12);
  const rest = cleanFloat(pounds - stones * 14);
  return { stones, pounds: rest < 0 ? 0 : rest };
}
