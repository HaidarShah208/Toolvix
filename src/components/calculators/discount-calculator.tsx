"use client";

import { useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import {
  Badge,
  ResultActions,
  ResultEmpty,
  ResultError,
  ResultHighlight,
  ResultSteps,
  StatGrid,
} from "@/components/tools/result";
import { NumberField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { calculateDiscount, type DiscountType } from "@/lib/calculators/discount";
import { formatMoney, formatNumber, parseNumber, type ParseResult } from "@/lib/utils/number";

const TYPES = [
  { value: "percent", label: "Percent off" },
  { value: "fixed", label: "Amount off" },
] as const;

const ZERO: ParseResult = { ok: true, value: 0 };

export default function DiscountCalculator() {
  const [type, setType] = useState<DiscountType>("percent");
  const [price, setPrice] = useState("");
  const [value, setValue] = useState("");
  const [second, setSecond] = useState("");
  const [tax, setTax] = useState("");

  function reset() {
    setType("percent");
    setPrice("");
    setValue("");
    setSecond("");
    setTax("");
  }

  const pPrice = parseNumber(price, { label: "Original price", allowNegative: false });
  const pValue =
    type === "percent"
      ? parseNumber(value, { label: "Discount", allowNegative: false, max: 100 })
      : parseNumber(value, { label: "Discount amount", allowNegative: false });
  const pSecond = second.trim() === "" ? ZERO : parseNumber(second, { label: "Second discount", allowNegative: false, max: 100 });
  const pTax = tax.trim() === "" ? ZERO : parseNumber(tax, { label: "Sales tax", allowNegative: false, max: 100 });

  const priceError = price.trim() !== "" && !pPrice.ok ? pPrice.error : undefined;
  let valueError = value.trim() !== "" && !pValue.ok ? pValue.error : undefined;
  if (!valueError && type === "fixed" && pValue.ok && pPrice.ok && pValue.value > pPrice.value) {
    valueError = "The discount cannot be more than the original price.";
  }
  const secondError = !pSecond.ok ? pSecond.error : undefined;
  const taxError = !pTax.ok ? pTax.error : undefined;

  let result: React.ReactNode;
  if (price.trim() === "" || value.trim() === "") {
    result = <ResultEmpty>Enter the original price and the discount to see the sale price.</ResultEmpty>;
  } else if (priceError || valueError || secondError || taxError || !pPrice.ok || !pValue.ok || !pSecond.ok || !pTax.ok) {
    result = <ResultError>{priceError ?? valueError ?? secondError ?? taxError}</ResultError>;
  } else {
    const r = calculateDiscount({
      price: pPrice.value,
      type,
      value: pValue.value,
      secondPercent: pSecond.value,
      taxPercent: pTax.value,
    });
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const hasSecond = pSecond.value > 0;
      const hasTax = pTax.value > 0;
      const firstText =
        type === "percent"
          ? `${formatNumber(pValue.value, 4)}% of ${formatMoney(pPrice.value)} = ${formatMoney(v.firstDiscount)}`
          : `${formatMoney(v.firstDiscount)} off`;
      const steps = [
        `First discount: ${firstText}, leaving ${formatMoney(pPrice.value)} − ${formatMoney(v.firstDiscount)} = ${formatMoney(v.afterFirst)}`,
      ];
      if (hasSecond) {
        steps.push(
          `Second discount: ${formatNumber(pSecond.value, 4)}% of ${formatMoney(v.afterFirst)} = ${formatMoney(v.secondDiscount)}, leaving ${formatMoney(v.priceBeforeTax)}`,
        );
      }
      steps.push(
        `Total saved: ${formatMoney(v.totalSavings)} ÷ ${formatMoney(pPrice.value)} = ${formatNumber(v.effectivePercent, 2)}% off overall`,
      );
      if (hasTax) {
        steps.push(
          `Sales tax: ${formatNumber(pTax.value, 4)}% of ${formatMoney(v.priceBeforeTax)} = ${formatMoney(v.tax)}, so the final price is ${formatMoney(v.finalPrice)}`,
        );
      }
      const summary = [
        `Original price: ${formatMoney(pPrice.value)}`,
        `Final price: ${formatMoney(v.finalPrice)}${hasTax ? ` (including ${formatNumber(pTax.value, 4)}% tax)` : ""}`,
        `You save: ${formatMoney(v.totalSavings)} (${formatNumber(v.effectivePercent, 2)}% off)`,
        `Price before tax: ${formatMoney(v.priceBeforeTax)}`,
        `Tax: ${formatMoney(v.tax)}`,
      ].join("\n");

      result = (
        <>
          <ResultHighlight
            label={hasTax ? "Final price (including tax)" : "Final price"}
            value={formatMoney(v.finalPrice)}
            badge={<Badge tone="success">{`${formatNumber(v.effectivePercent, 2)}% off`}</Badge>}
          />
          <StatGrid
            items={[
              { label: "You save", value: formatMoney(v.totalSavings) },
              {
                label: "Effective total discount",
                value: `${formatNumber(v.effectivePercent, 2)}%`,
                hint: hasSecond ? "Stacked discounts do not simply add up" : undefined,
              },
              { label: "Price before tax", value: formatMoney(v.priceBeforeTax) },
              { label: "Tax", value: formatMoney(v.tax), hint: hasTax ? `${formatNumber(pTax.value, 4)}% of the discounted price` : "No tax added" },
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
    <CalculatorShell
      title="Discount calculator"
      onReset={reset}
      toolbar={<Segmented label="Discount type" options={TYPES} value={type} onChange={setType} />}
      result={result}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Original price"
          placeholder="80"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={priceError}
        />
        <NumberField
          label={type === "percent" ? "Discount" : "Amount off"}
          suffix={type === "percent" ? "%" : undefined}
          placeholder={type === "percent" ? "25" : "15"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={valueError}
        />
        <NumberField
          label="Extra discount (optional)"
          suffix="%"
          placeholder="10"
          value={second}
          onChange={(e) => setSecond(e.target.value)}
          error={secondError}
          hint="Applied to the already reduced price."
        />
        <NumberField
          label="Sales tax (optional)"
          suffix="%"
          placeholder="8"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          error={taxError}
          hint="Added after all discounts."
        />
      </div>
    </CalculatorShell>
  );
}
