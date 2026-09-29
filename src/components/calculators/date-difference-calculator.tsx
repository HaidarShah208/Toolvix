"use client";

import { useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import {
  ResultActions,
  ResultEmpty,
  ResultError,
  ResultHighlight,
  ResultSteps,
  StatGrid,
} from "@/components/tools/result";
import { ShareButton } from "@/components/tools/share-button";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField, InputField, NumberField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { dateDifference, shiftDate } from "@/lib/calculators/date-difference";
import { formatCalendarDate, parseISODate, plural, toISODate, today } from "@/lib/utils/date";
import { parseNumber } from "@/lib/utils/number";

type Mode = "between" | "shift";

const MODES = [
  { value: "between", label: "Between two dates" },
  { value: "shift", label: "Add or subtract" },
] as const;

const OPERATIONS = [
  { value: "add", label: "Add" },
  { value: "subtract", label: "Subtract" },
] as const;

function DateInput({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="flex min-w-0 items-end gap-2">
      <InputField
        type="date"
        label={label}
        value={value}
        min="0001-01-01"
        max="9999-12-31"
        onChange={(e) => onChange(e.target.value)}
        error={error}
        containerClassName="min-w-0 flex-1"
      />
      <Button variant="outline" size="md" className={error ? "mb-7" : undefined} onClick={() => onChange(toISODate(today()))}>
        Today
      </Button>
    </div>
  );
}

function ymdText(y: number, m: number, d: number): string {
  const parts = [];
  if (y) parts.push(plural(y, "year"));
  if (m) parts.push(plural(m, "month"));
  if (d || parts.length === 0) parts.push(plural(d, "day"));
  return parts.join(", ");
}

export default function DateDifferenceCalculator() {
  const [mode, setMode] = useState<Mode>("between");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);

  const [base, setBase] = useState("");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [amounts, setAmounts] = useState({ years: "", months: "", weeks: "", days: "" });

  function reset() {
    setStart("");
    setEnd("");
    setIncludeEnd(false);
    setBase("");
    setOperation("add");
    setAmounts({ years: "", months: "", weeks: "", days: "" });
  }

  let result: ReactNode;
  let inputs: ReactNode;

  if (mode === "between") {
    const s = parseISODate(start);
    const e = parseISODate(end);
    inputs = (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <DateInput label="Start date" value={start} onChange={setStart} error={start && !s ? "Enter a valid date." : undefined} />
          <DateInput label="End date" value={end} onChange={setEnd} error={end && !e ? "Enter a valid date." : undefined} />
        </div>
        <CheckboxField
          label="Include end date (+1 day)"
          description="Count both the first and the last day, e.g. for a booking or leave period."
          checked={includeEnd}
          onChange={(ev) => setIncludeEnd(ev.target.checked)}
        />
      </>
    );
    if (!start || !end) {
      result = <ResultEmpty>Pick a start and an end date to count the time between them.</ResultEmpty>;
    } else if (!s || !e) {
      result = <ResultError>One of the dates isn&apos;t a real calendar date. Check the day and month.</ResultError>;
    } else {
      const d = dateDifference(s, e, includeEnd);
      const ymd = ymdText(d.ymd.years, d.ymd.months, d.ymd.days);
      const summary = [
        `From ${formatCalendarDate(d.start)} to ${formatCalendarDate(d.end)}${includeEnd ? " (end date included)" : ""}:`,
        `${ymd}`,
        `Total: ${plural(d.totalDays, "day")} (${plural(d.weeks, "week")} and ${plural(d.remainingDays, "day")})`,
        `Business days (Mon–Fri): ${d.businessDays.toLocaleString("en-US")}; weekend days: ${d.weekendDays.toLocaleString("en-US")}`,
      ].join("\n");
      result = (
        <>
          {d.swapped ? (
            <Alert tone="info">The end date is before the start date, so we swapped them and show the absolute difference.</Alert>
          ) : null}
          <ResultHighlight label="Time between the dates" value={plural(d.totalDays, "day")} sub={ymd} />
          <StatGrid
            items={[
              { label: "Years, months, days", value: `${d.ymd.years} y ${d.ymd.months} m ${d.ymd.days} d` },
              { label: "Weeks and days", value: `${plural(d.weeks, "week")}, ${plural(d.remainingDays, "day")}` },
              { label: "Total whole months", value: d.totalMonths.toLocaleString("en-US") },
              { label: "Total days", value: d.totalDays.toLocaleString("en-US") },
              { label: "Business days", value: d.businessDays.toLocaleString("en-US"), hint: "Monday–Friday; public holidays are not excluded" },
              { label: "Weekend days", value: d.weekendDays.toLocaleString("en-US"), hint: "Saturdays and Sundays" },
            ]}
          />
          <ResultSteps
            steps={[
              `Counting from ${formatCalendarDate(d.start)} ${includeEnd ? "through" : "up to"} ${formatCalendarDate(d.end)}${includeEnd ? " (end date counted)" : " (end date not counted)"}.`,
              `Whole calendar months are counted first, then the leftover days: ${ymd}.`,
              `${d.totalDays.toLocaleString("en-US")} days ÷ 7 = ${plural(d.weeks, "week")} with ${plural(d.remainingDays, "day")} left over.`,
              `Of those days, ${d.businessDays.toLocaleString("en-US")} fall Monday–Friday and ${d.weekendDays.toLocaleString("en-US")} on weekends.`,
            ]}
          />
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
            <ShareButton title="Date Difference Calculator" text={summary} />
          </ResultActions>
        </>
      );
    }
  } else {
    const b = parseISODate(base);
    const keys = ["years", "months", "weeks", "days"] as const;
    const parsed = Object.fromEntries(
      keys.map((k) => [
        k,
        amounts[k].trim() === ""
          ? ({ ok: true, value: 0 } as const)
          : parseNumber(amounts[k], { label: k[0].toUpperCase() + k.slice(1), integer: true, allowNegative: false, max: k === "days" ? 3_650_000 : k === "weeks" ? 521_000 : k === "months" ? 120_000 : 10_000 }),
      ]),
    ) as Record<(typeof keys)[number], ReturnType<typeof parseNumber>>;
    inputs = (
      <>
        <DateInput label="Start date" value={base} onChange={setBase} error={base && !b ? "Enter a valid date." : undefined} />
        <Segmented label="Operation" options={OPERATIONS} value={operation} onChange={setOperation} size="sm" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {keys.map((k) => {
            const p = parsed[k];
            return (
              <NumberField
                key={k}
                label={k[0].toUpperCase() + k.slice(1)}
                inputMode="numeric"
                value={amounts[k]}
                onChange={(e) => setAmounts({ ...amounts, [k]: e.target.value })}
                placeholder="0"
                error={amounts[k].trim() !== "" && !p.ok ? p.error : undefined}
              />
            );
          })}
        </div>
      </>
    );
    const firstError = keys.map((k) => parsed[k]).find((p) => !p.ok);
    const anyAmount = keys.some((k) => amounts[k].trim() !== "");
    if (!base || !anyAmount) {
      result = <ResultEmpty>Pick a date and enter the years, months, weeks or days to {operation}.</ResultEmpty>;
    } else if (!b) {
      result = <ResultError>The start date isn&apos;t a real calendar date.</ResultError>;
    } else if (firstError && !firstError.ok) {
      result = <ResultError>{firstError.error}</ResultError>;
    } else {
      const val = (k: (typeof keys)[number]) => {
        const p = parsed[k];
        return p.ok ? p.value : 0;
      };
      const offset = { years: val("years"), months: val("months"), weeks: val("weeks"), days: val("days") };
      const r = shiftDate(b, offset, operation === "add" ? 1 : -1);
      if (!r.ok) {
        result = <ResultError>{r.error}</ResultError>;
      } else {
        const parts = keys.filter((k) => offset[k] > 0).map((k) => plural(offset[k], k.slice(0, -1)));
        const offsetText = parts.length ? parts.join(", ") : "0 days";
        const verb = operation === "add" ? "plus" : "minus";
        const summary = `${formatCalendarDate(b)} ${verb} ${offsetText} is ${formatCalendarDate(r.value.result)}`;
        result = (
          <>
            <ResultHighlight label={`${formatCalendarDate(b)} ${verb} ${offsetText}`} value={formatCalendarDate(r.value.result)} sub={toISODate(r.value.result)} />
            <ResultSteps
              steps={[
                `Years and months are applied first: ${operation === "add" ? "+" : "−"}${plural(offset.years * 12 + offset.months, "month")}.`,
                ...(r.value.clamped
                  ? ["The target month is shorter than the start day, so the date moves to that month's last day."]
                  : []),
                `Then weeks and days: ${operation === "add" ? "+" : "−"}${plural(offset.weeks * 7 + offset.days, "day")}.`,
              ]}
            />
            <ResultActions>
              <CopyButton text={summary} label="Copy result" />
            </ResultActions>
          </>
        );
      }
    }
  }

  return (
    <CalculatorShell
      title="Date difference calculator"
      onReset={reset}
      toolbar={<Segmented label="Calculation type" options={MODES} value={mode} onChange={setMode} />}
      result={result}
    >
      {inputs}
    </CalculatorShell>
  );
}
