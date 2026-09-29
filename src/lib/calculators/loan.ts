import type { CalcResult } from "@/lib/calculators/percentage";
import { roundTo } from "@/lib/utils/number";

export type PaymentFrequency = "monthly" | "biweekly" | "weekly";

export const PERIODS_PER_YEAR: Record<PaymentFrequency, number> = {
  monthly: 12,
  biweekly: 26,
  weekly: 52,
};

export const MAX_LOAN_AMOUNT = 1e12;
export const MAX_TERM_YEARS = 50;

export interface LoanInput {
  principal: number;
  /** Annual rate in percent, e.g. 6 for 6%. */
  annualRate: number;
  years: number;
  months: number;
  frequency: PaymentFrequency;
}

export interface LoanYearRow {
  year: number;
  payments: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanResult {
  /** Regular payment, rounded to cents. */
  payment: number;
  /** Final payment after rounding adjustments (clears the balance exactly). */
  finalPayment: number;
  numberOfPayments: number;
  periodicRate: number;
  periodsPerYear: number;
  totalInterest: number;
  totalRepayment: number;
  schedule: LoanYearRow[];
}

const cents = (v: number) => Math.round(v * 100) / 100;

/** Number of payments for a term, e.g. 30 years monthly = 360, 2 years bi-weekly = 52. */
export function paymentCount(years: number, months: number, frequency: PaymentFrequency): number {
  if (frequency === "monthly") return Math.round(years * 12 + months);
  return Math.round((years + months / 12) * PERIODS_PER_YEAR[frequency]);
}

/** Exact (unrounded) level payment: P·r / (1 − (1 + r)^−n), or P / n at 0%. */
export function levelPayment(principal: number, r: number, n: number): number {
  if (r === 0) return principal / n;
  return (principal * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Standard fixed-rate amortization. Each payment is rounded to the cent; the
 * last payment is adjusted so the remaining balance ends at exactly zero.
 */
export function calculateLoan(input: LoanInput): CalcResult<LoanResult> {
  const { principal, annualRate, years, months, frequency } = input;
  if (!(principal > 0)) return { ok: false, error: "Loan amount must be greater than zero." };
  if (principal > MAX_LOAN_AMOUNT) return { ok: false, error: "Loan amount is too large to calculate reliably." };
  if (annualRate < 0 || annualRate > 100) return { ok: false, error: "Interest rate must be between 0% and 100%." };
  if (years + months / 12 > MAX_TERM_YEARS) {
    return { ok: false, error: `The loan term can be at most ${MAX_TERM_YEARS} years.` };
  }
  const ppy = PERIODS_PER_YEAR[frequency];
  const n = paymentCount(years, months, frequency);
  if (n < 1) return { ok: false, error: "The loan term is too short for a single payment. Increase the term." };

  const r = annualRate / 100 / ppy;
  const payment = cents(levelPayment(principal, r, n));
  if (payment <= 0 || (r > 0 && payment <= principal * r && n > 1)) {
    return { ok: false, error: "The loan amount is too small for this rate and term to produce a payment." };
  }

  let balance = principal;
  let finalPayment = payment;
  let made = 0;
  const schedule: LoanYearRow[] = [];

  for (let k = 1; k <= n && balance > 0; k++) {
    const interest = balance * r;
    let principalPart = payment - interest;
    let thisPayment = payment;
    // Finish on the last period, or early if this payment leaves less than half a cent.
    if (k === n || principalPart >= balance - 0.005) {
      principalPart = balance;
      thisPayment = cents(balance + interest);
    }
    balance = k === n || principalPart === balance ? 0 : balance - principalPart;
    finalPayment = thisPayment;
    made = k;

    const year = Math.ceil(k / ppy);
    let row = schedule[schedule.length - 1];
    if (!row || row.year !== year) {
      row = { year, payments: 0, principal: 0, interest: 0, balance: 0 };
      schedule.push(row);
    }
    row.payments += 1;
    row.principal += principalPart;
    row.interest += interest;
    row.balance = balance;
  }

  // Total repaid is the sum of the actual (cent-rounded) payments.
  const totalRepayment = cents(payment * (made - 1) + finalPayment);
  const interestTotal = cents(totalRepayment - principal);

  return {
    ok: true,
    value: {
      payment,
      finalPayment,
      numberOfPayments: made,
      periodicRate: r,
      periodsPerYear: ppy,
      totalInterest: Math.max(0, interestTotal),
      totalRepayment,
      schedule: schedule.map((row) => ({
        ...row,
        principal: cents(row.principal),
        interest: cents(row.interest),
        balance: cents(roundTo(row.balance, 6)),
      })),
    },
  };
}
