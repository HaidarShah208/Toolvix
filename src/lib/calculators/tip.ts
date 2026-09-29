import type { CalcResult } from "@/lib/calculators/percentage";
import { roundTo } from "@/lib/utils/number";

export const MAX_PEOPLE = 100;

export interface TipInput {
  bill: number;
  tipPercent: number;
  people: number;
  /** Round each person's share up to a whole number. */
  roundUp: boolean;
}

export interface TipResult {
  tip: number;
  total: number;
  tipPerPerson: number;
  totalPerPerson: number;
  /** Tip as a percentage of the bill after any rounding. */
  effectivePercent: number;
  rounded: boolean;
}

export function calculateTip({ bill, tipPercent, people, roundUp }: TipInput): CalcResult<TipResult> {
  if (bill <= 0) return { ok: false, error: "Bill amount must be greater than zero." };
  if (tipPercent < 0 || tipPercent > 100) return { ok: false, error: "Tip must be between 0% and 100%." };
  if (!Number.isInteger(people) || people < 1 || people > MAX_PEOPLE) {
    return { ok: false, error: `Number of people must be a whole number from 1 to ${MAX_PEOPLE}.` };
  }

  let tip = (bill * tipPercent) / 100;
  let total = bill + tip;
  let totalPerPerson = total / people;

  if (roundUp) {
    // Trim float noise first so 20.000000001 does not round up to 21.
    totalPerPerson = Math.ceil(roundTo(totalPerPerson, 6));
    total = totalPerPerson * people;
    tip = total - bill;
  }

  return {
    ok: true,
    value: {
      tip: roundTo(tip),
      total: roundTo(total),
      tipPerPerson: roundTo(tip / people),
      totalPerPerson: roundTo(totalPerPerson),
      effectivePercent: roundTo((tip / bill) * 100),
      rounded: roundUp,
    },
  };
}
