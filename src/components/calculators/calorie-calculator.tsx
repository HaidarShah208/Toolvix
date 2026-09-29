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
import { Alert } from "@/components/ui/alert";
import { NumberField, SelectField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  ACTIVITY_LEVELS,
  calorieNeeds,
  CM_PER_INCH,
  KG_PER_LB,
  type ActivityLevel,
  type Sex,
} from "@/lib/calculators/calorie";
import { formatNumber, parseNumber, type ParseResult } from "@/lib/utils/number";

type Units = "metric" | "imperial";

const UNIT_OPTIONS = [
  { value: "metric", label: "Metric (cm, kg)" },
  { value: "imperial", label: "Imperial (ft, lb)" },
] as const;

const SEX_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

const ACTIVITY_OPTIONS = ACTIVITY_LEVELS.map((l) => ({ value: l.value, label: `${l.label} (×${l.factor})` }));

const kcal = (v: number) => `${formatNumber(Math.round(v))} kcal`;

function err(raw: string, p: ParseResult): string | undefined {
  return raw.trim() !== "" && !p.ok ? p.error : undefined;
}

export default function CalorieCalculator() {
  const [units, setUnits] = useState<Units>("metric");
  const [sex, setSex] = useState<Sex>("male");
  const [age, setAge] = useState("");
  const [cm, setCm] = useState("");
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");
  const [kg, setKg] = useState("");
  const [lb, setLb] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("sedentary");

  function reset() {
    setAge("");
    setCm("");
    setFt("");
    setInch("");
    setKg("");
    setLb("");
    setSex("male");
    setActivity("sedentary");
  }

  const pAge = parseNumber(age, { label: "Age", integer: true, min: 15, max: 80 });
  const pCm = parseNumber(cm, { label: "Height", allowNegative: false });
  const pFt = parseNumber(ft, { label: "Feet", allowNegative: false, integer: true });
  const pIn = inch.trim() === "" ? ({ ok: true, value: 0 } as const) : parseNumber(inch, { label: "Inches", allowNegative: false, max: 11.99 });
  const pKg = parseNumber(kg, { label: "Weight", allowNegative: false });
  const pLb = parseNumber(lb, { label: "Weight", allowNegative: false });

  const level = ACTIVITY_LEVELS.find((l) => l.value === activity) ?? ACTIVITY_LEVELS[0];
  const metric = units === "metric";
  const empty = age.trim() === "" || (metric ? cm.trim() === "" || kg.trim() === "" : ft.trim() === "" || lb.trim() === "");

  let result: ReactNode;
  if (empty) {
    result = <ResultEmpty>Enter your age, height and weight to estimate your daily calorie needs.</ResultEmpty>;
  } else {
    const checks: ParseResult[] = metric ? [pAge, pCm, pKg] : [pAge, pFt, pIn, pLb];
    const bad = checks.find((c) => !c.ok);
    if (bad && !bad.ok) {
      result = <ResultError>{bad.error}</ResultError>;
    } else {
      const val = (p: ParseResult) => (p.ok ? p.value : 0);
      const heightCm = metric ? val(pCm) : (val(pFt) * 12 + val(pIn)) * CM_PER_INCH;
      const weightKg = metric ? val(pKg) : val(pLb) * KG_PER_LB;
      const r = calorieNeeds({ sex, age: val(pAge), heightCm, weightKg, activity });
      if (!r.ok) {
        result = <ResultError>{r.error}</ResultError>;
      } else {
        const v = r.value;
        const anyLow = v.targets.some((t) => t.belowMinimum);
        const summary = [
          `BMR: ${kcal(v.bmr)}/day`,
          `Maintenance (${level.label.toLowerCase()}): ${kcal(v.tdee)}/day`,
          ...v.targets.map((t) => `${t.label}: ${kcal(t.calories)}/day`),
          "Estimates from the Mifflin–St Jeor equation; not medical advice.",
        ].join("\n");
        result = (
          <>
            <ResultHighlight
              label="Maintenance calories (TDEE)"
              value={`${formatNumber(Math.round(v.tdee))} kcal/day`}
              sub={`Estimated to keep your weight steady at a ${level.label.toLowerCase()} level.`}
            />
            <StatGrid
              items={[
                { label: "Basal metabolic rate (BMR)", value: `${formatNumber(Math.round(v.bmr))} kcal/day`, hint: "Energy used at complete rest" },
                { label: "Activity multiplier", value: `×${v.factor}`, hint: level.description },
              ]}
            />
            <DataTable
              caption="Daily calorie targets for weight change"
              columns={[
                { key: "goal", label: "Goal" },
                { key: "kcal", label: "Calories/day", align: "right" },
                { key: "change", label: "Approx. change/week", align: "right" },
              ]}
              rows={v.targets.map((t) => ({
                goal: t.label,
                kcal: (
                  <span className={t.belowMinimum ? "font-semibold text-warning" : undefined}>
                    {kcal(t.calories)}
                    {t.belowMinimum ? " (low)" : ""}
                  </span>
                ),
                change: metric
                  ? `~${t.weeklyKg > 0 ? "+" : "−"}${Math.abs(t.weeklyKg)} kg`
                  : `~${t.weeklyLb > 0 ? "+" : "−"}${Math.abs(t.weeklyLb)} lb`,
              }))}
            />
            {anyLow ? (
              <Alert tone="warning">
                One or more targets are below {formatNumber(v.minimum)} kcal a day, a level generally not advised for{" "}
                {sex === "male" ? "men" : "women"} without medical supervision. Consider a slower rate of loss.
              </Alert>
            ) : null}
            <ResultSteps
              steps={[
                `Mifflin–St Jeor: BMR = 10 × ${formatNumber(weightKg, 1)} kg + 6.25 × ${formatNumber(heightCm, 1)} cm − 5 × ${val(pAge)} ${sex === "male" ? "+ 5" : "− 161"} = ${formatNumber(v.bmr, 1)} kcal.`,
                `Maintenance = BMR × activity factor = ${formatNumber(v.bmr, 1)} × ${v.factor} = ${formatNumber(v.tdee, 1)} kcal.`,
                "Targets add or subtract 250 or 500 kcal a day. A 500 kcal daily deficit is roughly 0.5 kg (about 1 lb) a week.",
              ]}
            />
            <p className="text-xs text-subtle">
              These are estimates for healthy adults, not medical advice. Actual needs vary; check with a doctor or dietitian
              before a major change, especially if pregnant, breastfeeding or managing a health condition.
            </p>
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
      title="Calorie calculator"
      onReset={reset}
      toolbar={<Segmented label="Units" options={UNIT_OPTIONS} value={units} onChange={setUnits} />}
      result={result}
    >
      <div className="flex flex-col gap-1.5">
        <span aria-hidden="true" className="text-sm font-medium text-foreground">
          Sex (used by the equation)
        </span>
        <Segmented label="Sex (used by the equation)" options={SEX_OPTIONS} value={sex} onChange={setSex} size="sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Age"
          inputMode="numeric"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          suffix="years"
          placeholder="30"
          hint="15 to 80"
          error={err(age, pAge)}
        />
        {metric ? (
          <NumberField label="Height" value={cm} onChange={(e) => setCm(e.target.value)} suffix="cm" placeholder="175" error={err(cm, pCm)} />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Height (feet)" inputMode="numeric" value={ft} onChange={(e) => setFt(e.target.value)} suffix="ft" placeholder="5" error={err(ft, pFt)} />
            <NumberField label="Inches" value={inch} onChange={(e) => setInch(e.target.value)} suffix="in" placeholder="9" error={err(inch, pIn)} />
          </div>
        )}
        {metric ? (
          <NumberField label="Weight" value={kg} onChange={(e) => setKg(e.target.value)} suffix="kg" placeholder="70" error={err(kg, pKg)} />
        ) : (
          <NumberField label="Weight" value={lb} onChange={(e) => setLb(e.target.value)} suffix="lb" placeholder="155" error={err(lb, pLb)} />
        )}
        <SelectField
          label="Activity level"
          value={activity}
          onChange={(e) => setActivity(e.target.value as ActivityLevel)}
          options={ACTIVITY_OPTIONS}
          hint={level.description}
        />
      </div>
    </CalculatorShell>
  );
}
