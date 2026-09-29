import type { CalcResult } from "@/lib/calculators/percentage";
import { roundTo } from "@/lib/utils/number";

export type DiscountType = "percent" | "fixed";

export interface DiscountInput {
  price: number;
  type: DiscountType;
  /** Percent (0–100) or a fixed amount, depending on `type`. */
  value: number;
  /** Optional extra percentage applied after the first discount. */
  secondPercent: number;
  /** Optional sales tax percentage applied after all discounts. */
  taxPercent: number;
}

export interface DiscountResult {
  afterFirst: number;
  firstDiscount: number;
  secondDiscount: number;
  priceBeforeTax: number;
  tax: number;
  finalPrice: number;
  totalSavings: number;
  effectivePercent: number;
}

export function calculateDiscount(input: DiscountInput): CalcResult<DiscountResult> {
  const { price, type, value, secondPercent, taxPercent } = input;
  if (price < 0) return { ok: false, error: "Original price cannot be negative." };
  if (value < 0 || secondPercent < 0 || taxPercent < 0) {
    return { ok: false, error: "Discounts and tax cannot be negative." };
  }
  if (type === "percent" && value > 100) return { ok: false, error: "A percentage discount cannot be more than 100%." };
  if (secondPercent > 100) return { ok: false, error: "The second discount cannot be more than 100%." };
  if (type === "fixed" && value > price) {
    return { ok: false, error: "The discount amount is greater than the original price." };
  }

  const firstDiscount = type === "percent" ? (price * value) / 100 : value;
  const afterFirst = price - firstDiscount;
  const secondDiscount = (afterFirst * secondPercent) / 100;
  const priceBeforeTax = afterFirst - secondDiscount;
  const tax = (priceBeforeTax * taxPercent) / 100;
  const totalSavings = price - priceBeforeTax;
  return {
    ok: true,
    value: {
      afterFirst: roundTo(afterFirst),
      firstDiscount: roundTo(firstDiscount),
      secondDiscount: roundTo(secondDiscount),
      priceBeforeTax: roundTo(priceBeforeTax),
      tax: roundTo(tax),
      finalPrice: roundTo(priceBeforeTax + tax),
      totalSavings: roundTo(totalSavings),
      effectivePercent: price > 0 ? roundTo((totalSavings / price) * 100) : 0,
    },
  };
}
