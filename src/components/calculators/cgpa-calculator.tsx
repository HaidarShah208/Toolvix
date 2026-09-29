"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { InputField, NumberField, SelectField } from "@/components/ui/field";
import { calculateCgpa, type Semester } from "@/lib/calculators/gpa";
import { plural } from "@/lib/utils/date";
import { formatNumber, parseNumber } from "@/lib/utils/number";

interface Row {
  id: number;
  label: string;
  gpa: string;
  credits: string;
}

const SCALE_OPTIONS = [
  { value: "4", label: "4.0" },
  { value: "4.3", label: "4.3" },
  { value: "5", label: "5.0" },
  { value: "10", label: "10.0" },
] as const;

const MAX_SEMESTER_CREDITS = 100;

function makeRows(count: number, startId = 1): Row[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, label: "", gpa: "", credits: "" }));
}

export default function CgpaCalculator() {
  const [scaleMax, setScaleMax] = useState("4");
  const [rows, setRows] = useState<Row[]>(() => makeRows(3));
  const nextId = useRef(4);
  const max = Number(scaleMax);

  function update(id: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    const id = nextId.current++;
    setRows((rs) => [...rs, { id, label: "", gpa: "", credits: "" }]);
  }
  function removeRow(id: number) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  }
  function reset() {
    setScaleMax("4");
    setRows(makeRows(3, nextId.current));
    nextId.current += 3;
  }

  const semesters: Semester[] = [];
  const errors = new Map<number, { gpa?: string; credits?: string }>();
  let incomplete = 0;
  rows.forEach((r, i) => {
    const hasGpa = r.gpa.trim() !== "";
    const hasCredits = r.credits.trim() !== "";
    const pg = hasGpa ? parseNumber(r.gpa, { label: "GPA", min: 0, max }) : null;
    const pc = hasCredits
      ? parseNumber(r.credits, { label: "Credits", allowNegative: false, nonZero: true, max: MAX_SEMESTER_CREDITS })
      : null;
    const e: { gpa?: string; credits?: string } = {};
    if (pg && !pg.ok) e.gpa = pg.error;
    if (pc && !pc.ok) e.credits = pc.error;
    if (e.gpa || e.credits) {
      errors.set(r.id, e);
      return;
    }
    if (pg?.ok && pc?.ok) {
      semesters.push({ label: r.label.trim() || `Semester ${i + 1}`, gpa: pg.value, credits: pc.value });
    } else if (hasGpa || hasCredits) {
      incomplete += 1;
    }
  });

  let result: React.ReactNode;
  if (errors.size > 0) {
    result = (
      <ResultError>
        Fix the highlighted {errors.size === 1 ? "semester" : "semesters"}: each GPA must be between 0 and{" "}
        {formatNumber(max, 1, 1)}, and credits must be greater than 0.
      </ResultError>
    );
  } else if (semesters.length === 0) {
    result = <ResultEmpty>Enter a GPA and credits for at least one semester to see your CGPA.</ResultEmpty>;
  } else {
    const r = calculateCgpa(semesters);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const cgpaText = formatNumber(v.cgpa, 2, 2);
      const avgText = formatNumber(v.simpleAverage, 2, 2);
      const differs = semesters.length > 1 && Math.abs(v.cgpa - v.simpleAverage) >= 0.005;
      const summary = [
        `CGPA: ${cgpaText} out of ${formatNumber(max, 1, 1)}`,
        `Total credits: ${formatNumber(v.totalCredits)}`,
        ...semesters.map((s) => `${s.label}: GPA ${formatNumber(s.gpa, 2, 2)}, ${formatNumber(s.credits)} credits`),
      ].join("\n");

      result = (
        <>
          <ResultHighlight
            label={`Cumulative GPA (out of ${formatNumber(max, 1, 1)})`}
            value={cgpaText}
            sub={`${plural(semesters.length, "semester")} counted${incomplete ? `; ${plural(incomplete, "incomplete row")} ignored` : ""}.`}
          />
          <StatGrid
            items={[
              { label: "Total credits", value: formatNumber(v.totalCredits) },
              { label: "Total grade points", value: formatNumber(v.totalQualityPoints, 2) },
            ]}
          />
          {differs ? (
            <Alert tone="info">
              A simple average of your semester GPAs would be {avgText}. The CGPA of {cgpaText} is weighted by credits,
              so semesters with more credits count for more.
            </Alert>
          ) : null}
          <DataTable
            caption="Semester GPAs and credits"
            columns={[
              { key: "label", label: "Semester" },
              { key: "gpa", label: "GPA", align: "right" },
              { key: "credits", label: "Credits", align: "right" },
              { key: "points", label: "GPA × credits", align: "right" },
            ]}
            rows={semesters.map((s) => ({
              label: s.label,
              gpa: formatNumber(s.gpa, 2, 2),
              credits: formatNumber(s.credits),
              points: formatNumber(s.gpa * s.credits, 2),
            }))}
          />
          <ResultSteps
            steps={[
              "Multiply each semester's GPA by its credits.",
              `Add those products: ${formatNumber(v.totalQualityPoints, 2)}. Add the credits: ${formatNumber(v.totalCredits)}.`,
              `Divide: ${formatNumber(v.totalQualityPoints, 2)} ÷ ${formatNumber(v.totalCredits)} = ${formatNumber(v.cgpa, 4)} ≈ ${cgpaText}.`,
            ]}
          />
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell title="CGPA calculator" onReset={reset} result={result}>
      <SelectField
        label="Grading scale (maximum GPA)"
        options={SCALE_OPTIONS}
        value={scaleMax}
        onChange={(e) => setScaleMax(e.target.value)}
        containerClassName="sm:max-w-60"
      />
      <ol className="flex flex-col gap-3">
        {rows.map((r, i) => {
          const e = errors.get(r.id);
          const auto = `Semester ${i + 1}`;
          return (
            <li key={r.id} className="rounded-xl border border-border bg-surface-muted/40 p-3">
              <fieldset className="min-w-0">
                <legend className="sr-only">{r.label.trim() || auto}</legend>
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-start">
                  <InputField
                    label="Semester"
                    placeholder={auto}
                    value={r.label}
                    maxLength={60}
                    onChange={(ev) => update(r.id, { label: ev.target.value })}
                  />
                  <NumberField
                    label="GPA"
                    placeholder={max >= 10 ? "8.2" : "3.5"}
                    value={r.gpa}
                    onChange={(ev) => update(r.id, { gpa: ev.target.value })}
                    error={e?.gpa}
                  />
                  <NumberField
                    label="Credits"
                    placeholder="15"
                    value={r.credits}
                    onChange={(ev) => update(r.id, { credits: ev.target.value })}
                    error={e?.credits}
                  />
                  <Button
                    variant="danger"
                    size="icon"
                    className="justify-self-end sm:mt-7"
                    onClick={() => removeRow(r.id)}
                    disabled={rows.length <= 1}
                    aria-label={`Remove ${r.label.trim() || auto}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </fieldset>
            </li>
          );
        })}
      </ol>
      <Button variant="outline" className="self-start" onClick={addRow}>
        <Plus />
        Add semester
      </Button>
    </CalculatorShell>
  );
}
