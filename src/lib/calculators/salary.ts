import type { CalcResult } from "@/lib/calculators/percentage";

export type PayPeriod =
  | "hourly"
  | "daily"
  | "weekly"
  | "biweekly"
  | "semimonthly"
  | "monthly"
  | "quarterly"
  | "annual";

export const PAY_PERIODS: readonly { value: PayPeriod; label: string }[] = [
  { value: "hourly", label: "Hourly" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly (every 2 weeks)" },
  { value: "semimonthly", label: "Semi-monthly (twice a month)" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annual", label: "Annual" },
];

export interface WorkAssumptions {
  hoursPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
}

/** How many of each pay period fall in a working year under the assumptions. */
export function periodsPerYear(period: PayPeriod, a: WorkAssumptions): number {
  switch (period) {
    case "hourly":
      return a.hoursPerDay * a.daysPerWeek * a.weeksPerYear;
    case "daily":
      return a.daysPerWeek * a.weeksPerYear;
    case "weekly":
      return a.weeksPerYear;
    case "biweekly":
      return a.weeksPerYear / 2;
    case "semimonthly":
      return 24;
    case "monthly":
      return 12;
    case "quarterly":
      return 4;
    case "annual":
      return 1;
  }
}

export interface SalaryResult {
  annual: number;
  amounts: Record<PayPeriod, number>;
}

export function convertSalary(amount: number, period: PayPeriod, a: WorkAssumptions): CalcResult<SalaryResult> {
  if (amount < 0) return { ok: false, error: "Pay amount cannot be negative." };
  if (!(a.hoursPerDay > 0 && a.daysPerWeek > 0 && a.weeksPerYear > 0)) {
    return { ok: false, error: "Hours per day, days per week and weeks per year must all be greater than zero." };
  }
  const annual = amount * periodsPerYear(period, a);
  const amounts = {} as Record<PayPeriod, number>;
  for (const p of PAY_PERIODS) amounts[p.value] = annual / periodsPerYear(p.value, a);
  amounts[period] = amount;
  return { ok: true, value: { annual, amounts } };
}
