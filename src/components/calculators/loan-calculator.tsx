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
import { ShareButton } from "@/components/tools/share-button";
import { NumberField, SelectField } from "@/components/ui/field";
import {
  calculateLoan,
  MAX_LOAN_AMOUNT,
  MAX_TERM_YEARS,
  type PaymentFrequency,
} from "@/lib/calculators/loan";
import { formatMoney, formatNumber, parseNumber } from "@/lib/utils/number";

const FREQUENCIES = [
  { value: "monthly", label: "Monthly (12 per year)" },
  { value: "biweekly", label: "Bi-weekly (26 per year)" },
  { value: "weekly", label: "Weekly (52 per year)" },
] as const;

const PERIOD_WORD: Record<PaymentFrequency, string> = {
  monthly: "month",
  biweekly: "two weeks",
  weekly: "week",
};

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [months, setMonths] = useState("");
  const [frequency, setFrequency] = useState<PaymentFrequency>("monthly");

  function reset() {
    setAmount("");
    setRate("");
    setYears("");
    setMonths("");
    setFrequency("monthly");
  }

  const pAmount = parseNumber(amount, { label: "Loan amount", allowNegative: false, nonZero: true, max: MAX_LOAN_AMOUNT });
  const pRate = parseNumber(rate, { label: "Interest rate", min: 0, max: 100 });
  const pYears = years.trim() === "" ? null : parseNumber(years, { label: "Years", allowNegative: false, integer: true, max: MAX_TERM_YEARS });
  const pMonths = months.trim() === "" ? null : parseNumber(months, { label: "Months", allowNegative: false, integer: true, max: 11 });

  const amountError = amount.trim() !== "" && !pAmount.ok ? pAmount.error : undefined;
  const rateError = rate.trim() !== "" && !pRate.ok ? pRate.error : undefined;
  const yearsError = pYears && !pYears.ok ? pYears.error : undefined;
  const monthsError = pMonths && !pMonths.ok ? pMonths.error : undefined;
  const termEmpty = pYears === null && pMonths === null;

  let result: React.ReactNode;
  if (amount.trim() === "" || rate.trim() === "" || termEmpty) {
    result = <ResultEmpty>Enter the loan amount, interest rate and term to estimate your payments.</ResultEmpty>;
  } else if (!pAmount.ok || !pRate.ok || yearsError || monthsError) {
    result = <ResultError>{amountError ?? rateError ?? yearsError ?? monthsError}</ResultError>;
  } else {
    const y = pYears?.ok ? pYears.value : 0;
    const m = pMonths?.ok ? pMonths.value : 0;
    const r = calculateLoan({ principal: pAmount.value, annualRate: pRate.value, years: y, months: m, frequency });
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const P = pAmount.value;
      const payText = formatMoney(v.payment);
      const principalShare = v.totalRepayment > 0 ? (P / v.totalRepayment) * 100 : 100;
      const interestShare = 100 - principalShare;
      const termText = [y ? `${y} ${y === 1 ? "year" : "years"}` : "", m ? `${m} ${m === 1 ? "month" : "months"}` : ""]
        .filter(Boolean)
        .join(" ");
      const lastDiffers = Math.abs(v.finalPayment - v.payment) >= 0.005;
      const summary = [
        `Loan: ${formatMoney(P)} at ${formatNumber(pRate.value, 4)}% for ${termText}, paid ${frequency === "monthly" ? "monthly" : frequency === "biweekly" ? "bi-weekly" : "weekly"}`,
        `Estimated payment: ${payText} per ${PERIOD_WORD[frequency]}${lastDiffers ? ` (final payment ${formatMoney(v.finalPayment)})` : ""}`,
        `Number of payments: ${v.numberOfPayments.toLocaleString("en-US")}`,
        `Total interest: ${formatMoney(v.totalInterest)}`,
        `Total repayment: ${formatMoney(v.totalRepayment)}`,
        "Estimate for a fixed-rate loan; excludes fees, insurance and taxes.",
      ].join("\n");

      const rText = formatNumber(v.periodicRate, 8);
      const steps =
        v.periodicRate === 0
          ? [
              `With 0% interest, the payment is the amount divided by the number of payments.`,
              `n = ${v.numberOfPayments.toLocaleString("en-US")} payments`,
              `Payment = ${formatMoney(P)} ÷ ${v.numberOfPayments.toLocaleString("en-US")} = ${payText}`,
            ]
          : [
              `Periodic rate r = ${formatNumber(pRate.value, 4)}% ÷ ${v.periodsPerYear} = ${rText}`,
              `Number of payments n = ${v.numberOfPayments.toLocaleString("en-US")}`,
              `Payment = P × r ÷ (1 − (1 + r)^−n) = ${formatMoney(P)} × ${rText} ÷ (1 − ${formatNumber(1 + v.periodicRate, 8)}^−${v.numberOfPayments}) = ${payText}`,
              `Total interest = total repaid − amount borrowed = ${formatMoney(v.totalRepayment)} − ${formatMoney(P)} = ${formatMoney(v.totalInterest)}`,
            ];
      if (lastDiffers) {
        steps.push(`The final payment is ${formatMoney(v.finalPayment)} so that the balance ends at exactly 0 after rounding to cents.`);
      }

      result = (
        <>
          <ResultHighlight
            label={`Estimated payment per ${PERIOD_WORD[frequency]}`}
            value={payText}
            sub={`${v.numberOfPayments.toLocaleString("en-US")} payments${lastDiffers ? `; final payment ${formatMoney(v.finalPayment)}` : ""}.`}
          />
          <StatGrid
            items={[
              { label: "Number of payments", value: v.numberOfPayments.toLocaleString("en-US") },
              { label: "Total interest", value: formatMoney(v.totalInterest) },
              { label: "Total repayment", value: formatMoney(v.totalRepayment) },
              { label: "Amount borrowed", value: formatMoney(P) },
            ]}
          />
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Principal vs interest</p>
            <div aria-hidden="true" className="mt-2 flex h-3 overflow-hidden rounded-full bg-surface-muted">
              <div className="bg-primary" style={{ width: `${principalShare}%` }} />
              <div className="bg-warning/70" style={{ width: `${interestShare}%` }} />
            </div>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2.5 rounded-full bg-primary" />
                Principal {formatNumber(principalShare, 1)}%
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2.5 rounded-full bg-warning/70" />
                Interest {formatNumber(interestShare, 1)}%
              </span>
            </p>
          </div>
          <ResultSteps steps={steps} />
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">Amortization schedule by year</p>
            <DataTable
              caption="Amortization schedule grouped by year"
              columns={[
                { key: "year", label: "Year" },
                { key: "payments", label: "Payments", align: "right" },
                { key: "principal", label: "Principal paid", align: "right" },
                { key: "interest", label: "Interest paid", align: "right" },
                { key: "balance", label: "Remaining balance", align: "right" },
              ]}
              rows={v.schedule.map((row) => ({
                year: row.year,
                payments: row.payments,
                principal: formatMoney(row.principal),
                interest: formatMoney(row.interest),
                balance: formatMoney(row.balance),
              }))}
            />
          </div>
          <Alert>
            These are estimates for a fixed-rate loan with no fees, insurance or taxes. Your lender&apos;s figures may
            differ slightly because of rounding and day-count rules.
          </Alert>
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
            <ShareButton
              title="Loan Calculator"
              text={`Estimated payment: ${payText} per ${PERIOD_WORD[frequency]} on ${formatMoney(P)} at ${formatNumber(pRate.value, 4)}% for ${termText}.`}
            />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell title="Loan calculator" onReset={reset} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Loan amount"
          placeholder="200,000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={amountError}
        />
        <NumberField
          label="Annual interest rate"
          suffix="%"
          placeholder="6"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          error={rateError}
        />
        <NumberField
          label="Term (years)"
          suffix="years"
          placeholder="30"
          inputMode="numeric"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          error={yearsError}
        />
        <NumberField
          label="Term (extra months)"
          suffix="months"
          placeholder="0"
          inputMode="numeric"
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          error={monthsError}
          hint="Optional, 0–11."
        />
      </div>
      <SelectField
        label="Payment frequency"
        options={FREQUENCIES}
        value={frequency}
        onChange={(e) => setFrequency(e.target.value as PaymentFrequency)}
      />
    </CalculatorShell>
  );
}
