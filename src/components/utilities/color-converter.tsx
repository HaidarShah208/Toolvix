"use client";

import { useId, useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Badge, ResultActions, ResultEmpty, ResultError } from "@/components/tools/result";
import { ShareButton } from "@/components/tools/share-button";
import { InputField } from "@/components/ui/field";
import {
  ACCEPTED_FORMATS_HELP,
  composite,
  contrastRatio,
  formatColor,
  nearestNamedColor,
  parseColor,
  roundRgb,
  tintsAndShades,
  toHex,
  wcag,
  type RGBA,
} from "@/lib/converters/color";

const DEFAULT = "#1e90ff";
const WHITE = { r: 255, g: 255, b: 255 };
const BLACK = { r: 0, g: 0, b: 0 };

function PassFail({ pass, label }: { pass: boolean; label: string }) {
  return (
    <Badge tone={pass ? "success" : "danger"}>
      {label}: {pass ? "Pass" : "Fail"}
    </Badge>
  );
}

function ContrastCard({ title, fg, bg, bgCss }: { title: string; fg: RGBA; bg: typeof WHITE; bgCss: string }) {
  const ratio = contrastRatio(composite(fg, bg), bg);
  const w = wcag(ratio);
  return (
    <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="tabular text-lg font-semibold text-foreground">{(Math.floor(ratio * 100) / 100).toFixed(2)}:1</span>
      </div>
      <div
        className="mt-3 rounded-lg border border-border px-3 py-2 text-sm"
        style={{ background: bgCss, color: toHex(roundRgb(fg)) }}
      >
        <span className="font-semibold">Sample text</span> <span className="text-lg font-bold">Large text</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <PassFail pass={w.aaNormal} label="AA normal" />
        <PassFail pass={w.aaLarge} label="AA large" />
        <PassFail pass={w.aaaNormal} label="AAA normal" />
        <PassFail pass={w.aaaLarge} label="AAA large" />
      </div>
    </div>
  );
}

export default function ColorConverter() {
  const pickerId = useId();
  const [input, setInput] = useState(DEFAULT);
  const parsed = parseColor(input);
  const color = parsed.ok ? roundRgb(parsed.color) : null;
  const pickerValue = color ? toHex(color, false) : "#000000";
  const empty = input.trim() === "";

  let result: ReactNode;
  if (empty) {
    result = <ResultEmpty>Type a color in any format, or use the picker.</ResultEmpty>;
  } else if (!parsed.ok || !color) {
    result = (
      <ResultError>
        {parsed.ok ? "That color could not be read." : parsed.error}
      </ResultError>
    );
  } else {
    const f = formatColor(color);
    const near = nearestNamedColor(color);
    const { tints, shades } = tintsAndShades(color);
    const rows: { label: string; value: string }[] = [
      { label: "HEX", value: f.hex },
      { label: "RGB", value: f.rgb },
      { label: "HSL", value: f.hsl },
      { label: "HSV / HSB", value: f.hsv },
      { label: "CMYK", value: f.cmyk },
      { label: near.exact ? "CSS name" : "Nearest CSS name", value: near.name },
    ];
    const summary = rows.map((r) => `${r.label}: ${r.value}`).join("\n");
    const swatchCss = color.a < 1 ? f.rgb : f.hex;

    result = (
      <>
        <div className="flex min-w-0 items-center gap-4 rounded-xl border border-border bg-surface p-4">
          <div
            className="size-16 shrink-0 rounded-xl border border-border shadow-sm"
            style={{
              backgroundColor: swatchCss,
              backgroundImage:
                color.a < 1
                  ? `linear-gradient(${swatchCss}, ${swatchCss}), repeating-conic-gradient(#d4d4d8 0% 25%, #ffffff 0% 50%)`
                  : undefined,
              backgroundSize: color.a < 1 ? "100% 100%, 12px 12px" : undefined,
            }}
            role="img"
            aria-label={`Color swatch for ${f.hex}`}
          />
          <div className="min-w-0">
            <p className="tabular text-2xl font-semibold break-all text-foreground">{f.hex}</p>
            <p className="text-sm text-muted">
              {near.exact ? `CSS name: ${near.name}` : `Closest CSS name: ${near.name} (${near.hex})`}
            </p>
          </div>
        </div>

        <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {rows.map((r) => (
            <li key={r.label} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">{r.label}</p>
                <p className="tabular font-mono text-sm break-all text-foreground">{r.value}</p>
              </div>
              <CopyButton text={r.value} label="Copy" variant="ghost" />
            </li>
          ))}
        </ul>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <ContrastCard title="On white" fg={color} bg={WHITE} bgCss="#ffffff" />
          <ContrastCard title="On black" fg={color} bg={BLACK} bgCss="#000000" />
        </div>
        <p className="text-xs text-subtle">
          WCAG 2 thresholds: AA needs 4.5:1 for normal text and 3:1 for large text (18pt, or 14pt bold); AAA needs 7:1
          and 4.5:1.{color.a < 1 ? " Transparency is blended with each background first." : ""}
        </p>

        <ResultActions>
          <CopyButton text={summary} label="Copy all formats" />
          <ShareButton title="Color Converter" text={summary} />
        </ResultActions>

        <div className="flex flex-col gap-3">
          {[
            { title: "Tints (mixed with white)", list: tints },
            { title: "Shades (mixed with black)", list: shades },
          ].map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-sm font-semibold text-foreground">{group.title}</p>
              <div className="grid grid-cols-5 gap-2">
                {group.list.map((c) => {
                  const hex = toHex(c, false);
                  return (
                    <button
                      key={hex + group.title}
                      type="button"
                      onClick={() => setInput(hex)}
                      className="flex min-w-0 flex-col items-stretch gap-1 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      aria-label={`Use ${hex}`}
                      title={`Use ${hex}`}
                    >
                      <span className="h-10 rounded-lg border border-border" style={{ backgroundColor: hex }} />
                      <span className="tabular truncate text-center font-mono text-[11px] text-muted">{hex}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <CalculatorShell title="Color converter" onReset={() => setInput(DEFAULT)} result={result}>
      <div className="flex items-start gap-3">
        <InputField
          label="Color"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="#1e90ff, rgb(30, 144, 255), hsl(210, 100%, 56%) or tomato"
          autoComplete="off"
          spellCheck={false}
          containerClassName="flex-1"
          className="font-mono"
          error={!empty && !parsed.ok ? "Not a recognized color." : undefined}
          hint="HEX, rgb(), rgba(), hsl(), hsla(), hsv(), cmyk() or a CSS color name."
        />
        <div className="flex shrink-0 flex-col gap-1.5">
          <label htmlFor={pickerId} className="text-sm font-medium text-foreground">
            Picker
          </label>
          <input
            id={pickerId}
            type="color"
            value={pickerValue}
            onChange={(e) => setInput(e.target.value)}
            className="h-11 w-14 cursor-pointer rounded-xl border border-border-strong bg-surface p-1"
          />
        </div>
      </div>
      <p className="text-xs text-subtle">Examples of accepted input: {ACCEPTED_FORMATS_HELP}</p>
    </CalculatorShell>
  );
}
