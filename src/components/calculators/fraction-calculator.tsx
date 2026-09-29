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
import { NumberField, SelectField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  calculateFractions,
  formatBig,
  fractionText,
  isFieldsEmpty,
  mixedText,
  OP_SYMBOL,
  parseFraction,
  simplify,
  toDecimal,
  toMixed,
  type Fraction,
  type FractionFields,
  type FractionOp,
} from "@/lib/calculators/fraction";

type Mode = "calculate" | "simplify";

const MODES = [
  { value: "calculate", label: "Calculate" },
  { value: "simplify", label: "Simplify a fraction" },
] as const;

const OPS: readonly { value: FractionOp; label: string }[] = [
  { value: "add", label: "+ Add" },
  { value: "subtract", label: "− Subtract" },
  { value: "multiply", label: "× Multiply" },
  { value: "divide", label: "÷ Divide" },
];

const EMPTY: FractionFields = { whole: "", numerator: "", denominator: "" };

/** Visually stacked fraction with a plain-text equivalent for screen readers. */
function Stacked({ n, d, negative }: { n: bigint; d: bigint; negative?: boolean }) {
  return (
    <span className="inline-flex flex-col items-center align-middle leading-none">
      <span className="px-1 pb-1">{negative ? "−" : ""}{formatBig(n)}</span>
      <span className="w-full border-t-2 border-current" />
      <span className="px-1 pt-1">{formatBig(d)}</span>
    </span>
  );
}

function FractionDisplay({ f, mixed }: { f: Fraction; mixed?: boolean }) {
  const text = mixed ? mixedText(f) : fractionText(f);
  let visual: ReactNode;
  if (f.d === BigInt(1)) {
    visual = formatBig(f.n);
  } else if (mixed) {
    const m = toMixed(f);
    visual =
      m.whole === BigInt(0) ? (
        <Stacked n={m.n} d={m.d} negative={m.negative} />
      ) : (
        <span className="inline-flex items-center gap-2">
          <span>{m.negative ? "−" : ""}{formatBig(m.whole)}</span>
          <Stacked n={m.n} d={m.d} />
        </span>
      );
  } else {
    const negative = f.n < BigInt(0);
    visual = <Stacked n={negative ? -f.n : f.n} d={f.d} negative={negative} />;
  }
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{visual}</span>
    </>
  );
}

function FractionInputs({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value: FractionFields;
  onChange: (v: FractionFields) => void;
}) {
  return (
    <fieldset className="min-w-0 rounded-xl border border-border p-4">
      <legend className="px-1 text-sm font-semibold text-foreground">{legend}</legend>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-3">
        <NumberField
          label="Whole (optional)"
          inputMode="numeric"
          value={value.whole}
          onChange={(e) => onChange({ ...value, whole: e.target.value })}
          placeholder="—"
        />
        <div className="flex min-w-0 flex-col gap-2">
          <NumberField
            label="Numerator"
            inputMode="numeric"
            value={value.numerator}
            onChange={(e) => onChange({ ...value, numerator: e.target.value })}
            placeholder="1"
          />
          <div className="border-t-2 border-border-strong" aria-hidden="true" />
          <NumberField
            label="Denominator"
            inputMode="numeric"
            value={value.denominator}
            onChange={(e) => onChange({ ...value, denominator: e.target.value })}
            placeholder="2"
          />
        </div>
      </div>
    </fieldset>
  );
}

function decimalStats(f: Fraction) {
  const dec = toDecimal(f);
  return {
    label: "Decimal",
    value: dec.exact ? dec.rounded : `≈ ${dec.rounded}`,
    hint: dec.repeating ? `Repeating: ${dec.repeating} (digits in brackets repeat forever)` : dec.exact ? "Exact" : "Rounded to 10 decimal places",
  };
}

export default function FractionCalculator() {
  const [mode, setMode] = useState<Mode>("calculate");
  const [a, setA] = useState<FractionFields>(EMPTY);
  const [b, setB] = useState<FractionFields>(EMPTY);
  const [op, setOp] = useState<FractionOp>("add");
  const [single, setSingle] = useState<FractionFields>(EMPTY);

  function reset() {
    setA(EMPTY);
    setB(EMPTY);
    setOp("add");
    setSingle(EMPTY);
  }

  let result: ReactNode;
  let inputs: ReactNode;

  if (mode === "calculate") {
    inputs = (
      <>
        <FractionInputs legend="First fraction" value={a} onChange={setA} />
        <SelectField label="Operation" value={op} onChange={(e) => setOp(e.target.value as FractionOp)} options={OPS} />
        <FractionInputs legend="Second fraction" value={b} onChange={setB} />
        <p className="text-xs text-subtle">Whole numbers only. For a mixed number like −1 ½, put the minus sign on the whole number.</p>
      </>
    );
    if (isFieldsEmpty(a) || isFieldsEmpty(b)) {
      result = <ResultEmpty>Enter two fractions to see the answer as a fraction, mixed number and decimal.</ResultEmpty>;
    } else {
      const fa = parseFraction(a, "the first fraction");
      const fb = parseFraction(b, "the second fraction");
      if (!fa.ok || !fb.ok) {
        result = <ResultError>{!fa.ok ? fa.error : !fb.ok ? fb.error : ""}</ResultError>;
      } else {
        const r = calculateFractions(fa.value, fb.value, op);
        if (!r.ok) {
          result = <ResultError>{r.error}</ResultError>;
        } else {
          const v = r.value;
          const expr = `${fractionText(v.a)} ${OP_SYMBOL[op]} ${fractionText(v.b)}`;
          const dec = decimalStats(v.result);
          const steps: ReactNode[] = [];
          if (a.whole.trim() !== "" || b.whole.trim() !== "") {
            steps.push(`Convert mixed numbers to improper fractions: ${expr}.`);
          }
          steps.push(...v.steps);
          const summary = [
            `${expr} = ${fractionText(v.result)}`,
            v.result.d !== BigInt(1) ? `Mixed number: ${mixedText(v.result)}` : null,
            `Decimal: ${dec.value}`,
          ]
            .filter(Boolean)
            .join("\n");
          result = (
            <>
              <ResultHighlight label={`${expr} =`} value={<FractionDisplay f={v.result} />} />
              <StatGrid
                items={[
                  { label: "Mixed number", value: <FractionDisplay f={v.result} mixed /> },
                  dec,
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
    }
  } else {
    inputs = (
      <>
        <FractionInputs legend="Fraction to simplify" value={single} onChange={setSingle} />
        <p className="text-xs text-subtle">Whole numbers only. Leave the whole-number box empty for a plain fraction.</p>
      </>
    );
    if (isFieldsEmpty(single)) {
      result = <ResultEmpty>Enter a fraction to reduce it to lowest terms.</ResultEmpty>;
    } else {
      const f = parseFraction(single, "the fraction");
      if (!f.ok) {
        result = <ResultError>{f.error}</ResultError>;
      } else {
        const { result: s, divisor } = simplify(f.value);
        const dec = decimalStats(s);
        const original = fractionText(f.value);
        const steps: ReactNode[] = [];
        if (single.whole.trim() !== "" && single.numerator.trim() !== "") {
          steps.push(`Convert the mixed number to an improper fraction: ${original}.`);
        }
        if (f.value.n === BigInt(0)) {
          steps.push("The numerator is 0, so the fraction equals 0.");
        } else if (divisor > BigInt(1)) {
          steps.push(`Find the greatest common divisor of ${formatBig(f.value.n < BigInt(0) ? -f.value.n : f.value.n)} and ${formatBig(f.value.d)}: ${formatBig(divisor)}.`);
          steps.push(`Divide the numerator and denominator by ${formatBig(divisor)}: ${fractionText(s)}.`);
        } else {
          steps.push(`The GCD of the numerator and denominator is 1, so ${original} is already in lowest terms.`);
        }
        const summary = [`${original} = ${fractionText(s)}`, s.d !== BigInt(1) ? `Mixed number: ${mixedText(s)}` : null, `Decimal: ${dec.value}`]
          .filter(Boolean)
          .join("\n");
        result = (
          <>
            <ResultHighlight label={`${original} in simplest form`} value={<FractionDisplay f={s} />} />
            <StatGrid
              items={[
                { label: "Mixed number", value: <FractionDisplay f={s} mixed /> },
                dec,
                { label: "Greatest common divisor", value: formatBig(f.value.n === BigInt(0) ? f.value.d : divisor) },
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
  }

  return (
    <CalculatorShell
      title="Fraction calculator"
      onReset={reset}
      toolbar={<Segmented label="Calculator mode" options={MODES} value={mode} onChange={setMode} />}
      result={result}
    >
      {inputs}
    </CalculatorShell>
  );
}
