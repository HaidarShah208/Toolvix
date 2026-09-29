"use client";

import { useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { DataTable, ResultActions, ResultEmpty, ResultError, ResultSteps, StatGrid } from "@/components/tools/result";
import { ShareButton } from "@/components/tools/share-button";
import { NumberField, SelectField } from "@/components/ui/field";
import {
  TEMP_NAME,
  TEMP_SYMBOL,
  convertTemperature,
  formatSig,
  plainSig,
  temperatureWorking,
  validateValue,
  type TempUnit,
} from "@/lib/converters/units";
import { parseNumber } from "@/lib/utils/number";

const UNITS: TempUnit[] = ["c", "f", "k", "r"];
const OPTIONS = UNITS.map((x) => ({ value: x, label: `${TEMP_NAME[x]} (${TEMP_SYMBOL[x]})` }));

const REFERENCE: { label: string; celsius: number }[] = [
  { label: "Absolute zero", celsius: -273.15 },
  { label: "Water freezes", celsius: 0 },
  { label: "Room temperature", celsius: 20 },
  { label: "Body temperature", celsius: 37 },
  { label: "Water boils (sea level)", celsius: 100 },
  { label: "Moderate oven", celsius: 180 },
];

export default function TemperatureConverter() {
  const [value, setValue] = useState("25");
  const [unit, setUnit] = useState<TempUnit>("c");

  const parsed = parseNumber(value, { label: "Temperature" });
  const empty = value.trim() === "";
  const rangeError = parsed.ok ? validateValue(parsed.value, "temperature", unit) : null;

  let result: ReactNode;
  if (empty) {
    result = <ResultEmpty>Enter a temperature to see it in Celsius, Fahrenheit, Kelvin and Rankine.</ResultEmpty>;
  } else if (!parsed.ok) {
    result = <ResultError>{parsed.error}</ResultError>;
  } else if (rangeError) {
    result = <ResultError>{rangeError}</ResultError>;
  } else {
    const v = parsed.value;
    const values = UNITS.map((to) => ({ to, value: convertTemperature(v, unit, to) }));
    const summary = values.map((x) => `${formatSig(x.value)} ${TEMP_SYMBOL[x.to]}`).join(" = ");
    result = (
      <>
        <StatGrid
          items={values.map((x) => ({
            label: TEMP_NAME[x.to],
            value: `${formatSig(x.value)} ${TEMP_SYMBOL[x.to]}`,
            hint: x.to === unit ? "Your input" : undefined,
          }))}
        />
        <ResultSteps
          title="Formulas used"
          steps={UNITS.filter((to) => to !== unit).map((to) => temperatureWorking(v, unit, to))}
        />
        <ResultActions>
          <CopyButton text={summary} label="Copy all" />
          {UNITS.filter((to) => to !== unit).map((to) => (
            <CopyButton
              key={to}
              text={plainSig(convertTemperature(v, unit, to))}
              label={`Copy ${TEMP_SYMBOL[to]}`}
            />
          ))}
          <ShareButton title="Temperature Converter" text={summary} />
        </ResultActions>
      </>
    );
  }

  return (
    <CalculatorShell
      title="Temperature converter"
      onReset={() => {
        setValue("25");
        setUnit("c");
      }}
      result={result}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Temperature"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="25"
          suffix={TEMP_SYMBOL[unit]}
          error={!empty && !parsed.ok ? parsed.error : undefined}
        />
        <SelectField
          label="Unit"
          options={OPTIONS}
          value={unit}
          onChange={(e) => setUnit(e.target.value as TempUnit)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Common temperatures</p>
        <DataTable
          caption="Common reference temperatures in four scales"
          columns={[
            { key: "label", label: "Reference" },
            { key: "c", label: "°C", align: "right" },
            { key: "f", label: "°F", align: "right" },
            { key: "k", label: "K", align: "right" },
          ]}
          rows={REFERENCE.map((r) => ({
            label: r.label,
            c: formatSig(r.celsius),
            f: formatSig(convertTemperature(r.celsius, "c", "f")),
            k: formatSig(convertTemperature(r.celsius, "c", "k")),
          }))}
        />
      </div>
    </CalculatorShell>
  );
}
