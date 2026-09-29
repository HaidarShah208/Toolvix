"use client";

import { Clock, Plus, X } from "lucide-react";
import { useId, useState, useSyncExternalStore, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { Badge, DataTable, ResultActions, ResultEmpty, ResultError, ResultHighlight } from "@/components/tools/result";
import { ShareButton } from "@/components/tools/share-button";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  DEFAULT_TARGET_ZONES,
  FALLBACK_TIME_ZONES,
  dayDiffLabel,
  describeInstant,
  formatOffset,
  getLocalTimeZone,
  getTimeZones,
  normalizeTimeZone,
  parseTime,
  resolveWallTime,
  type WallTime,
} from "@/lib/converters/timezone";
import { parseISODate } from "@/lib/utils/date";

const noopSubscribe = () => () => {};
const serverZones = () => FALLBACK_TIME_ZONES;

type Occurrence = "earlier" | "later";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function TimeZoneConverter() {
  const listId = useId();
  // Full zone list only on the client; the server (and hydration) use the fixed fallback list.
  const zones = useSyncExternalStore(noopSubscribe, getTimeZones, serverZones);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fromZone, setFromZone] = useState("UTC");
  const [targets, setTargets] = useState<string[]>(DEFAULT_TARGET_ZONES);
  const [newZone, setNewZone] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [occurrence, setOccurrence] = useState<Occurrence>("earlier");

  function fillNow() {
    const now = new Date();
    setDate(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
    setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
    setFromZone(getLocalTimeZone());
  }

  function addZone() {
    const z = normalizeTimeZone(newZone, zones);
    if (!z) {
      setAddError(newZone.trim() ? "That time zone was not recognized. Pick one from the list, e.g. Europe/Paris." : "Type or choose a time zone to add.");
      return;
    }
    if (targets.includes(z)) {
      setAddError(`${z} is already in the list.`);
      return;
    }
    setTargets([...targets, z]);
    setNewZone("");
    setAddError(null);
  }

  function reset() {
    setDate("");
    setTime("");
    setFromZone("UTC");
    setTargets(DEFAULT_TARGET_ZONES);
    setNewZone("");
    setAddError(null);
    setOccurrence("earlier");
  }

  const source = normalizeTimeZone(fromZone, zones);
  const parsedDate = date ? parseISODate(date) : null;
  const parsedTime = time ? parseTime(time) : null;
  const fromError = fromZone.trim() !== "" && !source ? "Time zone not recognized. Choose one from the list." : undefined;

  let ambiguous = false;
  let result: ReactNode;
  if (!date || !time) {
    result = <ResultEmpty>Pick a date and time, or press “Now”, to see it in every time zone.</ResultEmpty>;
  } else if (!parsedDate) {
    result = <ResultError>That date is not valid.</ResultError>;
  } else if (!parsedTime) {
    result = <ResultError>That time is not valid.</ResultError>;
  } else if (!source) {
    result = <ResultError>Choose a valid “From” time zone, such as America/New_York or UTC.</ResultError>;
  } else if (targets.length === 0) {
    result = <ResultEmpty>Add at least one time zone to convert to.</ResultEmpty>;
  } else {
    const wall: WallTime = { ...parsedDate, ...parsedTime };
    const r = resolveWallTime(wall, source);
    const wallLabel = `${pad(wall.hour)}:${pad(wall.minute)}`;
    let note: ReactNode = null;
    let instant: number;
    if (r.kind === "exact") {
      instant = r.instant;
    } else if (r.kind === "ambiguous") {
      ambiguous = true;
      const pick = occurrence === "earlier" ? r.earlier : r.later;
      instant = pick.instant;
      note = (
        <Alert tone="info" title={`${wallLabel} happens twice in ${source} on this date`}>
          Clocks go back, so this time occurs first at {formatOffset(r.earlier.offset)} and again at{" "}
          {formatOffset(r.later.offset)}. Showing the {occurrence === "earlier" ? "first" : "second"} occurrence (
          {formatOffset(pick.offset)}); switch it with the option under the time zone.
        </Alert>
      );
    } else {
      instant = r.instant;
      const shifted = describeInstant(instant, source);
      note = (
        <Alert tone="warning" title={`${wallLabel} does not exist in ${source} on this date`}>
          Clocks jump forward from {formatOffset(r.offsetBefore)} to {formatOffset(r.offsetAfter)}, skipping this time.
          Showing the moment it would have been, which the local clock reads as {shifted.time24}.
        </Alert>
      );
    }

    const src = describeInstant(instant, source, wall);
    const rows = targets.map((z) => describeInstant(instant, z, wall));
    const summary = [
      `${src.dateLabel} ${src.time24} ${source} (${src.offsetLabel})`,
      ...rows.map(
        (x) => `${x.zone}: ${x.dateLabel} ${x.time24} (${x.offsetLabel})${x.dayDiff !== 0 ? ` ${dayDiffLabel(x.dayDiff)}` : ""}`,
      ),
    ].join("\n");

    result = (
      <>
        {note}
        <ResultHighlight
          label={`In ${source}`}
          value={`${src.time24}`}
          sub={`${src.dateLabel} · ${src.time12} · ${src.offsetLabel}`}
        />
        <DataTable
          caption="The same moment in each selected time zone"
          columns={[
            { key: "zone", label: "Time zone" },
            { key: "date", label: "Date" },
            { key: "time", label: "Time", align: "right" },
            { key: "offset", label: "Offset" },
            { key: "day", label: "Day" },
          ]}
          rows={rows.map((x) => ({
            zone: <span className="font-medium text-foreground">{x.zone.replace(/_/g, " ")}</span>,
            date: x.dateLabel,
            time: (
              <span>
                <span className="font-semibold text-foreground">{x.time24}</span>{" "}
                <span className="text-subtle">{x.time12}</span>
              </span>
            ),
            offset: x.offsetLabel,
            day:
              x.dayDiff === 0 ? (
                <span className="text-subtle">Same day</span>
              ) : (
                <Badge tone={x.dayDiff > 0 ? "primary" : "warning"}>{dayDiffLabel(x.dayDiff)}</Badge>
              ),
          }))}
        />
        <ResultActions>
          <CopyButton text={summary} label="Copy summary" />
          <ShareButton title="Time Zone Converter" text={summary} />
        </ResultActions>
      </>
    );
  }

  return (
    <CalculatorShell title="Time zone converter" onReset={reset} result={result}>
      <datalist id={listId}>
        {zones.map((z) => (
          <option key={z} value={z} />
        ))}
      </datalist>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <InputField label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <InputField
          label="From time zone"
          list={listId}
          value={fromZone}
          onChange={(e) => setFromZone(e.target.value)}
          placeholder="e.g. America/New_York"
          autoComplete="off"
          spellCheck={false}
          error={fromError}
          hint="Start typing a city or region, e.g. London, Tokyo, Kolkata."
        />
        <div>
          <Button variant="outline" size="sm" onClick={fillNow}>
            <Clock />
            Now (my time and zone)
          </Button>
        </div>
        {ambiguous ? (
          <Segmented
            label="Which occurrence of the repeated time"
            size="sm"
            options={[
              { value: "earlier", label: "First (before clocks go back)" },
              { value: "later", label: "Second (after)" },
            ]}
            value={occurrence}
            onChange={setOccurrence}
          />
        ) : null}
      </div>

      <fieldset className="flex min-w-0 flex-col gap-3">
        <legend className="mb-2 text-sm font-medium text-foreground">Convert to</legend>
        <ul className="flex flex-wrap gap-2">
          {targets.map((z) => (
            <li
              key={z}
              className="flex min-w-0 items-center gap-1 rounded-full border border-border bg-surface-muted py-1 pr-1 pl-3 text-sm text-foreground"
            >
              <span className="min-w-0 break-all">{z.replace(/_/g, " ")}</span>
              <button
                type="button"
                onClick={() => setTargets(targets.filter((t) => t !== z))}
                aria-label={`Remove ${z}`}
                className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted hover:bg-border hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-start gap-2">
          <InputField
            label="Add a time zone"
            list={listId}
            value={newZone}
            onChange={(e) => {
              setNewZone(e.target.value);
              setAddError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addZone();
              }
            }}
            placeholder="e.g. Europe/Paris"
            autoComplete="off"
            spellCheck={false}
            error={addError ?? undefined}
            containerClassName="flex-1"
          />
          <Button variant="secondary" onClick={addZone} className="mt-6.5">
            <Plus />
            Add
          </Button>
        </div>
      </fieldset>
    </CalculatorShell>
  );
}
