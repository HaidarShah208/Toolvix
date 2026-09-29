import type { CalcResult } from "@/lib/calculators/percentage";
import { roundTo } from "@/lib/utils/number";

export const CM_PER_INCH = 2.54;
export const KG_PER_LB = 0.45359237;

export const MIN_HEIGHT_CM = 50;
export const MAX_HEIGHT_CM = 272;
export const MIN_WEIGHT_KG = 2;
export const MAX_WEIGHT_KG = 650;

export const HEALTHY_MIN = 18.5;
export const HEALTHY_MAX = 24.9;

export type BmiCategoryId = "underweight" | "healthy" | "overweight" | "obese1" | "obese2" | "obese3";

export interface BmiCategory {
  id: BmiCategoryId;
  label: string;
  range: string;
  /** Lower bound (inclusive) of the category. */
  min: number;
  tone: "warning" | "success" | "danger";
}

/** WHO adult BMI categories, lowest first. */
export const BMI_CATEGORIES: readonly BmiCategory[] = [
  { id: "underweight", label: "Underweight", range: "below 18.5", min: 0, tone: "warning" },
  { id: "healthy", label: "Healthy weight", range: "18.5–24.9", min: 18.5, tone: "success" },
  { id: "overweight", label: "Overweight", range: "25–29.9", min: 25, tone: "warning" },
  { id: "obese1", label: "Obesity class I", range: "30–34.9", min: 30, tone: "danger" },
  { id: "obese2", label: "Obesity class II", range: "35–39.9", min: 35, tone: "danger" },
  { id: "obese3", label: "Obesity class III", range: "40 or above", min: 40, tone: "danger" },
];

export function bmiCategory(bmi: number): BmiCategory {
  let found = BMI_CATEGORIES[0];
  for (const c of BMI_CATEGORIES) if (bmi >= c.min) found = c;
  return found;
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * CM_PER_INCH;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalIn = cm / CM_PER_INCH;
  let feet = Math.floor(totalIn / 12);
  let inches = roundTo(totalIn - feet * 12, 1);
  if (inches >= 12) {
    feet += 1;
    inches = roundTo(inches - 12, 1);
  }
  return { feet, inches };
}

export const lbToKg = (lb: number) => lb * KG_PER_LB;
export const kgToLb = (kg: number) => kg / KG_PER_LB;

export interface BmiResult {
  /** Rounded to one decimal; the category is taken from this value so they always agree. */
  bmi: number;
  bmiExact: number;
  heightM: number;
  category: BmiCategory;
  healthyMinKg: number;
  healthyMaxKg: number;
}

export function validateHeightCm(cm: number): string | null {
  if (cm < MIN_HEIGHT_CM || cm > MAX_HEIGHT_CM) {
    return "Enter a height between 50 and 272 cm (about 1 ft 8 in to 8 ft 11 in).";
  }
  return null;
}

export function validateWeightKg(kg: number): string | null {
  if (kg < MIN_WEIGHT_KG || kg > MAX_WEIGHT_KG) {
    return "Enter a weight between 2 and 650 kg (about 4.4 to 1,433 lb).";
  }
  return null;
}

export function calculateBmi(heightCm: number, weightKg: number): CalcResult<BmiResult> {
  const hErr = validateHeightCm(heightCm);
  if (hErr) return { ok: false, error: hErr };
  const wErr = validateWeightKg(weightKg);
  if (wErr) return { ok: false, error: wErr };
  const heightM = heightCm / 100;
  const bmiExact = weightKg / (heightM * heightM);
  const bmi = roundTo(bmiExact, 1);
  return {
    ok: true,
    value: {
      bmi,
      bmiExact,
      heightM,
      category: bmiCategory(bmi),
      healthyMinKg: HEALTHY_MIN * heightM * heightM,
      healthyMaxKg: HEALTHY_MAX * heightM * heightM,
    },
  };
}
