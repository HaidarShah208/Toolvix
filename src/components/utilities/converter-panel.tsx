"use client";

import { ArrowLeftRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { DataTable, ResultActions, ResultEmpty, ResultError, ResultHighlight } from "@/components/tools/result";
import { ShareButton } from "@/components/tools/share-button";
import { Button } from "@/components/ui/button";
import { NumberField, SelectField } from "@/components/ui/field";
import {
  CATEGORIES,
  convert,
  convertAll,
  describeFactor,
  formatSig,
  getUnit,
  plainSig,
  toStonesAndPounds,
  validateValue,
  type UnitCategory,
} from "@/lib/converters/units";
import { parseNumber } from "@/lib/utils/number";

interface Selection {
  category: UnitCategory;
  from: string;
  to: string;
}

/**
 * Reusable converter: value, from unit, swap, to unit, result with copy, and
 * a table of the value in every unit of the category.
 */
export function ConverterPanel({
  title,
  shareTitle,
  category,
  defaultFrom,
  defaultTo,
  toolbar,
  onResetExtra,
}: {
  title: string;
  shareTitle: string;
  category: UnitCategory;
  defaultFrom?: string;
  defaultTo?: string;
  toolbar?: ReactNode;
  onResetExtra?: () => void;
}) {
  const cat = CATEGORIES[category];
  const initialFrom = defaultFrom && getUnit(category, defaultFrom) ? defaultFrom : cat.defaultFrom;
  const initialTo = defaultTo && getUnit(category, defaultTo) ? defaultTo : cat.defaultTo;

  const [value, setValue] = useState("1");
  const [sel, setSel] = useState<Selection>({ category, from: initialFrom, to: initialTo });

  // If the category changed (unit converter), fall back to that category's defaults.
  const active: Selection =
    sel.category === category ? sel : { category, from: initialFrom, to: initialTo };
  const fromUnit = getUnit(category, active.from) ?? cat.units[0];
  const toUnit = getUnit(category, active.to) ?? cat.units[0];

  const options = cat.units.map((x) => ({ value: x.id, label: `${x.name} (${x.symbol})` }));

  const parsed = parseNumber(value, { label: "Value" });
  const empty = value.trim() === "";
  const rangeError = parsed.ok ? validateValue(parsed.value, category, fromUnit.id) : null;

  function reset() {
    setValue("1");
    setSel({ category, from: initialFrom, to: initialTo });
    onResetExtra?.();
  }

  function swap() {
    setSel({ category, from: toUnit.id, to: fromUnit.id });
  }

  let result: ReactNode;
  if (empty) {
    result = <ResultEmpty>Enter a value to convert it.</ResultEmpty>;
  } else if (!parsed.ok) {
    result = <ResultError>{parsed.error}</ResultError>;
  } else if (rangeError) {
    result = <ResultError>{rangeError}</ResultError>;
  } else {
    const r = convert(parsed.value, category, fromUnit.id, toUnit.id);
    const all = convertAll(parsed.value, category, fromUnit.id);
    if (!r.ok || !all) {
      result = <ResultError>{!r.ok ? r.error : "That value cannot be converted."}</ResultError>;
    } else {
      const input = `${formatSig(parsed.value)} ${fromUnit.symbol}`;
      const output = `${formatSig(r.value)} ${toUnit.symbol}`;
      const summary = `${input} = ${output}`;
      let stonesNote: string | null = null;
      if (category === "weight" && (toUnit.id === "lb" || toUnit.id === "st")) {
        const lb = convert(parsed.value, category, fromUnit.id, "lb");
        if (lb.ok && lb.value >= 14) {
          const sp = toStonesAndPounds(lb.value);
          stonesNote = `That is ${sp.stones} st ${formatSig(sp.pounds, 4)} lb.`;
        }
      }
      result = (
        <>
          <ResultHighlight
            label={`${input} in ${toUnit.name}`}
            value={output}
            sub={
              <>
                {describeFactor(category, fromUnit.id, toUnit.id)}
                {stonesNote ? (
                  <>
                    <br />
                    {stonesNote}
                  </>
                ) : null}
              </>
            }
          />
          <ResultActions>
            <CopyButton text={plainSig(r.value)} label="Copy value" />
            <CopyButton text={summary} label="Copy result" />
            <ShareButton title={shareTitle} text={summary} />
          </ResultActions>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">{input} in every unit</p>
            <DataTable
              caption={`${input} converted to every ${cat.label.toLowerCase()} unit`}
              columns={[
                { key: "unit", label: "Unit" },
                { key: "value", label: "Value", align: "right" },
              ]}
              rows={all.map((row) => ({
                unit: `${row.unit.name} (${row.unit.symbol})`,
                value: (
                  <span className={row.unit.id === toUnit.id ? "font-semibold text-foreground" : undefined}>
                    {formatSig(row.value)}
                  </span>
                ),
              }))}
            />
          </div>
        </>
      );
    }
  }

  return (
    <CalculatorShell title={title} onReset={reset} toolbar={toolbar} result={result}>
      <NumberField
        label="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="1"
        suffix={fromUnit.symbol.length <= 6 ? fromUnit.symbol : undefined}
        error={!empty && !parsed.ok ? parsed.error : undefined}
        hint={category === "temperature" ? "Negative values are allowed down to absolute zero." : undefined}
      />
      <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <SelectField
          label="From"
          options={options}
          value={fromUnit.id}
          onChange={(e) => setSel({ category, from: e.target.value, to: toUnit.id })}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={swap}
          aria-label="Swap from and to units"
          title="Swap units"
          className="mx-auto mb-0.5 sm:mx-0"
        >
          <ArrowLeftRight />
        </Button>
        <SelectField
          label="To"
          options={options}
          value={toUnit.id}
          onChange={(e) => setSel({ category, from: fromUnit.id, to: e.target.value })}
        />
      </div>
    </CalculatorShell>
  );
}
