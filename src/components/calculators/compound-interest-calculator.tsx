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
import { ShareButton } from "@/components/tools/share-button";
import { NumberField, SelectField } from "@/components/ui/field";
import {
  COMPOUNDING_OPTIONS,
  compoundInterest,
  periodsPerYear,
  type Compounding,
} from "@/lib/calculators/compound-interest";
import { formatMoney, formatNumber, parseNumber } from "@/lib/utils/number";

function yearLabel(year: number, monthsElapsed: number): string {
  const rem = monthsElapsed % 12;
  return rem === 0 ? String(year) : `${year} (${rem} mo)`;
}

function termText(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? "year" : "years"}`);
  if (m) parts.push(`${m} ${m === 1 ? "month" : "months"}`);
  return parts.join(" ");
}

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [compounding, setCompounding] = useState<Compounding>("monthly");
  const [monthly, setMonthly] = useState("");

  const pPrincipal = parseNumber(principal, { label: "Initial deposit", allowNegative: false });
  const pRate = parseNumber(rate, { label: "Interest rate", max: 100 });
  const rateRangeError = pRate.ok && pRate.value <= -100 ? "Interest rate must be greater than −100%." : undefined;
  const pYears = parseNumber(years, { label: "Years", min: 0, max: 100 });
  const yearsError = pYears.ok && Math.round(pYears.value * 12) < 1 ? "Enter at least one month (about 0.08 years)." : undefined;
  const pMonthly = monthly.trim() === "" ? ({ ok: true, value: 0 } as const) : parseNumber(monthly, { label: "Monthly contribution", allowNegative: false });

  const empty = principal.trim() === "" || rate.trim() === "" || years.trim() === "";

  function reset() {
    setPrincipal("");
    setRate("");
    setYears("");
    setCompounding("monthly");
    setMonthly("");
  }

  let result: ReactNode;
  if (empty) {
    result = <ResultEmpty>Enter a deposit, interest rate and number of years to see how the balance grows.</ResultEmpty>;
  } else if (!pPrincipal.ok || !pRate.ok || !pYears.ok || !pMonthly.ok || rateRangeError || yearsError) {
    const msg = !pPrincipal.ok
      ? pPrincipal.error
      : !pRate.ok
        ? pRate.error
        : rateRangeError
          ? rateRangeError
          : !pYears.ok
            ? pYears.error
            : yearsError
              ? yearsError
              : !pMonthly.ok
                ? pMonthly.error
                : "";
    result = <ResultError>{msg}</ResultError>;
  } else {
    const r = compoundInterest({
      principal: pPrincipal.value,
      ratePercent: pRate.value,
      years: pYears.value,
      compounding,
      monthlyContribution: pMonthly.value,
    });
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const n = periodsPerYear(compounding);
      const freqLabel = COMPOUNDING_OPTIONS.find((o) => o.value === compounding)?.label ?? "";
      const term = termText(v.months);
      const roundedYears = v.months / 12;
      const interestPct = v.finalBalance > 0 ? (v.totalInterest / v.finalBalance) * 100 : 0;
      const contribPct = 100 - interestPct;
      const summary = [
        `Compound interest: ${formatMoney(pPrincipal.value)} at ${formatNumber(pRate.value, 4)}% compounded ${freqLabel.split(" (")[0].toLowerCase()} for ${term}` +
          (pMonthly.value > 0 ? ` with ${formatMoney(pMonthly.value)} added monthly` : ""),
        `Final balance: ${formatMoney(v.finalBalance)}`,
        `Total contributions: ${formatMoney(v.totalContributions)}`,
        `Total interest: ${formatMoney(v.totalInterest)}`,
        `Effective annual rate (APY): ${formatNumber(v.apyPercent, 4)}%`,
      ].join("\n");

      const rateDec = formatNumber(pRate.value / 100, 6);
      const steps: ReactNode[] = [
        n === null
          ? `Continuous compounding: effective monthly rate = e^(${rateDec} ÷ 12) − 1 = ${formatNumber(v.monthlyRate * 100, 6)}%.`
          : `Effective monthly rate = (1 + ${rateDec} ÷ ${n})^(${n} ÷ 12) − 1 = ${formatNumber(v.monthlyRate * 100, 6)}%.`,
        n === null
          ? `Initial deposit grows to ${formatMoney(pPrincipal.value)} × e^(${rateDec} × ${formatNumber(roundedYears, 4)}) = ${formatMoney(v.principalOnlyBalance)}.`
          : `Initial deposit grows to ${formatMoney(pPrincipal.value)} × (1 + ${rateDec} ÷ ${n})^(${n} × ${formatNumber(roundedYears, 4)}) = ${formatMoney(v.principalOnlyBalance)}.`,
      ];
      if (pMonthly.value > 0) {
        steps.push(
          `${v.months} monthly deposits of ${formatMoney(pMonthly.value)}, each made at the end of the month and earning the monthly rate afterwards, grow to ${formatMoney(v.contributionsBalance)}.`,
        );
      }
      steps.push(
        `Final balance = ${formatMoney(v.principalOnlyBalance)}${pMonthly.value > 0 ? ` + ${formatMoney(v.contributionsBalance)}` : ""} = ${formatMoney(v.finalBalance)}; interest = balance − contributions = ${formatMoney(v.totalInterest)}.`,
      );
      if (Math.abs(roundedYears - pYears.value) > 1e-9) {
        steps.push(`${formatNumber(pYears.value, 4)} years was rounded to ${v.months} whole months (${term}).`);
      }

      result = (
        <>
          <ResultHighlight
            label={`Balance after ${term}`}
            value={formatMoney(v.finalBalance)}
            sub={`${formatMoney(v.totalContributions)} paid in + ${formatMoney(v.totalInterest)} interest`}
          />
          <StatGrid
            items={[
              { label: "Total contributions", value: formatMoney(v.totalContributions), hint: "Initial deposit + monthly deposits" },
              { label: "Total interest earned", value: formatMoney(v.totalInterest) },
              { label: "Effective annual rate (APY)", value: `${formatNumber(v.apyPercent, 4)}%`, hint: `Nominal rate ${formatNumber(pRate.value, 4)}%` },
              { label: "Months simulated", value: formatNumber(v.months) },
            ]}
          />
          {v.totalInterest >= 0 && v.finalBalance > 0 ? (
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="text-sm font-semibold text-foreground">What makes up the final balance</p>
              <div
                className="mt-3 flex h-4 w-full overflow-hidden rounded-full bg-surface-muted"
                role="img"
                aria-label={`Contributions ${formatNumber(contribPct, 1)}%, interest ${formatNumber(interestPct, 1)}%`}
              >
                <div className="h-full bg-primary" style={{ width: `${contribPct}%` }} />
                <div className="h-full bg-success" style={{ width: `${interestPct}%` }} />
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-primary" aria-hidden="true" />
                  Contributions: {formatNumber(contribPct, 1)}%
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-3 rounded-sm bg-success" aria-hidden="true" />
                  Interest: {formatNumber(interestPct, 1)}%
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted">
              With a negative rate the balance ends below what you paid in, so the interest figure is a loss.
            </p>
          )}
          <ResultSteps steps={steps} />
          <DataTable
            caption="Year-by-year growth"
            columns={[
              { key: "year", label: "Year" },
              { key: "contributions", label: "Contributions to date", align: "right" },
              { key: "interest", label: "Interest to date", align: "right" },
              { key: "balance", label: "Balance", align: "right" },
            ]}
            rows={v.rows.map((row) => ({
              year: yearLabel(row.year, row.monthsElapsed),
              contributions: formatMoney(row.contributions),
              interest: formatMoney(row.interest),
              balance: formatMoney(row.balance),
            }))}
          />
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
            <ShareButton title="Compound Interest Calculator" text={summary} />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell title="Compound interest calculator" onReset={reset} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Initial deposit"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="10,000"
          error={principal.trim() !== "" && !pPrincipal.ok ? pPrincipal.error : undefined}
        />
        <NumberField
          label="Annual interest rate"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          suffix="%"
          placeholder="5"
          error={rate.trim() !== "" ? (!pRate.ok ? pRate.error : rateRangeError) : undefined}
        />
        <NumberField
          label="Years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="10"
          hint="Up to 100. Decimals are rounded to whole months."
          error={years.trim() !== "" ? (!pYears.ok ? pYears.error : yearsError) : undefined}
        />
        <SelectField
          label="Compounding frequency"
          value={compounding}
          onChange={(e) => setCompounding(e.target.value as Compounding)}
          options={COMPOUNDING_OPTIONS}
        />
        <NumberField
          label="Monthly contribution (optional)"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          placeholder="0"
          hint="Added at the end of each month."
          containerClassName="sm:col-span-2"
          error={monthly.trim() !== "" && !pMonthly.ok ? pMonthly.error : undefined}
        />
      </div>
    </CalculatorShell>
  );
}
