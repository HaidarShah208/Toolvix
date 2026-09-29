"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import {
  Badge,
  DataTable,
  ResultActions,
  ResultEmpty,
  ResultError,
  ResultHighlight,
  ResultSteps,
} from "@/components/tools/result";
import { InputField, NumberField, SelectField } from "@/components/ui/field";
import { convertSalary, PAY_PERIODS, periodsPerYear, type PayPeriod } from "@/lib/calculators/salary";
import { formatMoney, formatNumber, parseNumber } from "@/lib/utils/number";

const DEFAULTS = { hours: "8", days: "5", weeks: "52" };

export default function SalaryCalculator() {
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<PayPeriod>("annual");
  const [hours, setHours] = useState(DEFAULTS.hours);
  const [days, setDays] = useState(DEFAULTS.days);
  const [weeks, setWeeks] = useState(DEFAULTS.weeks);
  const [symbol, setSymbol] = useState("");

  function reset() {
    setAmount("");
    setPeriod("annual");
    setHours(DEFAULTS.hours);
    setDays(DEFAULTS.days);
    setWeeks(DEFAULTS.weeks);
    setSymbol("");
  }

  const pAmount = parseNumber(amount, { label: "Pay amount", allowNegative: false });
  const pHours = parseNumber(hours, { label: "Hours per day", allowNegative: false, nonZero: true, max: 24 });
  const pDays = parseNumber(days, { label: "Days per week", allowNegative: false, nonZero: true, max: 7 });
  const pWeeks = parseNumber(weeks, { label: "Weeks per year", allowNegative: false, nonZero: true, max: 53 });

  const err = (raw: string, p: ReturnType<typeof parseNumber>) => (raw.trim() !== "" && !p.ok ? p.error : undefined);
  const amountError = err(amount, pAmount);
  const hoursError = err(hours, pHours);
  const daysError = err(days, pDays);
  const weeksError = err(weeks, pWeeks);
  const sym = symbol.trim();
  const money = (v: number) => formatMoney(v, /[A-Za-z]$/.test(sym) ? `${sym} ` : sym);

  let result: React.ReactNode;
  if (amount.trim() === "") {
    result = <ResultEmpty>Enter a pay amount to convert it to every pay period.</ResultEmpty>;
  } else if (!pAmount.ok || !pHours.ok || !pDays.ok || !pWeeks.ok) {
    const first = [pAmount, pHours, pDays, pWeeks].find((p) => !p.ok);
    result = <ResultError>{first && !first.ok ? first.error : "Check your inputs."}</ResultError>;
  } else {
    const a = { hoursPerDay: pHours.value, daysPerWeek: pDays.value, weeksPerYear: pWeeks.value };
    const r = convertSalary(pAmount.value, period, a);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const inputLabel = PAY_PERIODS.find((p) => p.value === period)?.label ?? "";
      const hoursPerYear = periodsPerYear("hourly", a);
      const summary = [
        `${money(pAmount.value)} ${inputLabel.toLowerCase()} gross pay equals:`,
        ...PAY_PERIODS.map((p) => `${p.label}: ${money(v.amounts[p.value])}`),
        `Assumes ${formatNumber(a.hoursPerDay)} hours/day, ${formatNumber(a.daysPerWeek)} days/week, ${formatNumber(a.weeksPerYear)} weeks/year. Gross pay before tax and deductions.`,
      ].join("\n");

      result = (
        <>
          <ResultHighlight
            label="Annual gross pay"
            value={money(v.annual)}
            sub={`Based on ${money(pAmount.value)} ${inputLabel.toLowerCase()}.`}
          />
          <DataTable
            caption="Gross pay for every pay period"
            columns={[
              { key: "period", label: "Pay period" },
              { key: "amount", label: "Gross pay", align: "right" },
            ]}
            rows={PAY_PERIODS.map((p) => ({
              period:
                p.value === period ? (
                  <span className="inline-flex items-center gap-2 font-medium text-foreground">
                    {p.label} <Badge tone="primary">Your input</Badge>
                  </span>
                ) : (
                  p.label
                ),
              amount: <span className={p.value === period ? "font-semibold text-foreground" : undefined}>{money(v.amounts[p.value])}</span>,
            }))}
          />
          <ResultSteps
            steps={[
              `Convert to annual: ${money(pAmount.value)} × ${formatNumber(periodsPerYear(period, a), 4)} (${inputLabel.toLowerCase()} periods in a year) = ${money(v.annual)}`,
              `Hourly = annual ÷ (${formatNumber(a.hoursPerDay)} × ${formatNumber(a.daysPerWeek)} × ${formatNumber(a.weeksPerYear)} = ${formatNumber(hoursPerYear)} hours) = ${money(v.amounts.hourly)}`,
              `Monthly = annual ÷ 12 = ${money(v.amounts.monthly)}; semi-monthly = annual ÷ 24; bi-weekly = annual ÷ (${formatNumber(a.weeksPerYear)} ÷ 2).`,
            ]}
          />
          <Alert>
            All figures are gross pay before income tax, social contributions and other deductions. No country-specific
            tax is applied.
          </Alert>
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell title="Salary calculator" onReset={reset} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Pay amount"
          placeholder="55,000"
          prefix={sym && sym.length <= 2 ? sym : undefined}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={amountError}
        />
        <SelectField
          label="Pay period"
          options={PAY_PERIODS}
          value={period}
          onChange={(e) => setPeriod(e.target.value as PayPeriod)}
        />
      </div>
      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mb-2 text-sm font-semibold text-foreground">Working time assumptions</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <NumberField
            label="Hours per day"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            error={hoursError}
          />
          <NumberField
            label="Days per week"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            error={daysError}
          />
          <NumberField
            label="Weeks per year"
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
            error={weeksError}
            hint="Use e.g. 50 for unpaid leave."
          />
        </div>
      </fieldset>
      <InputField
        label="Currency symbol (optional)"
        placeholder="$, €, £…"
        maxLength={4}
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        containerClassName="sm:max-w-60"
        autoComplete="off"
      />
    </CalculatorShell>
  );
}
