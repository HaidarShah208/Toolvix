"use client";

import { useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import {
  ResultActions,
  ResultEmpty,
  ResultError,
  ResultHighlight,
  ResultSteps,
  StatGrid,
} from "@/components/tools/result";
import { Alert } from "@/components/ui/alert";
import { TextareaField } from "@/components/ui/field";
import { averageStats, MAX_VALUES, parseNumberList } from "@/lib/calculators/average";
import { formatNumber } from "@/lib/utils/number";

const fmt = (v: number) => formatNumber(v, 6);
const SORTED_PREVIEW = 500;

export default function AverageCalculator() {
  const [text, setText] = useState("");

  const parsed = parseNumberList(text);
  const empty = text.trim() === "";

  let result: ReactNode;
  if (empty) {
    result = <ResultEmpty>Type or paste a list of numbers to see the mean, median, mode and more.</ResultEmpty>;
  } else if (parsed.values.length === 0) {
    result = (
      <ResultError>
        No numbers found. Separate values with commas, spaces, semicolons or new lines.
        {parsed.invalid.length ? ` Not recognized: ${parsed.invalid.slice(0, 8).join(", ")}${parsed.invalid.length > 8 ? "…" : ""}` : ""}
      </ResultError>
    );
  } else {
    const r = averageStats(parsed.values);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const s = r.value;
      const modeText = s.modes.length
        ? `${s.modes.map(fmt).join(", ")} (appears ${s.modeFrequency} times)`
        : "No mode";
      const shown = s.sorted.slice(0, SORTED_PREVIEW);
      const invalidUnique = [...new Set(parsed.invalid)];
      const summary = [
        `Count: ${s.count}`,
        `Sum: ${fmt(s.sum)}`,
        `Mean: ${fmt(s.mean)}`,
        `Median: ${fmt(s.median)}`,
        `Mode: ${modeText}`,
        `Range: ${fmt(s.range)} (min ${fmt(s.min)}, max ${fmt(s.max)})`,
        s.geometricMean !== null ? `Geometric mean: ${fmt(s.geometricMean)}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const mid = Math.floor(s.count / 2);
      const steps: ReactNode[] = [
        `Add the ${formatNumber(s.count)} values: sum = ${fmt(s.sum)}.`,
        `Mean = sum ÷ count = ${fmt(s.sum)} ÷ ${formatNumber(s.count)} = ${fmt(s.mean)}.`,
        s.count % 2 === 1
          ? `Median: with an odd count, it's the middle value of the sorted list (position ${mid + 1}) = ${fmt(s.median)}.`
          : `Median: with an even count, average the two middle values (positions ${mid} and ${mid + 1}): (${fmt(s.sorted[mid - 1])} + ${fmt(s.sorted[mid])}) ÷ 2 = ${fmt(s.median)}.`,
        `Range = max − min = ${fmt(s.max)} − ${fmt(s.min)} = ${fmt(s.range)}.`,
      ];

      result = (
        <>
          {invalidUnique.length ? (
            <Alert tone="warning">
              Ignored {parsed.invalid.length} {parsed.invalid.length === 1 ? "entry that isn't a number" : "entries that aren't numbers"}:{" "}
              <span className="break-words">
                {invalidUnique.slice(0, 10).join(", ")}
                {invalidUnique.length > 10 ? ` and ${invalidUnique.length - 10} more` : ""}
              </span>
            </Alert>
          ) : null}
          <ResultHighlight label="Mean (average)" value={fmt(s.mean)} sub={`${formatNumber(s.count)} values, sum ${fmt(s.sum)}`} />
          <StatGrid
            items={[
              { label: "Median", value: fmt(s.median) },
              { label: s.modes.length > 1 ? "Modes" : "Mode", value: s.modes.length ? s.modes.map(fmt).join(", ") : "No mode", hint: s.modes.length ? `Appears ${s.modeFrequency} times` : s.noModeReason },
              { label: "Range", value: fmt(s.range) },
              { label: "Count", value: formatNumber(s.count) },
              { label: "Minimum", value: fmt(s.min) },
              { label: "Maximum", value: fmt(s.max) },
              { label: "Sum", value: fmt(s.sum) },
              {
                label: "Geometric mean",
                value: s.geometricMean !== null ? fmt(s.geometricMean) : "—",
                hint: s.geometricMean !== null ? undefined : "Only defined when every value is above 0",
              },
            ]}
          />
          <ResultSteps steps={steps} />
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Sorted values (smallest to largest)</p>
            <p className="tabular mt-2 max-h-40 overflow-auto text-sm break-words text-muted">
              {shown.map(fmt).join(", ")}
              {s.count > SORTED_PREVIEW ? ` … and ${formatNumber(s.count - SORTED_PREVIEW)} more` : ""}
            </p>
          </div>
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
            <CopyButton text={s.sorted.map(String).join(", ")} label="Copy sorted list" />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell title="Average calculator" onReset={() => setText("")} result={result}>
      <TextareaField
        label="Numbers"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"12, 15, 18, 15, 20\nor one number per line"}
        spellCheck={false}
        hint={`Separate numbers with commas, spaces, semicolons or new lines. Commas always split values, so don't use thousands separators (write 1000, not 1,000). Up to ${MAX_VALUES.toLocaleString("en-US")} values.`}
      />
    </CalculatorShell>
  );
}
