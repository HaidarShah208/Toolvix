import type { CalcResult } from "@/lib/calculators/percentage";

export type Sex = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extra";

export const ACTIVITY_LEVELS: readonly { value: ActivityLevel; label: string; factor: number; description: string }[] = [
  { value: "sedentary", label: "Sedentary", factor: 1.2, description: "Desk job, little or no exercise" },
  { value: "light", label: "Lightly active", factor: 1.375, description: "Light exercise 1–3 days a week" },
  { value: "moderate", label: "Moderately active", factor: 1.55, description: "Moderate exercise 3–5 days a week" },
  { value: "very", label: "Very active", factor: 1.725, description: "Hard exercise 6–7 days a week" },
  { value: "extra", label: "Extra active", factor: 1.9, description: "Very hard exercise plus a physical job" },
];

export const CM_PER_INCH = 2.54;
export const KG_PER_LB = 0.45359237;

/** Commonly cited floor below which intake should be medically supervised. */
export const MIN_SAFE_CALORIES: Record<Sex, number> = { male: 1500, female: 1200 };

export const TARGETS = [
  { key: "mild-loss", label: "Mild weight loss", delta: -250, weeklyKg: -0.25, weeklyLb: -0.5 },
  { key: "loss", label: "Weight loss", delta: -500, weeklyKg: -0.5, weeklyLb: -1 },
  { key: "mild-gain", label: "Mild weight gain", delta: 250, weeklyKg: 0.25, weeklyLb: 0.5 },
  { key: "gain", label: "Weight gain", delta: 500, weeklyKg: 0.5, weeklyLb: 1 },
] as const;

export interface CalorieInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
}

export interface CalorieTarget {
  key: string;
  label: string;
  delta: number;
  calories: number;
  weeklyKg: number;
  weeklyLb: number;
  belowMinimum: boolean;
}

export interface CalorieOutput {
  bmr: number;
  factor: number;
  tdee: number;
  targets: CalorieTarget[];
  minimum: number;
}

export function validateBody(heightCm: number, weightKg: number, age: number): string | null {
  if (!Number.isInteger(age) || age < 15 || age > 80) return "Age must be a whole number from 15 to 80.";
  if (heightCm < 100 || heightCm > 250) return "Height must be between 100 and 250 cm (3 ft 3 in and 8 ft 2 in).";
  if (weightKg < 30 || weightKg > 300) return "Weight must be between 30 and 300 kg (66 and 661 lb).";
  return null;
}

/** Mifflin–St Jeor BMR multiplied by an activity factor. */
export function calorieNeeds(input: CalorieInput): CalcResult<CalorieOutput> {
  const invalid = validateBody(input.heightCm, input.weightKg, input.age);
  if (invalid) return { ok: false, error: invalid };
  const level = ACTIVITY_LEVELS.find((l) => l.value === input.activity) ?? ACTIVITY_LEVELS[0];
  const bmr = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age + (input.sex === "male" ? 5 : -161);
  const tdee = bmr * level.factor;
  const minimum = MIN_SAFE_CALORIES[input.sex];
  return {
    ok: true,
    value: {
      bmr,
      factor: level.factor,
      tdee,
      minimum,
      targets: TARGETS.map((t) => {
        const calories = tdee + t.delta;
        return {
          key: t.key,
          label: t.label,
          delta: t.delta,
          calories,
          weeklyKg: t.weeklyKg,
          weeklyLb: t.weeklyLb,
          belowMinimum: Math.round(calories) < minimum,
        };
      }),
    },
  };
}
