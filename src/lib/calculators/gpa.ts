import type { CalcResult } from "@/lib/calculators/percentage";
import { roundTo } from "@/lib/utils/number";

export type GpaScale = "4.0" | "4.3";

export const LETTER_GRADES = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"] as const;
export type LetterGrade = (typeof LETTER_GRADES)[number];

const STANDARD_POINTS: Record<Exclude<LetterGrade, "A+">, number> = {
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0,
};

export function isLetterGrade(value: string): value is LetterGrade {
  return (LETTER_GRADES as readonly string[]).includes(value);
}

/** Grade points for a letter on the chosen scale. A+ is 4.0 or 4.3; everything else is the same. */
export function gradePoints(grade: LetterGrade, scale: GpaScale): number {
  if (grade === "A+") return scale === "4.3" ? 4.3 : 4.0;
  return STANDARD_POINTS[grade];
}

/** Display form with a proper minus sign (A−). */
export function gradeLabel(grade: LetterGrade): string {
  return grade.replace("-", "−");
}

export interface GpaCourse {
  name: string;
  credits: number;
  grade: LetterGrade;
}

export interface GpaCourseResult extends GpaCourse {
  points: number;
  qualityPoints: number;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  courses: GpaCourseResult[];
}

export function calculateGpa(courses: GpaCourse[], scale: GpaScale): CalcResult<GpaResult> {
  let totalCredits = 0;
  let totalQualityPoints = 0;
  const rows: GpaCourseResult[] = courses.map((c) => {
    const points = gradePoints(c.grade, scale);
    const qualityPoints = roundTo(points * c.credits);
    totalCredits += c.credits;
    totalQualityPoints += qualityPoints;
    return { ...c, points, qualityPoints };
  });
  totalCredits = roundTo(totalCredits);
  totalQualityPoints = roundTo(totalQualityPoints);
  if (totalCredits <= 0) {
    return { ok: false, error: "Add at least one course with credits and a grade to calculate a GPA." };
  }
  return {
    ok: true,
    value: { gpa: roundTo(totalQualityPoints / totalCredits), totalCredits, totalQualityPoints, courses: rows },
  };
}

export interface Semester {
  label: string;
  gpa: number;
  credits: number;
}

export interface CgpaResult {
  cgpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  simpleAverage: number;
  count: number;
}

/** Credit-weighted cumulative GPA across semesters. */
export function calculateCgpa(semesters: Semester[]): CalcResult<CgpaResult> {
  let totalCredits = 0;
  let totalQualityPoints = 0;
  let gpaSum = 0;
  for (const s of semesters) {
    totalCredits += s.credits;
    totalQualityPoints += s.gpa * s.credits;
    gpaSum += s.gpa;
  }
  totalCredits = roundTo(totalCredits);
  totalQualityPoints = roundTo(totalQualityPoints);
  if (semesters.length === 0 || totalCredits <= 0) {
    return { ok: false, error: "Add at least one semester with a GPA and credits to calculate a CGPA." };
  }
  return {
    ok: true,
    value: {
      cgpa: roundTo(totalQualityPoints / totalCredits),
      totalCredits,
      totalQualityPoints,
      simpleAverage: roundTo(gpaSum / semesters.length),
      count: semesters.length,
    },
  };
}
