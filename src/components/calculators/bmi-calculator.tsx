"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import {
  Badge,
  ResultActions,
  ResultEmpty,
  ResultError,
  ResultHighlight,
  ResultSteps,
  StatGrid,
} from "@/components/tools/result";
import { ShareButton } from "@/components/tools/share-button";
import { NumberField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  BMI_CATEGORIES,
  calculateBmi,
  cmToFeetInches,
  feetInchesToCm,
  kgToLb,
  lbToKg,
  validateHeightCm,
  validateWeightKg,
  type BmiCategoryId,
} from "@/lib/calculators/bmi";
import { clamp, formatNumber, parseNumber, roundTo } from "@/lib/utils/number";

type Unit = "metric" | "imperial";

const UNITS = [
  { value: "metric", label: "Metric (cm, kg)" },
  { value: "imperial", label: "Imperial (ft, in, lb)" },
] as const;

/** Visible range of the scale bar. */
const SCALE_MIN = 15;
const SCALE_MAX = 42;

const SEGMENT_CLASS: Record<BmiCategoryId, string> = {
  underweight: "bg-warning/60",
  healthy: "bg-success/70",
  overweight: "bg-warning/70",
  obese1: "bg-danger/50",
  obese2: "bg-danger/70",
  obese3: "bg-danger/90",
};

const NOTE =
  "BMI is a screening measure, not a diagnosis. These categories are for adults aged 18 and over; they are not suitable for children, during pregnancy, or for very muscular people.";

function ScaleBar({ bmi }: { bmi: number }) {
  const pos = ((clamp(bmi, SCALE_MIN, SCALE_MAX) - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
  const bounds = BMI_CATEGORIES.map((c, i) => {
    const start = Math.max(c.min, SCALE_MIN);
    const end = i + 1 < BMI_CATEGORIES.length ? BMI_CATEGORIES[i + 1].min : SCALE_MAX;
    return { id: c.id, width: ((end - start) / (SCALE_MAX - SCALE_MIN)) * 100 };
  });
  return (
    <div aria-hidden="true" className="px-1 pt-5">
      <div className="relative">
        <div className="flex h-3 overflow-hidden rounded-full">
          {bounds.map((b) => (
            <div key={b.id} className={SEGMENT_CLASS[b.id]} style={{ width: `${b.width}%` }} />
          ))}
        </div>
        <div className="absolute -top-5 -translate-x-1/2" style={{ left: `${pos}%` }}>
          <div className="flex flex-col items-center">
            <span className="tabular text-xs font-semibold text-foreground">{formatNumber(bmi, 1, 1)}</span>
            <span className="h-5 w-0.5 rounded-full bg-foreground" />
          </div>
        </div>
      </div>
      <div className="tabular relative mt-1.5 h-4 text-[11px] text-subtle">
        {[18.5, 25, 30, 35, 40].map((t) => (
          <span
            key={t}
            className="absolute -translate-x-1/2"
            style={{ left: `${((t - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100}%` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function BmiCalculator() {
  const [unit, setUnit] = useState<Unit>("metric");
  const [cm, setCm] = useState("");
  const [kg, setKg] = useState("");
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");
  const [lb, setLb] = useState("");

  function reset() {
    setCm("");
    setKg("");
    setFt("");
    setInch("");
    setLb("");
  }

  // Parse inputs for the active unit system.
  const pCm = parseNumber(cm, { label: "Height", allowNegative: false });
  const pKg = parseNumber(kg, { label: "Weight", allowNegative: false });
  const pFt = parseNumber(ft, { label: "Feet", allowNegative: false, integer: true, max: 9 });
  const pIn = inch.trim() === "" ? ({ ok: true, value: 0 } as const) : parseNumber(inch, { label: "Inches", allowNegative: false, max: 11.99 });
  const pLb = parseNumber(lb, { label: "Weight", allowNegative: false });

  function switchUnit(next: Unit) {
    if (next === unit) return;
    if (next === "imperial") {
      if (pCm.ok && pCm.value > 0) {
        const { feet, inches } = cmToFeetInches(pCm.value);
        setFt(String(feet));
        setInch(inches ? String(inches) : "");
      }
      if (pKg.ok && pKg.value > 0) setLb(String(roundTo(kgToLb(pKg.value), 1)));
    } else {
      if (pFt.ok && pIn.ok && (pFt.value > 0 || pIn.value > 0)) {
        setCm(String(roundTo(feetInchesToCm(pFt.value, pIn.value), 1)));
      }
      if (pLb.ok && pLb.value > 0) setKg(String(roundTo(lbToKg(pLb.value), 1)));
    }
    setUnit(next);
  }

  const metric = unit === "metric";
  const heightEmpty = metric ? cm.trim() === "" : ft.trim() === "" && inch.trim() === "";
  const weightEmpty = metric ? kg.trim() === "" : lb.trim() === "";

  let heightCm: number | null = null;
  let heightError: string | undefined;
  if (metric) {
    if (cm.trim() !== "") {
      if (!pCm.ok) heightError = pCm.error;
      else heightCm = pCm.value;
    }
  } else if (!heightEmpty) {
    const feetOk = ft.trim() === "" ? ({ ok: true, value: 0 } as const) : pFt;
    if (!feetOk.ok) heightError = feetOk.error;
    else if (!pIn.ok) heightError = pIn.error;
    else heightCm = feetInchesToCm(feetOk.value, pIn.value);
  }
  if (heightCm !== null && !heightError) {
    const e = validateHeightCm(heightCm);
    if (e) heightError = e;
  }

  let weightKg: number | null = null;
  let weightError: string | undefined;
  if (!weightEmpty) {
    const p = metric ? pKg : pLb;
    if (!p.ok) weightError = p.error;
    else {
      weightKg = metric ? p.value : lbToKg(p.value);
      const e = validateWeightKg(weightKg);
      if (e) weightError = e;
    }
  }

  let result: React.ReactNode;
  if (heightEmpty || weightEmpty) {
    result = (
      <>
        <ResultEmpty>Enter your height and weight to see your BMI.</ResultEmpty>
        <Alert>{NOTE}</Alert>
      </>
    );
  } else if (heightError || weightError || heightCm === null || weightKg === null) {
    result = (
      <>
        <ResultError>{heightError ?? weightError ?? "Check your height and weight."}</ResultError>
        <Alert>{NOTE}</Alert>
      </>
    );
  } else {
    const r = calculateBmi(heightCm, weightKg);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const bmiText = formatNumber(v.bmi, 1, 1);
      const cat = v.category;
      const range = metric
        ? `${formatNumber(v.healthyMinKg, 1, 1)}–${formatNumber(v.healthyMaxKg, 1, 1)} kg`
        : `${formatNumber(kgToLb(v.healthyMinKg), 1, 1)}–${formatNumber(kgToLb(v.healthyMaxKg), 1, 1)} lb`;
      const heightText = metric
        ? `${formatNumber(heightCm, 1)} cm`
        : `${pFt.ok ? pFt.value : 0} ft ${formatNumber(pIn.ok ? pIn.value : 0, 2)} in`;
      const weightText = metric ? `${formatNumber(weightKg, 1)} kg` : `${formatNumber(pLb.ok ? pLb.value : 0, 1)} lb`;
      const m2 = v.heightM * v.heightM;
      const summary = [
        `BMI: ${bmiText} (${cat.label}, ${cat.range})`,
        `Height ${heightText}, weight ${weightText}`,
        `Healthy weight range for this height (BMI 18.5–24.9): ${range}`,
        NOTE,
      ].join("\n");

      const steps: string[] = [];
      if (metric) {
        steps.push(`Convert height to meters: ${formatNumber(heightCm, 2)} cm ÷ 100 = ${formatNumber(v.heightM, 4)} m`);
      } else {
        const totalIn = heightCm / 2.54;
        steps.push(
          `Convert height: ${heightText} = ${formatNumber(totalIn, 2)} in × 2.54 = ${formatNumber(heightCm, 2)} cm = ${formatNumber(v.heightM, 4)} m`,
          `Convert weight: ${weightText} × 0.4536 = ${formatNumber(weightKg, 2)} kg`,
        );
      }
      steps.push(
        `Square the height: ${formatNumber(v.heightM, 4)}² = ${formatNumber(m2, 4)} m²`,
        `BMI = weight ÷ height² = ${formatNumber(weightKg, 2)} ÷ ${formatNumber(m2, 4)} = ${formatNumber(v.bmiExact, 3)} ≈ ${bmiText}`,
        `Healthy range: 18.5 × ${formatNumber(m2, 4)} to 24.9 × ${formatNumber(m2, 4)} = ${range}`,
      );

      result = (
        <>
          <ResultHighlight
            label="Your BMI"
            value={bmiText}
            badge={<Badge tone={cat.tone}>{cat.label}</Badge>}
            sub={`${cat.label} is a BMI ${cat.range} for adults.`}
          />
          <div className="rounded-xl border border-border bg-surface px-4 pt-2 pb-3">
            <ScaleBar bmi={v.bmi} />
            <p className="mt-2 text-sm text-muted">
              Your BMI of {bmiText} falls in the <span className="font-medium text-foreground">{cat.label}</span> range
              ({cat.range}). Healthy weight is 18.5–24.9.
            </p>
          </div>
          <StatGrid
            items={[
              { label: "Healthy weight for your height", value: range, hint: "BMI 18.5–24.9" },
              { label: "Category", value: cat.label, hint: `BMI ${cat.range}` },
            ]}
          />
          <ResultSteps steps={steps} />
          <Alert>{NOTE}</Alert>
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
            <ShareButton title="BMI Calculator" text={`My BMI is ${bmiText} (${cat.label}).`} />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell
      title="BMI calculator"
      onReset={reset}
      toolbar={<Segmented label="Units" options={UNITS} value={unit} onChange={switchUnit} />}
      result={result}
    >
      {metric ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <NumberField
            label="Height"
            suffix="cm"
            placeholder="175"
            value={cm}
            onChange={(e) => setCm(e.target.value)}
            error={heightError}
          />
          <NumberField
            label="Weight"
            suffix="kg"
            placeholder="70"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            error={weightError}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset className="min-w-0">
            <legend className="mb-1.5 text-sm font-medium text-foreground">Height</legend>
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Feet"
                hideLabel
                suffix="ft"
                placeholder="5"
                inputMode="numeric"
                value={ft}
                onChange={(e) => setFt(e.target.value)}
              />
              <NumberField
                label="Inches"
                hideLabel
                suffix="in"
                placeholder="9"
                value={inch}
                onChange={(e) => setInch(e.target.value)}
              />
            </div>
            {heightError ? (
              <p className="mt-1.5 text-sm text-danger" role="alert">
                {heightError}
              </p>
            ) : null}
          </fieldset>
          <NumberField
            label="Weight"
            suffix="lb"
            placeholder="154"
            value={lb}
            onChange={(e) => setLb(e.target.value)}
            error={weightError}
          />
        </div>
      )}
    </CalculatorShell>
  );
}
