"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
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
import { ShareButton } from "@/components/tools/share-button";
import { Button } from "@/components/ui/button";
import { InputField, NumberField, SelectField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  calculateGpa,
  gradeLabel,
  gradePoints,
  isLetterGrade,
  LETTER_GRADES,
  type GpaCourse,
  type GpaScale,
} from "@/lib/calculators/gpa";
import { formatNumber, parseNumber } from "@/lib/utils/number";

interface Row {
  id: number;
  name: string;
  credits: string;
  grade: string;
}

const SCALES = [
  { value: "4.0", label: "4.0 scale (A+ = 4.0)" },
  { value: "4.3", label: "4.3 scale (A+ = 4.3)" },
] as const;

const MAX_CREDITS = 30;

function makeRows(count: number, startId = 1): Row[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, name: "", credits: "", grade: "" }));
}

function gradeOptions(scale: GpaScale) {
  return [
    { value: "", label: "Select grade" },
    ...LETTER_GRADES.map((g) => ({ value: g, label: `${gradeLabel(g)} (${formatNumber(gradePoints(g, scale), 1, 1)})` })),
  ];
}

export default function GpaCalculator() {
  const [scale, setScale] = useState<GpaScale>("4.0");
  const [rows, setRows] = useState<Row[]>(() => makeRows(4));
  const nextId = useRef(5);

  function update(id: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addRow() {
    const id = nextId.current++;
    setRows((rs) => [...rs, { id, name: "", credits: "", grade: "" }]);
  }
  function removeRow(id: number) {
    setRows((rs) => (rs.length > 1 ? rs.filter((r) => r.id !== id) : rs));
  }
  function reset() {
    setScale("4.0");
    setRows(makeRows(4, nextId.current));
    nextId.current += 4;
  }

  const options = gradeOptions(scale);
  const courses: GpaCourse[] = [];
  const creditErrors = new Map<number, string>();
  let incomplete = 0;
  rows.forEach((r) => {
    const hasCredits = r.credits.trim() !== "";
    let credits: number | null = null;
    if (hasCredits) {
      const p = parseNumber(r.credits, { label: "Credits", allowNegative: false, nonZero: true, max: MAX_CREDITS });
      if (p.ok) credits = p.value;
      else creditErrors.set(r.id, p.error);
    }
    if (credits !== null && isLetterGrade(r.grade)) {
      courses.push({ name: r.name.trim(), credits, grade: r.grade });
    } else if (!creditErrors.has(r.id) && (hasCredits || r.grade !== "" || r.name.trim() !== "")) {
      incomplete += 1;
    }
  });

  let result: React.ReactNode;
  if (creditErrors.size > 0) {
    result = (
      <ResultError>
        Fix the credits in {creditErrors.size === 1 ? "one course" : `${creditErrors.size} courses`}: credits must be a
        number greater than 0 and no more than {MAX_CREDITS}.
      </ResultError>
    );
  } else if (courses.length === 0) {
    result = <ResultEmpty>Enter credits and a grade for at least one course to see your GPA.</ResultEmpty>;
  } else {
    const r = calculateGpa(courses, scale);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const gpaText = formatNumber(v.gpa, 2, 2);
      const countedText = `${courses.length} of ${rows.length} ${rows.length === 1 ? "row" : "rows"} counted${incomplete ? `; ${incomplete} incomplete ${incomplete === 1 ? "row was" : "rows were"} ignored` : ""}.`;
      const label = (name: string, i: number) => name || `Course ${i + 1}`;
      const summary = [
        `GPA: ${gpaText} (${scale} scale)`,
        `Total credits: ${formatNumber(v.totalCredits)}`,
        `Total quality points: ${formatNumber(v.totalQualityPoints, 2)}`,
        ...v.courses.map(
          (c, i) =>
            `${label(c.name, i)}: ${gradeLabel(c.grade)}, ${formatNumber(c.credits)} credits × ${formatNumber(c.points, 1, 1)} = ${formatNumber(c.qualityPoints, 2)}`,
        ),
      ].join("\n");

      result = (
        <>
          <ResultHighlight label={`Your GPA (${scale} scale)`} value={gpaText} sub={countedText} />
          <StatGrid
            items={[
              { label: "Total credits", value: formatNumber(v.totalCredits) },
              { label: "Total quality points", value: formatNumber(v.totalQualityPoints, 2) },
            ]}
          />
          <DataTable
            caption="Grade points per course"
            columns={[
              { key: "course", label: "Course" },
              { key: "grade", label: "Grade" },
              { key: "credits", label: "Credits", align: "right" },
              { key: "points", label: "Points", align: "right" },
              { key: "quality", label: "Quality pts", align: "right" },
            ]}
            rows={v.courses.map((c, i) => ({
              course: label(c.name, i),
              grade: gradeLabel(c.grade),
              credits: formatNumber(c.credits),
              points: formatNumber(c.points, 1, 1),
              quality: formatNumber(c.qualityPoints, 2),
            }))}
          />
          <ResultSteps
            steps={[
              "Multiply each course's credits by its grade points to get quality points.",
              `Add the quality points: ${formatNumber(v.totalQualityPoints, 2)}. Add the credits: ${formatNumber(v.totalCredits)}.`,
              `Divide: ${formatNumber(v.totalQualityPoints, 2)} ÷ ${formatNumber(v.totalCredits)} = ${formatNumber(v.gpa, 4)} ≈ ${gpaText}.`,
            ]}
          />
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
            <ShareButton title="GPA Calculator" text={`My GPA is ${gpaText} on a ${scale} scale.`} />
          </ResultActions>
        </>
      );
    }
  }

  return (
    <CalculatorShell
      title="GPA calculator"
      onReset={reset}
      toolbar={<Segmented label="Grading scale" options={SCALES} value={scale} onChange={setScale} />}
      result={result}
    >
      <ol className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <li key={r.id} className="rounded-xl border border-border bg-surface-muted/40 p-3">
            <fieldset className="min-w-0">
              <legend className="sr-only">Course {i + 1}</legend>
              <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1fr)_auto] sm:items-start">
                <InputField
                  label={`Course ${i + 1} name`}
                  placeholder={`Course ${i + 1} (optional)`}
                  value={r.name}
                  maxLength={80}
                  onChange={(e) => update(r.id, { name: e.target.value })}
                />
                <NumberField
                  label="Credits"
                  placeholder="3"
                  value={r.credits}
                  onChange={(e) => update(r.id, { credits: e.target.value })}
                  error={creditErrors.get(r.id)}
                />
                <SelectField
                  label="Grade"
                  options={options}
                  value={r.grade}
                  onChange={(e) => update(r.id, { grade: e.target.value })}
                />
                <Button
                  variant="danger"
                  size="icon"
                  className="justify-self-end sm:mt-7"
                  onClick={() => removeRow(r.id)}
                  disabled={rows.length <= 1}
                  aria-label={`Remove course ${i + 1}${r.name.trim() ? ` (${r.name.trim()})` : ""}`}
                >
                  <Trash2 />
                </Button>
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      <Button variant="outline" className="self-start" onClick={addRow}>
        <Plus />
        Add course
      </Button>
    </CalculatorShell>
  );
}
