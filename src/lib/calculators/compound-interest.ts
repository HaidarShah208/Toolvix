import type { CalcResult } from "@/lib/calculators/percentage";

export type Compounding = "annually" | "semiannually" | "quarterly" | "monthly" | "daily" | "continuous";

export const COMPOUNDING_OPTIONS: readonly { value: Compounding; label: string }[] = [
  { value: "annually", label: "Annually (1× per year)" },
  { value: "semiannually", label: "Semi-annually (2× per year)" },
  { value: "quarterly", label: "Quarterly (4× per year)" },
  { value: "monthly", label: "Monthly (12× per year)" },
  { value: "daily", label: "Daily (365× per year)" },
  { value: "continuous", label: "Continuously" },
];

/** Compounding periods per year; `null` means continuous. */
export function periodsPerYear(c: Compounding): number | null {
  switch (c) {
    case "annually":
      return 1;
    case "semiannually":
      return 2;
    case "quarterly":
      return 4;
    case "monthly":
      return 12;
    case "daily":
      return 365;
    default:
      return null;
  }
}

export interface CompoundInput {
  principal: number;
  /** Nominal annual rate in percent, e.g. 5 for 5%. */
  ratePercent: number;
  years: number;
  compounding: Compounding;
  /** Deposited at the end of every month. */
  monthlyContribution: number;
}

export interface CompoundYearRow {
  /** 1-based year index. */
  year: number;
  /** Months elapsed at the end of this row (the last row may be a partial year). */
  monthsElapsed: number;
  contributions: number;
  interest: number;
  balance: number;
}

export interface CompoundOutput {
  months: number;
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  /** Effective annual rate (APY) in percent. */
  apyPercent: number;
  /** Effective monthly rate as a fraction (0.004 = 0.4%). */
  monthlyRate: number;
  /** Growth of the initial deposit alone, from the closed-form formula. */
  principalOnlyBalance: number;
  /** Future value of the monthly contributions alone. */
  contributionsBalance: number;
  rows: CompoundYearRow[];
}

/** Values above this are refused so formatting never loses meaning. */
const MAX_RESULT = 1e15;

export function compoundInterest(input: CompoundInput): CalcResult<CompoundOutput> {
  const { principal, ratePercent, years, compounding, monthlyContribution } = input;
  if (principal < 0) return { ok: false, error: "The initial deposit cannot be negative." };
  if (monthlyContribution < 0) return { ok: false, error: "The monthly contribution cannot be negative." };
  if (!(ratePercent > -100) || ratePercent > 100) {
    return { ok: false, error: "The interest rate must be greater than −100% and no more than 100%." };
  }
  if (!(years > 0) || years > 100) return { ok: false, error: "The number of years must be more than 0 and no more than 100." };

  const months = Math.round(years * 12);
  if (months < 1) return { ok: false, error: "The term must be at least one month (0.08 years)." };
  if (principal === 0 && monthlyContribution === 0) {
    return { ok: false, error: "Enter an initial deposit or a monthly contribution greater than zero." };
  }

  const r = ratePercent / 100;
  const n = periodsPerYear(compounding);
  const monthlyRate = n === null ? Math.expm1(r / 12) : Math.pow(1 + r / n, n / 12) - 1;
  const apy = n === null ? Math.expm1(r) : Math.pow(1 + r / n, n) - 1;

  // Closed form for the initial deposit: P(1 + r/n)^(n·t) or P·e^(r·t).
  const t = months / 12;
  const principalOnlyBalance = n === null ? principal * Math.exp(r * t) : principal * Math.pow(1 + r / n, n * t);

  const rows: CompoundYearRow[] = [];
  let contribBalance = 0;
  for (let m = 1; m <= months; m++) {
    contribBalance = contribBalance * (1 + monthlyRate) + monthlyContribution;
    if (m % 12 === 0 || m === months) {
      const principalPart =
        n === null ? principal * Math.exp((r * m) / 12) : principal * Math.pow(1 + r / n, (n * m) / 12);
      const balance = principalPart + contribBalance;
      const contributions = principal + monthlyContribution * m;
      rows.push({
        year: Math.ceil(m / 12),
        monthsElapsed: m,
        contributions,
        interest: balance - contributions,
        balance,
      });
    }
  }

  const finalBalance = principalOnlyBalance + contribBalance;
  if (!Number.isFinite(finalBalance) || finalBalance > MAX_RESULT) {
    return {
      ok: false,
      error: "The final balance would exceed 1 quadrillion, which is too large to show reliably. Try a lower rate or shorter term.",
    };
  }
  const totalContributions = principal + monthlyContribution * months;

  return {
    ok: true,
    value: {
      months,
      finalBalance,
      totalContributions,
      totalInterest: finalBalance - totalContributions,
      apyPercent: apy * 100,
      monthlyRate,
      principalOnlyBalance,
      contributionsBalance: contribBalance,
      rows,
    },
  };
}
