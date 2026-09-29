"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
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
import { NumberField, SelectField } from "@/components/ui/field";
import {
  calculateSimpleInterest,
  MAX_BREAKDOWN_ROWS,
  MAX_RATE,
  type TimeUnit,
} from "@/lib/calculators/simple-interest";
import { formatMoney, formatNumber, parseNumber } from "@/lib/utils/number";

const UNITS = [
  { value: "years", label: "Years" },
  { value: "months", label: "Months" },
  { value: "days", label: "Days" },
] as const;

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [unit, setUnit] = useState<TimeUnit>("years");

  function reset() {
    setPrincipal("");
    setRate("");
    setTime("");
    setUnit("years");
  }

  const pP = parseNumber(principal, { label: "Principal", allowNegative: false });
  const pR = parseNumber(rate, { label: "Interest rate", allowNegative: false, max: MAX_RATE });
  const pT = parseNumber(time, { label: "Time", allowNegative: false, nonZero: true });

  const pError = principal.trim() !== "" && !pP.ok ? pP.error : undefined;
  const rError = rate.trim() !== "" && !pR.ok ? pR.error : undefined;
  const tError = time.trim() !== "" && !pT.ok ? pT.error : undefined;

  let result: React.ReactNode;
  if (principal.trim() === "" || rate.trim() === "" || time.trim() === "") {
    result = <ResultEmpty>Enter the principal, rate and time to calculate simple interest.</ResultEmpty>;
  } else if (!pP.ok || !pR.ok || !pT.ok) {
    result = <ResultError>{pError ?? rError ?? tError}</ResultError>;
  } else {
    const r = calculateSimpleInterest(pP.value, pR.value, pT.value, unit);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const P = pP.value;
      const R = pR.value;
      const timeText = `${formatNumber(pT.value, 4)} ${pT.value === 1 ? unit.slice(0, -1) : unit}`;
      const tYears =
        unit === "years"
          ? formatNumber(pT.value, 6)
          : unit === "months"
            ? `${formatNumber(pT.value, 4)} ÷ 12 = ${formatNumber(v.years, 6)}`
            : `${formatNumber(pT.value, 4)} ÷ 365 = ${formatNumber(v.years, 6)}`;
      const summary = [
        `Simple interest on ${formatMoney(P)} at ${formatNumber(R, 4)}% a year for ${timeText}`,
        `Interest: ${formatMoney(v.interest)}`,
        `Total amount: ${formatMoney(v.total)}`,
      ].join("\n");

      result = (
        <>
          <ResultHighlight label="Simple interest" value={formatMoney(v.interest)} sub={`On ${formatMoney(P)} at ${formatNumber(R, 4)}% a year for ${timeText}.`} />
          <StatGrid
            items={[
              { label: "Total amount (principal + interest)", value: formatMoney(v.total) },
              { label: "Interest per year", value: formatMoney(v.yearlyInterest) },
            ]}
          />
          <ResultSteps
            steps={[
              `Time in years: T = ${tYears}${unit === "days" ? " (365-day year)" : ""}`,
              `I = P × R × T = ${formatMoney(P)} × ${formatNumber(R / 100, 8)} × ${formatNumber(v.years, 6)} = ${formatMoney(v.interest)}`,
              `Total = P + I = ${formatMoney(P)} + ${formatMoney(v.interest)} = ${formatMoney(v.total)}`,
            ]}
          />
          {v.breakdown.length > 0 ? (
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">Year-by-year breakdown</p>
              <DataTable
                caption="Simple interest year by year"
                columns={[
                  { key: "year", label: "Year" },
                  { key: "interest", label: "Interest", align: "right" },
                  { key: "cumulative", label: "Total interest", align: "right" },
                  { key: "balance", label: "Balance", align: "right" },
                ]}
                rows={v.breakdown.map((row) => ({
                  year: row.span < 1 ? `${formatNumber(row.year, 4)} (partial)` : formatNumber(row.year),
                  interest: formatMoney(row.interest),
                  cumulative: formatMoney(row.cumulativeInterest),
                  balance: formatMoney(row.balance),
                }))}
              />
              {v.truncated ? (
                <p className="text-xs text-subtle">
                  Showing the first {MAX_BREAKDOWN_ROWS} years. Interest grows by the same {formatMoney(v.yearlyInterest)} each
                  year after that.
                </p>
              ) : null}
            </div>
          ) : null}
          {unit === "days" ? <Alert>Days are converted to years using a 365-day year.</Alert> : null}
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell title="Simple interest calculator" onReset={reset} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Principal"
          placeholder="10,000"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          error={pError}
        />
        <NumberField
          label="Annual interest rate"
          suffix="%"
          placeholder="5"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          error={rError}
        />
        <NumberField
          label="Time"
          placeholder="3"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          error={tError}
        />
        <SelectField
          label="Time unit"
          options={UNITS}
          value={unit}
          onChange={(e) => setUnit(e.target.value as TimeUnit)}
          hint={unit === "days" ? "Uses a 365-day year." : undefined}
        />
      </div>
    </CalculatorShell>
  );
}
