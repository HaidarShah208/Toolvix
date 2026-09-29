"use client";

import { Plus, Trash2 } from "lucide-react";
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
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField, InputField, NumberField, SelectField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  breakdown,
  clockDifference,
  formatHMS,
  parseClock,
  sumDurations,
  type DurationRow,
} from "@/lib/calculators/time";
import { formatNumber, parseNumber, type ParseResult } from "@/lib/utils/number";

type Mode = "durations" | "clock";

const MODES = [
  { value: "durations", label: "Add / subtract times" },
  { value: "clock", label: "Time between two times" },
] as const;

const SIGNS = [
  { value: "+", label: "+ Add" },
  { value: "-", label: "− Subtract" },
] as const;

interface Row {
  id: number;
  sign: "+" | "-";
  h: string;
  m: string;
  s: string;
}

const MAX_ROWS = 50;
const initialRows = (): Row[] => [
  { id: 1, sign: "+", h: "", m: "", s: "" },
  { id: 2, sign: "+", h: "", m: "", s: "" },
];

function parsePart(raw: string, label: string): ParseResult {
  if (raw.trim() === "") return { ok: true, value: 0 };
  return parseNumber(raw, { label, allowNegative: false, max: 1e9 });
}

function durationWords(totalSeconds: number): string {
  const b = breakdown(totalSeconds);
  const parts: string[] = [];
  const hours = b.days * 24 + b.hours;
  if (hours) parts.push(`${hours.toLocaleString("en-US")} h`);
  if (b.minutes || !hours) parts.push(`${b.minutes} min`);
  if (b.seconds) parts.push(`${formatNumber(b.seconds, 3)} s`);
  return `${b.negative ? "−" : ""}${parts.join(" ")}`;
}

export default function TimeCalculator() {
  const [mode, setMode] = useState<Mode>("durations");
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [nextId, setNextId] = useState(3);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [nextDay, setNextDay] = useState(false);
  const [breakMin, setBreakMin] = useState("");

  function reset() {
    setRows(initialRows());
    setNextId(3);
    setStartTime("");
    setEndTime("");
    setNextDay(false);
    setBreakMin("");
  }

  function updateRow(id: number, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  let result: ReactNode;
  let inputs: ReactNode;

  if (mode === "durations") {
    const parsed = rows.map((r, i) => ({
      row: r,
      h: parsePart(r.h, `Row ${i + 1} hours`),
      m: parsePart(r.m, `Row ${i + 1} minutes`),
      s: parsePart(r.s, `Row ${i + 1} seconds`),
    }));
    inputs = (
      <>
        <ol className="flex flex-col gap-3">
          {parsed.map(({ row, h, m, s }, i) => (
            <li key={row.id} className="rounded-xl border border-border p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground">Time {i + 1}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setRows((rs) => rs.filter((r) => r.id !== row.id))}
                  disabled={rows.length <= 1}
                  aria-label={`Remove time ${i + 1}`}
                >
                  <Trash2 />
                  Remove
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <SelectField
                  label="Operation"
                  value={row.sign}
                  onChange={(e) => updateRow(row.id, { sign: e.target.value as Row["sign"] })}
                  options={SIGNS}
                />
                <NumberField label="Hours" value={row.h} onChange={(e) => updateRow(row.id, { h: e.target.value })} placeholder="0" error={h.ok ? undefined : h.error} />
                <NumberField label="Minutes" value={row.m} onChange={(e) => updateRow(row.id, { m: e.target.value })} placeholder="0" error={m.ok ? undefined : m.error} />
                <NumberField label="Seconds" value={row.s} onChange={(e) => updateRow(row.id, { s: e.target.value })} placeholder="0" error={s.ok ? undefined : s.error} />
              </div>
            </li>
          ))}
        </ol>
        <div>
          <Button
            variant="outline"
            size="sm"
            disabled={rows.length >= MAX_ROWS}
            onClick={() => {
              setRows((rs) => [...rs, { id: nextId, sign: "+", h: "", m: "", s: "" }]);
              setNextId((n) => n + 1);
            }}
          >
            <Plus />
            Add time
          </Button>
        </div>
      </>
    );
    const anyInput = rows.some((r) => r.h.trim() || r.m.trim() || r.s.trim());
    const firstError = parsed.flatMap((p) => [p.h, p.m, p.s]).find((p) => !p.ok);
    if (!anyInput) {
      result = <ResultEmpty>Enter hours, minutes or seconds to add them up.</ResultEmpty>;
    } else if (firstError && !firstError.ok) {
      result = <ResultError>{firstError.error}</ResultError>;
    } else {
      const val = (p: ParseResult) => (p.ok ? p.value : 0);
      const durations: DurationRow[] = parsed.map((p) => ({
        sign: p.row.sign === "+" ? 1 : -1,
        hours: val(p.h),
        minutes: val(p.m),
        seconds: val(p.s),
      }));
      const total = sumDurations(durations);
      const b = breakdown(total);
      const hms = formatHMS(total);
      const summary = [
        `Total: ${hms} (${durationWords(total)})`,
        `= ${formatNumber(total / 3600, 6)} hours = ${formatNumber(total / 60, 4)} minutes = ${formatNumber(total, 3)} seconds`,
      ].join("\n");
      result = (
        <>
          <ResultHighlight label="Total time (h:mm:ss)" value={hms} sub={durationWords(total)} />
          <StatGrid
            items={[
              { label: "Total hours", value: formatNumber(total / 3600, 6) },
              { label: "Total minutes", value: formatNumber(total / 60, 4) },
              { label: "Total seconds", value: formatNumber(total, 3) },
              ...(b.days > 0
                ? [
                    {
                      label: "Days and hours",
                      value: `${b.negative ? "−" : ""}${b.days}d ${b.hours}h ${b.minutes}m ${formatNumber(b.seconds, 3)}s`,
                    },
                  ]
                : []),
            ]}
          />
          <ResultSteps
            steps={[
              "Convert each row to seconds: hours × 3,600 + minutes × 60 + seconds.",
              `Combine them: ${durations
                .map((d, i) => {
                  const secs = formatNumber(d.hours * 3600 + d.minutes * 60 + d.seconds, 3);
                  return i === 0 ? `${d.sign === 1 ? "" : "−"}${secs}` : `${d.sign === 1 ? "+" : "−"} ${secs}`;
                })
                .join(" ")} = ${formatNumber(total, 3)} seconds.`,
              "Convert back: divide by 3,600 for hours, and the remainder by 60 for minutes.",
            ]}
          />
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
          </ResultActions>
        </>
      );
    }
  } else {
    const s = parseClock(startTime);
    const e = parseClock(endTime);
    const auto = s !== null && e !== null && e < s;
    const pBreak = breakMin.trim() === "" ? ({ ok: true, value: 0 } as const) : parseNumber(breakMin, { label: "Break", allowNegative: false, max: 1440 });
    inputs = (
      <>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField type="time" step={60} label="Start time" value={startTime} onChange={(ev) => setStartTime(ev.target.value)} hint="24-hour clock" />
          <InputField type="time" step={60} label="End time" value={endTime} onChange={(ev) => setEndTime(ev.target.value)} hint="24-hour clock" />
        </div>
        <CheckboxField
          label="Ends next day"
          description={
            auto
              ? "Turned on automatically: the end time is earlier than the start time, so it must be on the following day."
              : "Tick for an overnight span, or if the end is the same time next day."
          }
          checked={auto || nextDay}
          disabled={auto}
          onChange={(ev) => setNextDay(ev.target.checked)}
        />
        <NumberField
          label="Break to subtract (optional)"
          value={breakMin}
          onChange={(ev) => setBreakMin(ev.target.value)}
          suffix="min"
          placeholder="0"
          hint="Useful for working out paid hours on a shift."
          error={breakMin.trim() !== "" && !pBreak.ok ? pBreak.error : undefined}
        />
      </>
    );
    if (!startTime || !endTime) {
      result = <ResultEmpty>Enter a start and an end time to see the duration.</ResultEmpty>;
    } else if (s === null || e === null) {
      result = <ResultError>Enter both times as hours and minutes, e.g. 09:00 and 17:30.</ResultError>;
    } else if (!pBreak.ok) {
      result = <ResultError>{pBreak.error}</ResultError>;
    } else {
      const r = clockDifference(s, e, nextDay, pBreak.value);
      if (!r.ok) {
        result = <ResultError>{r.error}</ResultError>;
      } else {
        const v = r.value;
        const words = durationWords(v.netSeconds);
        const summary = [
          `${startTime} to ${endTime}${v.nextDay ? " (next day)" : ""}${v.breakSeconds ? `, minus ${formatNumber(pBreak.value, 2)} min break` : ""}`,
          `Duration: ${words} = ${formatNumber(v.netSeconds / 3600, 4)} hours`,
        ].join("\n");
        result = (
          <>
            {v.autoNextDay ? (
              <Alert tone="info">The end time is earlier than the start time, so we treated it as the next day.</Alert>
            ) : null}
            <ResultHighlight label={v.breakSeconds ? "Duration after break" : "Duration"} value={words} sub={`${formatNumber(v.netSeconds / 3600, 4)} hours in decimal`} />
            <StatGrid
              items={[
                { label: "Decimal hours", value: formatNumber(v.netSeconds / 3600, 4) },
                { label: "Total minutes", value: formatNumber(v.netSeconds / 60, 2) },
                ...(v.breakSeconds ? [{ label: "Before break", value: durationWords(v.grossSeconds) }] : []),
              ]}
            />
            <ResultSteps
              steps={[
                v.nextDay
                  ? `End is on the next day: (24:00 − ${startTime}) + ${endTime} = ${durationWords(v.grossSeconds)}.`
                  : `${endTime} − ${startTime} = ${durationWords(v.grossSeconds)}.`,
                ...(v.breakSeconds ? [`Subtract the break: ${durationWords(v.grossSeconds)} − ${formatNumber(pBreak.value, 2)} min = ${words}.`] : []),
                `Decimal hours = minutes ÷ 60 = ${formatNumber(v.netSeconds / 60, 2)} ÷ 60 = ${formatNumber(v.netSeconds / 3600, 4)}.`,
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
      title="Time calculator"
      onReset={reset}
      toolbar={<Segmented label="Calculation type" options={MODES} value={mode} onChange={setMode} />}
      result={result}
    >
      {inputs}
    </CalculatorShell>
  );
}
