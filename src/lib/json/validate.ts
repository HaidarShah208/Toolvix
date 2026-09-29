/**
 * Small hand-written JSON (RFC 8259) syntax checker. JSON.parse error
 * messages differ between browsers and rarely say what to fix, so this
 * walks the text itself and reports a human message with the exact line,
 * column and character offset of the first problem.
 */

export type ValidateResult =
  | {
      ok: true;
      /** Number literals that lose precision as JavaScript numbers (e.g. 12345678901234567890). */
      lossyNumbers: number;
    }
  | {
      ok: false;
      message: string;
      /** 1-based line. */
      line: number;
      /** 1-based column, in UTF-16 code units. */
      column: number;
      /** 0-based offset into the input. */
      position: number;
    };

export const MAX_DEPTH = 1000;

class JsonSyntaxError extends Error {
  constructor(
    message: string,
    public position: number,
  ) {
    super(message);
  }
}

function describeChar(ch: string): string {
  const cp = ch.codePointAt(0) ?? 0;
  const names: Record<number, string> = {
    0x09: "tab",
    0x0a: "line break",
    0x0d: "carriage return",
    0xa0: "non-breaking space",
    0xfeff: "byte order mark",
    0x200b: "zero-width space",
    0x2028: "line separator",
    0x2029: "paragraph separator",
  };
  if (names[cp]) return `${names[cp]} (U+${cp.toString(16).toUpperCase().padStart(4, "0")})`;
  if (cp < 0x20 || (cp >= 0x7f && cp <= 0x9f)) return `control character U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;
  return `'${ch}'`;
}

const SMART_QUOTES = new Set(["“", "”", "‘", "’", "„", "«", "»"]);

class Parser {
  pos = 0;
  lossy = 0;
  constructor(private text: string) {}

  fail(message: string, at = this.pos): never {
    throw new JsonSyntaxError(message, at);
  }

  eof(): boolean {
    return this.pos >= this.text.length;
  }

  peek(): string {
    return this.text[this.pos];
  }

  skipWs(): void {
    const t = this.text;
    while (this.pos < t.length) {
      const c = t[this.pos];
      if (c === " " || c === "\t" || c === "\n" || c === "\r") this.pos++;
      else break;
    }
  }

  unexpectedEnd(expected?: string): never {
    this.fail(expected ? `Unexpected end of input: expected ${expected}` : "Unexpected end of input");
  }

  /** Explains a character that cannot start a value. */
  badValueStart(): never {
    const t = this.text;
    const c = this.peek();
    const next = t[this.pos + 1];
    if (c === "'") this.fail("Strings must use double quotes");
    if (SMART_QUOTES.has(c)) this.fail(`Curly quote ${describeChar(c)} found; JSON strings need straight double quotes (")`);
    if (c === "/" && (next === "/" || next === "*")) this.fail("Comments are not allowed in JSON");
    if (c === "+") this.fail("Numbers cannot start with '+'");
    if (c === ".") this.fail("Numbers must have a digit before the decimal point");
    if (c === ",") this.fail("Expected a value but found ','");
    if (c === ":") this.fail("Expected a value but found ':'");
    if (c === "}" || c === "]") this.fail(`Expected a value but found '${c}'`);
    const word = /^[A-Za-z_$][\w$]*/.exec(t.slice(this.pos, this.pos + 64))?.[0];
    if (word) {
      if (word === "undefined") this.fail("'undefined' is not valid JSON; use null instead");
      if (word === "NaN" || word === "Infinity") this.fail(`'${word}' is not a valid JSON number`);
      const lower = word.toLowerCase();
      if (lower === "true" || lower === "false" || lower === "null") {
        this.fail(`Literals must be lowercase: write '${lower}' instead of '${word}'`);
      }
      if (word === "None") this.fail("'None' is not valid JSON; use null instead");
      if (word === "True" || word === "False") this.fail(`Literals must be lowercase: write '${lower}'`);
      for (const lit of ["true", "false", "null"]) {
        if (lit.startsWith(word) && this.pos + word.length >= t.length) this.unexpectedEnd(`'${lit}'`);
      }
      this.fail(`Unexpected character '${c}'; text values must be wrapped in double quotes`);
    }
    this.fail(`Unexpected character ${describeChar(c)}`);
  }

  parseValue(depth: number): void {
    this.skipWs();
    if (this.eof()) this.unexpectedEnd("a value");
    const c = this.peek();
    if (c === "{") return this.parseObject(depth + 1);
    if (c === "[") return this.parseArray(depth + 1);
    if (c === '"') return this.parseString();
    if (c === "-" || (c >= "0" && c <= "9")) return this.parseNumber();
    if (c === "t" || c === "f" || c === "n") {
      for (const lit of ["true", "false", "null"]) {
        if (this.text.startsWith(lit, this.pos)) {
          this.pos += lit.length;
          return;
        }
      }
    }
    this.badValueStart();
  }

  checkDepth(depth: number): void {
    if (depth > MAX_DEPTH) this.fail(`Nesting is deeper than ${MAX_DEPTH.toLocaleString("en-US")} levels`);
  }

  parseObject(depth: number): void {
    this.checkDepth(depth);
    this.pos++; // {
    this.skipWs();
    if (this.peek() === "}") {
      this.pos++;
      return;
    }
    let commaAt = -1;
    for (;;) {
      this.skipWs();
      if (this.eof()) this.unexpectedEnd("a property name or '}'");
      const c = this.peek();
      if (c === '"') this.parseString();
      else if (c === "}" && commaAt >= 0) this.fail("Trailing comma is not allowed", commaAt);
      else if (c === "'") this.fail("Strings must use double quotes");
      else if (SMART_QUOTES.has(c)) this.fail(`Curly quote ${describeChar(c)} found; property names need straight double quotes (")`);
      else if (c === "/" && (this.text[this.pos + 1] === "/" || this.text[this.pos + 1] === "*")) {
        this.fail("Comments are not allowed in JSON");
      } else if (/[A-Za-z_$0-9]/.test(c)) this.fail("Property names must be wrapped in double quotes");
      else if (c === ",") this.fail("Expected a property name but found ','");
      else this.fail(`Expected a property name in double quotes but found ${describeChar(c)}`);

      this.skipWs();
      if (this.eof()) this.unexpectedEnd("':'");
      if (this.peek() !== ":") {
        this.fail(this.peek() === "=" ? "Use ':' between a property name and its value, not '='" : "Expected ':' after property name");
      }
      this.pos++;
      this.parseValue(depth);
      this.skipWs();
      if (this.eof()) this.unexpectedEnd("',' or '}'");
      const d = this.peek();
      if (d === ",") {
        commaAt = this.pos;
        this.pos++;
        continue;
      }
      if (d === "}") {
        this.pos++;
        return;
      }
      if (d === "]") this.fail("Mismatched bracket: expected '}' to close the object but found ']'");
      if (d === "/" && (this.text[this.pos + 1] === "/" || this.text[this.pos + 1] === "*")) {
        this.fail("Comments are not allowed in JSON");
      }
      this.fail("Expected ',' or '}' after property value");
    }
  }

  parseArray(depth: number): void {
    this.checkDepth(depth);
    this.pos++; // [
    this.skipWs();
    if (this.peek() === "]") {
      this.pos++;
      return;
    }
    let commaAt = -1;
    for (;;) {
      this.skipWs();
      if (this.eof()) this.unexpectedEnd("a value or ']'");
      if (this.peek() === "]" && commaAt >= 0) this.fail("Trailing comma is not allowed", commaAt);
      this.parseValue(depth);
      this.skipWs();
      if (this.eof()) this.unexpectedEnd("',' or ']'");
      const d = this.peek();
      if (d === ",") {
        commaAt = this.pos;
        this.pos++;
        continue;
      }
      if (d === "]") {
        this.pos++;
        return;
      }
      if (d === "}") this.fail("Mismatched bracket: expected ']' to close the array but found '}'");
      if (d === "/" && (this.text[this.pos + 1] === "/" || this.text[this.pos + 1] === "*")) {
        this.fail("Comments are not allowed in JSON");
      }
      this.fail("Expected ',' or ']' after array element");
    }
  }

  parseString(): void {
    const t = this.text;
    const start = this.pos;
    this.pos++; // opening quote
    for (;;) {
      if (this.eof()) this.fail("Unterminated string: missing closing double quote", start);
      const c = t[this.pos];
      const code = c.charCodeAt(0);
      if (c === '"') {
        this.pos++;
        return;
      }
      if (c === "\\") {
        const e = t[this.pos + 1];
        if (e === undefined) this.fail("Unterminated string: missing closing double quote", start);
        if ('"\\/bfnrt'.includes(e)) {
          this.pos += 2;
          continue;
        }
        if (e === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(t.slice(this.pos + 2, this.pos + 6))) {
            this.fail("Invalid Unicode escape: \\u must be followed by 4 hex digits");
          }
          this.pos += 6;
          continue;
        }
        this.fail(`Invalid escape sequence '\\${e}' in string`);
      }
      if (code === 0x0a || code === 0x0d) {
        this.fail("Strings cannot contain unescaped line breaks; use \\n or close the string");
      }
      if (code === 0x09) this.fail("Strings cannot contain unescaped tabs; use \\t");
      if (code < 0x20) this.fail(`Strings cannot contain unescaped ${describeChar(c)}`);
      this.pos++;
    }
  }

  parseNumber(): void {
    const t = this.text;
    const start = this.pos;
    const isDigit = (ch: string | undefined) => ch !== undefined && ch >= "0" && ch <= "9";
    if (t[this.pos] === "-") {
      this.pos++;
      if (this.eof()) this.unexpectedEnd("a digit after '-'");
      if (t.startsWith("Infinity", this.pos)) this.fail("'-Infinity' is not a valid JSON number", start);
      if (!isDigit(t[this.pos])) {
        this.fail(t[this.pos] === "." ? "Numbers must have a digit before the decimal point" : "Expected a digit after '-'");
      }
    }
    if (t[this.pos] === "0") {
      this.pos++;
      if (t[this.pos] === "x" || t[this.pos] === "X") this.fail("Hexadecimal numbers are not allowed in JSON", start);
      if (isDigit(t[this.pos])) this.fail("Numbers cannot have leading zeros", start);
    } else {
      while (isDigit(t[this.pos])) this.pos++;
    }
    if (t[this.pos] === ".") {
      this.pos++;
      if (!isDigit(t[this.pos])) {
        if (this.eof()) this.unexpectedEnd("a digit after the decimal point");
        this.fail("Expected a digit after the decimal point");
      }
      while (isDigit(t[this.pos])) this.pos++;
    }
    if (t[this.pos] === "e" || t[this.pos] === "E") {
      this.pos++;
      if (t[this.pos] === "+" || t[this.pos] === "-") this.pos++;
      if (!isDigit(t[this.pos])) {
        if (this.eof()) this.unexpectedEnd("a digit in the exponent");
        this.fail("Expected a digit in the exponent");
      }
      while (isDigit(t[this.pos])) this.pos++;
    }
    this.checkPrecision(t.slice(start, this.pos));
  }

  checkPrecision(token: string): void {
    const mantissa = token.replace(/^-/, "").split(/[eE]/)[0].replace(".", "").replace(/^0+/, "");
    const significant = mantissa.replace(/0+$/, "").length;
    if (significant <= 15) return;
    const n = Number(token);
    if (!Number.isFinite(n)) {
      this.lossy++;
      return;
    }
    // Compare digits of the literal against the digits JavaScript keeps.
    const kept = n.toPrecision(Math.min(significant, 100)).replace(/^-/, "").split(/e/)[0].replace(".", "").replace(/^0+/, "");
    const want = mantissa.slice(0, kept.length).padEnd(kept.length, "0");
    if (kept !== want) this.lossy++;
  }

  run(): void {
    this.skipWs();
    if (this.eof()) this.unexpectedEnd();
    this.parseValue(0);
    this.skipWs();
    if (!this.eof()) {
      const c = this.peek();
      if (c === "," ) this.fail("Unexpected ',' after the end of the JSON value; wrap multiple values in an array");
      if (c === "}" || c === "]") this.fail(`Unexpected '${c}' after the end of the JSON value (extra closing bracket?)`);
      this.fail(`Unexpected character ${describeChar(c)} after the end of the JSON value`);
    }
  }
}

/** Converts a character offset into a 1-based line and column. */
export function lineColumn(text: string, position: number): { line: number; column: number } {
  let line = 1;
  let lineStart = 0;
  const end = Math.min(position, text.length);
  for (let i = 0; i < end; i++) {
    if (text.charCodeAt(i) === 0x0a) {
      line++;
      lineStart = i + 1;
    }
  }
  return { line, column: end - lineStart + 1 };
}

export function validateJson(text: string): ValidateResult {
  const p = new Parser(text);
  try {
    p.run();
    return { ok: true, lossyNumbers: p.lossy };
  } catch (err) {
    if (err instanceof JsonSyntaxError) {
      const { line, column } = lineColumn(text, err.position);
      return { ok: false, message: err.message, line, column, position: err.position };
    }
    if (err instanceof RangeError) {
      const { line, column } = lineColumn(text, p.pos);
      return { ok: false, message: "The JSON is nested too deeply to check", line, column, position: p.pos };
    }
    throw err;
  }
}

export interface ErrorSnippet {
  /** Line number shown in the gutter. */
  line: number;
  before: string;
  /** The character at the error (a space when the error is at the end of the line). */
  at: string;
  after: string;
  truncatedStart: boolean;
  truncatedEnd: boolean;
  /** Characters before the caret in `before` (for a "^" marker line). */
  caretOffset: number;
}

/** Extracts the offending line around the error, trimmed to a readable window. */
export function errorSnippet(text: string, line: number, column: number, width = 72): ErrorSnippet {
  const lines = text.split("\n");
  const raw = (lines[line - 1] ?? "").replace(/\r$/, "").replace(/\t/g, " ");
  const idx = Math.max(0, Math.min(column - 1, raw.length));
  let start = 0;
  let end = raw.length;
  if (raw.length > width) {
    start = Math.max(0, idx - Math.floor(width / 2));
    end = Math.min(raw.length, start + width);
    start = Math.max(0, end - width);
  }
  const before = raw.slice(start, idx);
  const atChar = raw[idx];
  return {
    line,
    before,
    at: atChar === undefined ? " " : atChar,
    after: raw.slice(idx + 1, end),
    truncatedStart: start > 0,
    truncatedEnd: end < raw.length,
    caretOffset: before.length,
  };
}
