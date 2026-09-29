"use client";

import { useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import {
  DataTable,
  ResultActions,
  ResultEmpty,
  ResultError,
  ResultHighlight,
  ResultSteps,
  StatGrid,
} from "@/components/tools/result";
import { NumberField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  divideInRatio,
  simplifyRatio,
  solveProportion,
  type ProportionKey,
} from "@/lib/calculators/ratio";
import { formatNumber, parseNumber, type ParseResult } from "@/lib/utils/number";

type Mode = "simplify" | "proportion" | "divide";

const MODES = [
  { value: "simplify", label: "Simplify" },
  { value: "proportion", label: "Solve A:B = C:D" },
  { value: "divide", label: "Divide a total" },
] as const;

const fmt = (v: number) => formatNumber(v, 6);
const LETTERS = ["A", "B", "C"];

function fieldError(raw: string, p: ParseResult): string | undefined {
  return raw.trim() !== "" && !p.ok ? p.error : undefined;
}

export default function RatioCalculator() {
  const [mode, setMode] = useState<Mode>("simplify");
  const [simp, setSimp] = useState({ a: "", b: "", c: "" });
  const [prop, setProp] = useState<Record<ProportionKey, string>>({ a: "", b: "", c: "", d: "" });
  const [div, setDiv] = useState({ total: "", a: "", b: "", c: "" });

  function reset() {
    setSimp({ a: "", b: "", c: "" });
    setProp({ a: "", b: "", c: "", d: "" });
    setDiv({ total: "", a: "", b: "", c: "" });
  }

  let result: ReactNode;
  let fields: ReactNode;

  if (mode === "simplify") {
    const pa = parseNumber(simp.a, { label: "A" });
    const pb = parseNumber(simp.b, { label: "B" });
    const hasC = simp.c.trim() !== "";
    const pc = parseNumber(simp.c, { label: "C" });
    fields = (
      <div className="grid gap-4 sm:grid-cols-3">
        <NumberField label="A" value={simp.a} onChange={(e) => setSimp({ ...simp, a: e.target.value })} placeholder="16" error={fieldError(simp.a, pa)} />
        <NumberField label="B" value={simp.b} onChange={(e) => setSimp({ ...simp, b: e.target.value })} placeholder="9" error={fieldError(simp.b, pb)} />
        <NumberField label="C (optional)" value={simp.c} onChange={(e) => setSimp({ ...simp, c: e.target.value })} placeholder="—" error={fieldError(simp.c, pc)} />
      </div>
    );
    if (simp.a.trim() === "" || simp.b.trim() === "") {
      result = <ResultEmpty>Enter A and B (and optionally C) to simplify the ratio.</ResultEmpty>;
    } else if (!pa.ok || !pb.ok || (hasC && !pc.ok)) {
      result = <ResultError>{!pa.ok ? pa.error : !pb.ok ? pb.error : !pc.ok ? pc.error : ""}</ResultError>;
    } else {
      const terms = [pa.value, pb.value, ...(hasC && pc.ok ? [pc.value] : [])];
      const r = simplifyRatio(terms);
      if (!r.ok) {
        result = <ResultError>{r.error}</ResultError>;
      } else {
        const v = r.value;
        const original = terms.map(fmt).join(" : ");
        const simplest = v.simplified.map((x) => formatNumber(x, 0)).join(" : ");
        const unit = v.unitForm ? v.unitForm.map(fmt).join(" : ") : null;
        const steps: ReactNode[] = [];
        if (v.scale > 1) {
          steps.push(`Multiply every term by ${formatNumber(v.scale)} to remove decimals: ${v.scaled.map((x) => formatNumber(x, 0)).join(" : ")}.`);
        }
        steps.push(`Greatest common divisor of ${v.scaled.map((x) => formatNumber(x, 0)).join(", ")} = ${formatNumber(v.divisor, 0)}.`);
        steps.push(`Divide each term by ${formatNumber(v.divisor, 0)}: ${simplest}.`);
        if (v.unitForm) steps.push(`For 1 : n form, divide each term by A (${fmt(terms[0])}): ${unit}.`);
        const summary = [
          `${original} simplifies to ${simplest}`,
          v.decimal !== null ? `A ÷ B = ${fmt(v.decimal)}` : null,
          unit ? `As 1 : n: ${unit}` : null,
        ]
          .filter(Boolean)
          .join("\n");
        result = (
          <>
            <ResultHighlight label={`${original} in simplest form`} value={simplest} sub={v.divisor === 1 && v.scale === 1 ? "Already in lowest terms." : undefined} />
            <StatGrid
              items={[
                ...(terms.length === 2
                  ? [{ label: "Decimal ratio (A ÷ B)", value: v.decimal !== null ? fmt(v.decimal) : "—", hint: v.decimal === null ? "Undefined because B is 0" : undefined }]
                  : []),
                { label: "1 : n form", value: unit ?? "—", hint: unit ? undefined : "Not possible when A is 0" },
              ]}
            />
            <ResultSteps steps={steps} />
            <ResultActions>
              <CopyButton text={summary} label="Copy result" />
            </ResultActions>
          </>
        );
      }
    }
  } else if (mode === "proportion") {
    const keys: ProportionKey[] = ["a", "b", "c", "d"];
    const parsed = Object.fromEntries(keys.map((k) => [k, parseNumber(prop[k], { label: k.toUpperCase() })])) as Record<ProportionKey, ParseResult>;
    const blanks = keys.filter((k) => prop[k].trim() === "");
    const set = (k: ProportionKey, value: string) => setProp({ ...prop, [k]: value });
    const field = (k: ProportionKey, ph: string) => (
      <NumberField
        label={k.toUpperCase()}
        value={prop[k]}
        onChange={(e) => set(k, e.target.value)}
        placeholder={blanks.length === 1 && blanks[0] === k ? "?" : ph}
        error={fieldError(prop[k], parsed[k])}
      />
    );
    fields = (
      <>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          {field("a", "3")}
          <span className="pb-2.5 text-lg font-semibold text-muted" aria-hidden="true">:</span>
          {field("b", "4")}
        </div>
        <p className="text-center text-sm font-medium text-muted">=</p>
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          {field("c", "?")}
          <span className="pb-2.5 text-lg font-semibold text-muted" aria-hidden="true">:</span>
          {field("d", "20")}
        </div>
        <p className="text-xs text-subtle">Fill in three values and leave the one you want to find empty.</p>
      </>
    );
    const invalid = keys.find((k) => prop[k].trim() !== "" && !parsed[k].ok);
    if (blanks.length > 1) {
      result = <ResultEmpty>Enter three of the four values. The empty box is the one we solve for.</ResultEmpty>;
    } else if (invalid) {
      const p = parsed[invalid];
      result = <ResultError>{!p.ok ? p.error : ""}</ResultError>;
    } else if (blanks.length === 0) {
      result = <ResultError>All four boxes are filled. Clear the one you want to solve for.</ResultError>;
    } else {
      const vals = Object.fromEntries(keys.map((k) => [k, blanks[0] === k ? null : (parsed[k] as { value: number }).value])) as Record<ProportionKey, number | null>;
      const r = solveProportion(vals);
      if (!r.ok) {
        result = <ResultError>{r.error}</ResultError>;
      } else {
        const v = r.value;
        const show = (k: ProportionKey) => (k === v.missing ? fmt(v.value) : fmt(vals[k] as number));
        const eq = `${show("a")} : ${show("b")} = ${show("c")} : ${show("d")}`;
        const summary = `${v.missing.toUpperCase()} = ${fmt(v.value)} (${eq})`;
        result = (
          <>
            <ResultHighlight label={`Missing value ${v.missing.toUpperCase()}`} value={fmt(v.value)} sub={eq} />
            <ResultSteps
              steps={[
                "In a proportion A : B = C : D, the cross products are equal: A × D = B × C.",
                `Rearrange for ${v.missing.toUpperCase()}: ${v.formula}.`,
                `${v.missing.toUpperCase()} = ${fmt(v.numerator)} ÷ ${fmt(v.denominator)} = ${fmt(v.value)}.`,
              ]}
            />
            <ResultActions>
              <CopyButton text={summary} label="Copy result" />
            </ResultActions>
          </>
        );
      }
    }
  } else {
    const pt = parseNumber(div.total, { label: "Total" });
    const pa = parseNumber(div.a, { label: "A", allowNegative: false });
    const pb = parseNumber(div.b, { label: "B", allowNegative: false });
    const hasC = div.c.trim() !== "";
    const pc = parseNumber(div.c, { label: "C", allowNegative: false });
    fields = (
      <>
        <NumberField label="Total to divide" value={div.total} onChange={(e) => setDiv({ ...div, total: e.target.value })} placeholder="1,200" error={fieldError(div.total, pt)} />
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField label="Part A" value={div.a} onChange={(e) => setDiv({ ...div, a: e.target.value })} placeholder="2" error={fieldError(div.a, pa)} />
          <NumberField label="Part B" value={div.b} onChange={(e) => setDiv({ ...div, b: e.target.value })} placeholder="3" error={fieldError(div.b, pb)} />
          <NumberField label="Part C (optional)" value={div.c} onChange={(e) => setDiv({ ...div, c: e.target.value })} placeholder="—" error={fieldError(div.c, pc)} />
        </div>
      </>
    );
    if (div.total.trim() === "" || div.a.trim() === "" || div.b.trim() === "") {
      result = <ResultEmpty>Enter a total and the ratio parts to see each share.</ResultEmpty>;
    } else if (!pt.ok || !pa.ok || !pb.ok || (hasC && !pc.ok)) {
      result = <ResultError>{!pt.ok ? pt.error : !pa.ok ? pa.error : !pb.ok ? pb.error : !pc.ok ? pc.error : ""}</ResultError>;
    } else {
      const parts = [pa.value, pb.value, ...(hasC && pc.ok ? [pc.value] : [])];
      const r = divideInRatio(pt.value, parts);
      if (!r.ok) {
        result = <ResultError>{r.error}</ResultError>;
      } else {
        const v = r.value;
        const ratio = parts.map(fmt).join(" : ");
        const summary = [`${fmt(pt.value)} divided in the ratio ${ratio}:`, ...v.shares.map((s, i) => `${LETTERS[i]}: ${fmt(s)}`)].join("\n");
        result = (
          <>
            <ResultHighlight label={`${fmt(pt.value)} split ${ratio}`} value={v.shares.map(fmt).join(" / ")} />
            <DataTable
              caption="Share of the total for each part"
              columns={[
                { key: "part", label: "Part" },
                { key: "ratio", label: "Ratio", align: "right" },
                { key: "share", label: "Share", align: "right" },
                { key: "pct", label: "% of total", align: "right" },
              ]}
              rows={v.shares.map((s, i) => ({
                part: LETTERS[i],
                ratio: fmt(parts[i]),
                share: fmt(s),
                pct: `${formatNumber((parts[i] / v.sumOfParts) * 100, 2)}%`,
              }))}
            />
            <ResultSteps
              steps={[
                `Add the parts: ${parts.map(fmt).join(" + ")} = ${fmt(v.sumOfParts)}.`,
                `Value of one part = ${fmt(pt.value)} ÷ ${fmt(v.sumOfParts)} = ${fmt(v.perPart)}.`,
                `Multiply each part by that: ${parts.map((p, i) => `${LETTERS[i]} = ${fmt(p)} × ${fmt(v.perPart)} = ${fmt(v.shares[i])}`).join("; ")}.`,
              ]}
            />
            <ResultActions>
              <CopyButton text={summary} label="Copy result" />
            </ResultActions>
          </>
        );
      }
    }
  }

  return (
    <CalculatorShell
      title="Ratio calculator"
      onReset={reset}
      toolbar={<Segmented label="Calculation type" options={MODES} value={mode} onChange={setMode} />}
      result={result}
    >
      {fields}
    </CalculatorShell>
  );
}
