"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import {
  Badge,
  ResultActions,
  ResultEmpty,
  ResultError,
  ResultHighlight,
  ResultSteps,
} from "@/components/tools/result";
import { ShareButton } from "@/components/tools/share-button";
import { NumberField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { percentChange, percentOf, wholeFromPercent, whatPercent } from "@/lib/calculators/percentage";
import { formatNumber, parseNumber } from "@/lib/utils/number";

type Mode = "of" | "what" | "change" | "whole";

const MODES = [
  { value: "of", label: "X% of Y" },
  { value: "what", label: "X is ?% of Y" },
  { value: "change", label: "% change" },
  { value: "whole", label: "X is P% of ?" },
] as const;

const FIELDS: Record<Mode, { a: string; b: string; aSuffix?: string; bSuffix?: string }> = {
  of: { a: "Percentage (X)", b: "Number (Y)", aSuffix: "%" },
  what: { a: "Part (X)", b: "Whole (Y)" },
  change: { a: "Starting value", b: "Final value" },
  whole: { a: "Part (X)", b: "Percentage (P)", bSuffix: "%" },
};

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const f = FIELDS[mode];
  const pa = parseNumber(a, { label: f.a });
  const pb = parseNumber(b, { label: f.b });
  const empty = a.trim() === "" || b.trim() === "";

  function reset() {
    setA("");
    setB("");
  }

  let result: React.ReactNode;
  if (empty) {
    result = <ResultEmpty>Enter both values to see the answer and the working.</ResultEmpty>;
  } else if (!pa.ok || !pb.ok) {
    result = <ResultError>{!pa.ok ? pa.error : !pb.ok ? pb.error : null}</ResultError>;
  } else {
    const x = pa.value;
    const y = pb.value;
    let label = "";
    let value = "";
    let summary = "";
    let steps: string[] = [];
    let badge: React.ReactNode = null;
    let error: string | null = null;

    if (mode === "of") {
      const r = percentOf(x, y);
      if (r.ok) {
        label = `${formatNumber(x)}% of ${formatNumber(y)}`;
        value = formatNumber(r.value, 6);
        summary = `${formatNumber(x)}% of ${formatNumber(y)} is ${value}`;
        steps = [
          `Convert the percentage to a decimal: ${formatNumber(x)} ÷ 100 = ${formatNumber(x / 100, 6)}`,
          `Multiply by the number: ${formatNumber(x / 100, 6)} × ${formatNumber(y)} = ${value}`,
        ];
      }
    } else if (mode === "what") {
      const r = whatPercent(x, y);
      if (r.ok) {
        label = `${formatNumber(x)} is this percent of ${formatNumber(y)}`;
        value = `${formatNumber(r.value, 4)}%`;
        summary = `${formatNumber(x)} is ${value} of ${formatNumber(y)}`;
        steps = [
          `Divide the part by the whole: ${formatNumber(x)} ÷ ${formatNumber(y)} = ${formatNumber(x / y, 6)}`,
          `Multiply by 100: ${formatNumber(x / y, 6)} × 100 = ${value}`,
        ];
      } else error = r.error;
    } else if (mode === "change") {
      const r = percentChange(x, y);
      if (r.ok) {
        const { change, difference } = r.value;
        const dir = change > 0 ? "increase" : change < 0 ? "decrease" : "no change";
        label = `Change from ${formatNumber(x)} to ${formatNumber(y)}`;
        value = `${change > 0 ? "+" : ""}${formatNumber(change, 4)}%`;
        summary = `${formatNumber(x)} → ${formatNumber(y)} is a ${formatNumber(Math.abs(change), 4)}% ${dir}`;
        badge = (
          <Badge tone={change > 0 ? "success" : change < 0 ? "danger" : "neutral"}>
            {change === 0 ? "No change" : `${formatNumber(Math.abs(change), 4)}% ${dir}`}
          </Badge>
        );
        steps = [
          `Find the difference: ${formatNumber(y)} − ${formatNumber(x)} = ${formatNumber(difference)}`,
          `Divide by the starting value: ${formatNumber(difference)} ÷ ${formatNumber(Math.abs(x))} = ${formatNumber(difference / Math.abs(x), 6)}`,
          `Multiply by 100: ${value}`,
        ];
      } else error = r.error;
    } else {
      const r = wholeFromPercent(x, y);
      if (r.ok) {
        label = `${formatNumber(x)} is ${formatNumber(y)}% of`;
        value = formatNumber(r.value, 6);
        summary = `${formatNumber(x)} is ${formatNumber(y)}% of ${value}`;
        steps = [
          `Convert the percentage to a decimal: ${formatNumber(y)} ÷ 100 = ${formatNumber(y / 100, 6)}`,
          `Divide the part by it: ${formatNumber(x)} ÷ ${formatNumber(y / 100, 6)} = ${value}`,
        ];
      } else error = r.error;
    }

    result = error ? (
      <ResultError>{error}</ResultError>
    ) : (
      <>
        <ResultHighlight label={label} value={value} badge={badge} />
        <ResultSteps steps={steps} />
        <ResultActions>
          <CopyButton text={summary} label="Copy result" />
          <ShareButton title="Percentage Calculator" text={summary} />
        </ResultActions>
      </>
    );
  }

  return (
    <CalculatorShell
      title="Percentage calculator"
      onReset={reset}
      toolbar={
        <Segmented
          label="Calculation type"
          options={MODES}
          value={mode}
          onChange={(m) => {
            setMode(m);
          }}
        />
      }
      result={result}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label={f.a}
          value={a}
          onChange={(e) => setA(e.target.value)}
          suffix={f.aSuffix}
          placeholder={mode === "of" ? "20" : mode === "change" ? "80" : "30"}
          error={a.trim() !== "" && !pa.ok ? pa.error : undefined}
        />
        <NumberField
          label={f.b}
          value={b}
          onChange={(e) => setB(e.target.value)}
          suffix={f.bSuffix}
          placeholder={mode === "of" ? "150" : mode === "change" ? "100" : mode === "whole" ? "15" : "120"}
          error={b.trim() !== "" && !pb.ok ? pb.error : undefined}
        />
      </div>
    </CalculatorShell>
  );
}
