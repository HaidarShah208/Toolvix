"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Badge, ResultActions, ResultError } from "@/components/tools/result";
import { CheckboxField, NumberField, TextareaField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { countLoremWords, generateLorem, LOREM_LIMITS, type LoremUnit } from "@/lib/generators/lorem";
import { formatNumber, parseNumber } from "@/lib/utils/number";

const UNITS = [
  { value: "paragraphs", label: "Paragraphs" },
  { value: "sentences", label: "Sentences" },
  { value: "words", label: "Words" },
] as const;

const DEFAULT_AMOUNT: Record<LoremUnit, string> = { paragraphs: "3", sentences: "5", words: "50" };

/** Fixed seed for the first render so server and client output match. */
const INITIAL_SEED = 20240611;

function newSeed(): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0];
}

export default function LoremIpsumGenerator() {
  const [unit, setUnit] = useState<LoremUnit>("paragraphs");
  const [amountText, setAmountText] = useState(DEFAULT_AMOUNT.paragraphs);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [htmlParagraphs, setHtmlParagraphs] = useState(false);
  const [seed, setSeed] = useState(INITIAL_SEED);

  const unitLabel = UNITS.find((u) => u.value === unit)?.label ?? "Amount";
  const amount = parseNumber(amountText, {
    label: `Number of ${unitLabel.toLowerCase()}`,
    integer: true,
    min: 1,
    max: LOREM_LIMITS[unit],
  });

  const amountValue = amount.ok ? amount.value : null;
  const output = useMemo(
    () =>
      amountValue === null ? "" : generateLorem({ unit, amount: amountValue, startWithLorem, htmlParagraphs }, seed),
    [amountValue, unit, startWithLorem, htmlParagraphs, seed],
  );
  const wordCount = countLoremWords(output);

  function reset() {
    setUnit("paragraphs");
    setAmountText(DEFAULT_AMOUNT.paragraphs);
    setStartWithLorem(true);
    setHtmlParagraphs(false);
    setSeed(INITIAL_SEED);
  }

  const result = !amount.ok ? (
    <ResultError>{amount.error}</ResultError>
  ) : (
    <>
      <TextareaField
        label="Generated text"
        value={output}
        readOnly
        rows={12}
        className="min-h-72"
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResultActions>
          <CopyButton text={output} label="Copy text" />
        </ResultActions>
        <Badge>{formatNumber(wordCount)} words</Badge>
      </div>
    </>
  );

  return (
    <CalculatorShell
      title="Lorem ipsum generator"
      result={result}
      onSubmit={() => setSeed(newSeed())}
      submitLabel="Generate new text"
      onReset={reset}
      toolbar={
        <Segmented
          label="Generate by"
          options={UNITS}
          value={unit}
          onChange={(u) => {
            setUnit(u);
            setAmountText(DEFAULT_AMOUNT[u]);
          }}
        />
      }
    >
      <NumberField
        label={`Number of ${unitLabel.toLowerCase()}`}
        inputMode="numeric"
        value={amountText}
        onChange={(e) => setAmountText(e.target.value)}
        hint={`1–${formatNumber(LOREM_LIMITS[unit])}`}
        error={!amount.ok ? amount.error : undefined}
      />
      <CheckboxField
        label="Start with “Lorem ipsum dolor sit amet…”"
        checked={startWithLorem}
        onChange={(e) => setStartWithLorem(e.target.checked)}
      />
      <CheckboxField
        label="Wrap paragraphs in <p> tags"
        description="Handy for pasting straight into HTML templates."
        checked={htmlParagraphs}
        onChange={(e) => setHtmlParagraphs(e.target.checked)}
      />
    </CalculatorShell>
  );
}
