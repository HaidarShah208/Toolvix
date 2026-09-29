"use client";

import { useState } from "react";
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
import { CheckboxField, NumberField } from "@/components/ui/field";
import { calculateTip, MAX_PEOPLE } from "@/lib/calculators/tip";
import { cn } from "@/lib/utils/cn";
import { formatMoney, formatNumber, parseNumber } from "@/lib/utils/number";

const PRESETS = ["10", "15", "18", "20", "25"];

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tip, setTip] = useState("15");
  const [people, setPeople] = useState("1");
  const [roundUp, setRoundUp] = useState(false);

  function reset() {
    setBill("");
    setTip("15");
    setPeople("1");
    setRoundUp(false);
  }

  const pBill = parseNumber(bill, { label: "Bill amount", allowNegative: false, nonZero: true });
  const pTip = parseNumber(tip, { label: "Tip", allowNegative: false, max: 100 });
  const pPeople = parseNumber(people, { label: "Number of people", integer: true, min: 1, max: MAX_PEOPLE });

  const billError = bill.trim() !== "" && !pBill.ok ? pBill.error : undefined;
  const tipError = tip.trim() !== "" && !pTip.ok ? pTip.error : undefined;
  const peopleError = people.trim() !== "" && !pPeople.ok ? pPeople.error : undefined;

  let result: React.ReactNode;
  if (bill.trim() === "" || tip.trim() === "" || people.trim() === "") {
    result = <ResultEmpty>Enter the bill, tip percentage and number of people.</ResultEmpty>;
  } else if (!pBill.ok || !pTip.ok || !pPeople.ok) {
    result = <ResultError>{billError ?? tipError ?? peopleError}</ResultError>;
  } else {
    const r = calculateTip({ bill: pBill.value, tipPercent: pTip.value, people: pPeople.value, roundUp });
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const n = pPeople.value;
      const split = n > 1;
      const tipPct = formatNumber(pTip.value, 2);
      const effPct = formatNumber(v.effectivePercent, 2);
      const steps = [
        `Tip: ${formatMoney(pBill.value)} × ${tipPct}% = ${formatMoney((pBill.value * pTip.value) / 100)}`,
        `Total: ${formatMoney(pBill.value)} + tip = ${formatMoney(pBill.value + (pBill.value * pTip.value) / 100)}`,
      ];
      if (split) {
        steps.push(`Split ${n} ways: ${formatMoney(pBill.value + (pBill.value * pTip.value) / 100)} ÷ ${n} = ${formatMoney((pBill.value * (1 + pTip.value / 100)) / n)} each`);
      }
      if (roundUp) {
        steps.push(
          `Rounded up to ${formatMoney(v.totalPerPerson)} ${split ? "each" : ""}, so the total becomes ${formatMoney(v.total)} and the tip is ${formatMoney(v.tip)} (${effPct}% of the bill).`,
        );
      }
      const summary = [
        `Bill: ${formatMoney(pBill.value)}, tip ${tipPct}%${split ? `, split ${n} ways` : ""}`,
        `Tip: ${formatMoney(v.tip)}${roundUp ? ` (effective ${effPct}% after rounding)` : ""}`,
        `Total: ${formatMoney(v.total)}`,
        ...(split ? [`Each person pays: ${formatMoney(v.totalPerPerson)} (tip ${formatMoney(v.tipPerPerson)})`] : []),
      ].join("\n");

      result = (
        <>
          <ResultHighlight
            label={split ? "Total per person" : "Total to pay"}
            value={formatMoney(split ? v.totalPerPerson : v.total)}
            sub={roundUp ? `Rounded up; effective tip ${effPct}% instead of ${tipPct}%.` : undefined}
          />
          <StatGrid
            items={[
              { label: "Tip total", value: formatMoney(v.tip), hint: roundUp ? `${effPct}% effective` : `${tipPct}% of the bill` },
              { label: "Total bill", value: formatMoney(v.total) },
              { label: "Tip per person", value: formatMoney(v.tipPerPerson) },
              { label: "Total per person", value: formatMoney(v.totalPerPerson) },
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

  return (
    <CalculatorShell title="Tip calculator" onReset={reset} result={result}>
      <NumberField
        label="Bill amount"
        placeholder="64.50"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
        error={billError}
      />
      <div className="flex min-w-0 flex-col gap-2">
        <div role="group" aria-label="Tip presets" className="flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = tip.trim() === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                onClick={() => setTip(p)}
                className={cn(
                  "h-10 min-w-14 flex-1 rounded-xl border px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active
                    ? "border-primary bg-primary-soft text-primary-soft-foreground"
                    : "border-border-strong bg-surface text-foreground hover:bg-surface-muted",
                )}
              >
                {p}%
              </button>
            );
          })}
        </div>
        <NumberField
          label="Tip percentage"
          suffix="%"
          placeholder="15"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          error={tipError}
          hint="Pick a preset or type your own."
        />
      </div>
      <NumberField
        label="Number of people"
        inputMode="numeric"
        placeholder="1"
        value={people}
        onChange={(e) => setPeople(e.target.value)}
        error={peopleError}
      />
      <CheckboxField
        label="Round each share up to a whole number"
        description="Handy for paying in cash; the tip absorbs the difference."
        checked={roundUp}
        onChange={(e) => setRoundUp(e.target.checked)}
      />
    </CalculatorShell>
  );
}
