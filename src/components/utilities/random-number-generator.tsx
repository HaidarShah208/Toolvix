"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, ResultEmpty, ResultError, ResultHighlight, StatGrid } from "@/components/tools/result";
import { CheckboxField, NumberField, SelectField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { generateRandomNumbers, type RandomNumberResult, type SortOrder } from "@/lib/generators/numbers";
import { formatNumber, parseNumber } from "@/lib/utils/number";

type Kind = "integer" | "decimal";

const KINDS = [
  { value: "integer", label: "Whole numbers" },
  { value: "decimal", label: "Decimals" },
] as const;

const SORTS = [
  { value: "none", label: "Don't sort" },
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
] as const;

const MAX_COUNT = 1000;

/** Adds digit grouping to an exact decimal string without converting it to a float. */
function group(value: string): string {
  const neg = value.startsWith("-");
  const [int, frac] = (neg ? value.slice(1) : value).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${neg ? "−" : ""}${grouped}${frac !== undefined ? `.${frac}` : ""}`;
}

export default function RandomNumberGenerator() {
  const [minText, setMinText] = useState("1");
  const [maxText, setMaxText] = useState("100");
  const [countText, setCountText] = useState("1");
  const [kind, setKind] = useState<Kind>("integer");
  const [decimalsText, setDecimalsText] = useState("2");
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [sort, setSort] = useState<SortOrder>("none");
  const [outcome, setOutcome] = useState<{ ok: true; value: RandomNumberResult } | { ok: false; error: string } | null>(
    null,
  );

  const integer = kind === "integer";
  const pMin = parseNumber(minText, { label: "Minimum", integer });
  const pMax = parseNumber(maxText, { label: "Maximum", integer });
  const pCount = parseNumber(countText, { label: "How many", integer: true, min: 1, max: MAX_COUNT });
  const pDec = parseNumber(decimalsText, { label: "Decimal places", integer: true, min: 1, max: 10 });

  function generate() {
    if (!pMin.ok || !pMax.ok || !pCount.ok || (!integer && !pDec.ok)) {
      const first = [pMin, pMax, pCount, integer ? null : pDec].find((p) => p && !p.ok);
      setOutcome({ ok: false, error: first && !first.ok ? first.error : "Check the highlighted fields." });
      return;
    }
    setOutcome(
      generateRandomNumbers({
        min: pMin.value,
        max: pMax.value,
        count: pCount.value,
        decimals: integer ? 0 : pDec.ok ? pDec.value : 2,
        allowDuplicates,
        sort,
      }),
    );
  }

  function reset() {
    setMinText("1");
    setMaxText("100");
    setCountText("1");
    setKind("integer");
    setDecimalsText("2");
    setAllowDuplicates(true);
    setSort("none");
    setOutcome(null);
  }

  let result: React.ReactNode;
  if (!outcome) {
    result = <ResultEmpty>Set a range and press Generate. Numbers are drawn with your browser&apos;s secure random generator.</ResultEmpty>;
  } else if (!outcome.ok) {
    result = <ResultError>{outcome.error}</ResultError>;
  } else {
    const r = outcome.value;
    const lines = r.values.join("\n");
    result =
      r.values.length === 1 ? (
        <>
          <ResultHighlight label="Your random number" value={group(r.values[0])} />
          <ResultActions>
            <CopyButton text={r.values[0]} label="Copy number" />
          </ResultActions>
        </>
      ) : (
        <>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-sm font-medium text-muted">{formatNumber(r.values.length)} random numbers</p>
            <ol className="tabular mt-2 flex max-h-72 flex-wrap gap-1.5 overflow-y-auto font-mono text-sm text-foreground">
              {r.values.map((v, i) => (
                <li key={i} className="rounded-md bg-surface-muted px-2 py-0.5 ring-1 ring-border">
                  {group(v)}
                </li>
              ))}
            </ol>
          </div>
          <StatGrid
            columns={3}
            items={[
              { label: "Sum", value: group(r.sum) },
              { label: "Smallest", value: group(r.min) },
              { label: "Largest", value: group(r.max) },
            ]}
          />
          <ResultActions>
            <CopyButton text={lines} label="Copy (one per line)" />
            <CopyButton text={r.values.join(", ")} label="Copy comma-separated" />
          </ResultActions>
        </>
      );
  }

  return (
    <CalculatorShell
      title="Random number generator"
      result={result}
      onSubmit={generate}
      submitLabel="Generate"
      onReset={reset}
      toolbar={<Segmented label="Number type" options={KINDS} value={kind} onChange={setKind} />}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Minimum"
          value={minText}
          onChange={(e) => setMinText(e.target.value)}
          error={minText.trim() !== "" && !pMin.ok ? pMin.error : undefined}
        />
        <NumberField
          label="Maximum"
          value={maxText}
          onChange={(e) => setMaxText(e.target.value)}
          error={maxText.trim() !== "" && !pMax.ok ? pMax.error : undefined}
        />
        <NumberField
          label="How many numbers"
          inputMode="numeric"
          value={countText}
          onChange={(e) => setCountText(e.target.value)}
          hint={`1–${formatNumber(MAX_COUNT)}`}
          error={countText.trim() !== "" && !pCount.ok ? pCount.error : undefined}
        />
        {integer ? null : (
          <NumberField
            label="Decimal places"
            inputMode="numeric"
            value={decimalsText}
            onChange={(e) => setDecimalsText(e.target.value)}
            hint="1–10"
            error={decimalsText.trim() !== "" && !pDec.ok ? pDec.error : undefined}
          />
        )}
        <SelectField
          label="Sort results"
          options={SORTS}
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOrder)}
        />
      </div>
      <CheckboxField
        label="Allow duplicates"
        description="Uncheck to draw unique numbers only, like picking raffle tickets."
        checked={allowDuplicates}
        onChange={(e) => setAllowDuplicates(e.target.checked)}
      />
    </CalculatorShell>
  );
}
