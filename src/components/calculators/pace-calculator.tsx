"use client";

import { useState, type ReactNode } from "react";
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
import { NumberField, SelectField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  distanceFromTimePace,
  formatDuration,
  fromKm,
  paceFromDistanceTime,
  paceToPerKm,
  RACES,
  timeFromDistancePace,
  toKm,
  type DistanceUnit,
} from "@/lib/calculators/pace";
import { formatNumber, parseNumber, type ParseResult } from "@/lib/utils/number";

type Mode = "pace" | "time" | "distance";

const MODES = [
  { value: "pace", label: "Find pace" },
  { value: "time", label: "Find time" },
  { value: "distance", label: "Find distance" },
] as const;

const DIST_UNITS = [
  { value: "km", label: "Kilometers" },
  { value: "mi", label: "Miles" },
] as const;

const PACE_UNITS = [
  { value: "km", label: "per km" },
  { value: "mi", label: "per mile" },
] as const;

const ZERO: ParseResult = { ok: true, value: 0 };

function part(raw: string, label: string): ParseResult {
  return raw.trim() === "" ? ZERO : parseNumber(raw, { label, allowNegative: false });
}

function err(raw: string, p: ParseResult): string | undefined {
  return raw.trim() !== "" && !p.ok ? p.error : undefined;
}

const unitShort = (u: DistanceUnit) => (u === "km" ? "km" : "mi");

export default function PaceCalculator() {
  const [mode, setMode] = useState<Mode>("pace");
  const [distance, setDistance] = useState("");
  const [distUnit, setDistUnit] = useState<DistanceUnit>("km");
  const [time, setTime] = useState({ h: "", m: "", s: "" });
  const [pace, setPace] = useState({ m: "", s: "" });
  const [paceUnit, setPaceUnit] = useState<DistanceUnit>("km");

  function reset() {
    setDistance("");
    setTime({ h: "", m: "", s: "" });
    setPace({ m: "", s: "" });
  }

  const pDist = parseNumber(distance, { label: "Distance", allowNegative: false });
  const tH = part(time.h, "Hours");
  const tM = part(time.m, "Minutes");
  const tS = part(time.s, "Seconds");
  const pM = part(pace.m, "Pace minutes");
  const pS = part(pace.s, "Pace seconds");
  const v = (p: ParseResult) => (p.ok ? p.value : 0);
  const timeSeconds = v(tH) * 3600 + v(tM) * 60 + v(tS);
  const paceSeconds = v(pM) * 60 + v(pS);
  const timeEntered = [time.h, time.m, time.s].some((x) => x.trim() !== "");
  const paceEntered = [pace.m, pace.s].some((x) => x.trim() !== "");

  const needDist = mode !== "distance";
  const needTime = mode !== "time";
  const needPace = mode !== "pace";

  const distanceFields = (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3">
        <NumberField label="Distance" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="10" error={err(distance, pDist)} />
        <SelectField label="Distance unit" value={distUnit} onChange={(e) => setDistUnit(e.target.value as DistanceUnit)} options={DIST_UNITS} />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Race distance presets">
        {RACES.map((r) => (
          <Button
            key={r.key}
            variant="outline"
            size="sm"
            onClick={() => {
              setDistUnit("km");
              setDistance(String(r.km));
            }}
          >
            {r.label}
          </Button>
        ))}
      </div>
    </div>
  );

  const timeFields = (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-sm font-medium text-foreground">Time</legend>
      <div className="grid grid-cols-3 gap-3">
        <NumberField label="Hours" inputMode="numeric" value={time.h} onChange={(e) => setTime({ ...time, h: e.target.value })} placeholder="0" error={err(time.h, tH)} />
        <NumberField label="Minutes" inputMode="numeric" value={time.m} onChange={(e) => setTime({ ...time, m: e.target.value })} placeholder="50" error={err(time.m, tM)} />
        <NumberField label="Seconds" value={time.s} onChange={(e) => setTime({ ...time, s: e.target.value })} placeholder="0" error={err(time.s, tS)} />
      </div>
    </fieldset>
  );

  const paceFields = (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-sm font-medium text-foreground">Pace</legend>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <NumberField label="Minutes" inputMode="numeric" value={pace.m} onChange={(e) => setPace({ ...pace, m: e.target.value })} placeholder="5" error={err(pace.m, pM)} />
        <NumberField label="Seconds" value={pace.s} onChange={(e) => setPace({ ...pace, s: e.target.value })} placeholder="30" error={err(pace.s, pS)} />
        <SelectField label="Pace unit" containerClassName="col-span-2 sm:col-span-1" value={paceUnit} onChange={(e) => setPaceUnit(e.target.value as DistanceUnit)} options={PACE_UNITS} />
      </div>
    </fieldset>
  );

  let result: ReactNode;
  const missing = (needDist && distance.trim() === "") || (needTime && !timeEntered) || (needPace && !paceEntered);
  const firstError = [
    ...(needDist ? [pDist] : []),
    ...(needTime ? [tH, tM, tS] : []),
    ...(needPace ? [pM, pS] : []),
  ].find((p) => !p.ok);

  if (missing) {
    result = (
      <ResultEmpty>
        {mode === "pace"
          ? "Enter a distance and a time to work out your pace."
          : mode === "time"
            ? "Enter a distance and a pace to predict your finish time."
            : "Enter a time and a pace to see how far you'd go."}
      </ResultEmpty>
    );
  } else if (firstError && !firstError.ok) {
    result = <ResultError>{firstError.error}</ResultError>;
  } else {
    const distKm = toKm(v(pDist), distUnit);
    const paceKm = paceToPerKm(paceSeconds, paceUnit);
    const r =
      mode === "pace"
        ? paceFromDistanceTime(distKm, timeSeconds)
        : mode === "time"
          ? timeFromDistancePace(distKm, paceKm)
          : distanceFromTimePace(timeSeconds, paceKm);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const o = r.value;
      const distOut = `${formatNumber(fromKm(o.distanceKm, distUnit), 3)} ${unitShort(distUnit)}`;
      const distOther = distUnit === "km" ? `${formatNumber(fromKm(o.distanceKm, "mi"), 3)} mi` : `${formatNumber(o.distanceKm, 3)} km`;
      const pacePerKm = `${formatDuration(o.paceSecPerKm)} /km`;
      const pacePerMi = `${formatDuration(o.paceSecPerMile)} /mi`;
      const timeOut = formatDuration(o.timeSeconds);

      let label = "";
      let value = "";
      let sub = "";
      let step = "";
      if (mode === "pace") {
        label = `Pace for ${distOut} in ${timeOut}`;
        value = paceUnit === "km" ? pacePerKm : pacePerMi;
        sub = paceUnit === "km" ? `${pacePerMi}` : `${pacePerKm}`;
        step = `Pace = time ÷ distance = ${formatNumber(o.timeSeconds, 1)} s ÷ ${formatNumber(o.distanceKm, 4)} km = ${formatNumber(o.paceSecPerKm, 2)} s per km (${pacePerKm}).`;
      } else if (mode === "time") {
        label = `Finish time for ${distOut}`;
        value = timeOut;
        sub = `At ${paceUnit === "km" ? pacePerKm : pacePerMi}`;
        step = `Time = distance × pace = ${formatNumber(o.distanceKm, 4)} km × ${formatNumber(o.paceSecPerKm, 2)} s/km = ${formatNumber(o.timeSeconds, 1)} s (${timeOut}).`;
      } else {
        label = `Distance in ${timeOut}`;
        value = distOut;
        sub = distOther;
        step = `Distance = time ÷ pace = ${formatNumber(o.timeSeconds, 1)} s ÷ ${formatNumber(o.paceSecPerKm, 2)} s/km = ${formatNumber(o.distanceKm, 4)} km.`;
      }

      const summary = [
        `${label}: ${value}`,
        `Pace: ${pacePerKm} (${pacePerMi})`,
        `Speed: ${formatNumber(o.kmh, 2)} km/h (${formatNumber(o.mph, 2)} mph)`,
        `Even-pace projections: ${o.projections.map((p) => `${p.label} ${formatDuration(p.seconds)}`).join(", ")}`,
      ].join("\n");

      result = (
        <>
          <ResultHighlight label={label} value={value} sub={sub} />
          <StatGrid
            items={[
              { label: "Pace per km", value: pacePerKm },
              { label: "Pace per mile", value: pacePerMi },
              { label: "Speed (km/h)", value: formatNumber(o.kmh, 2) },
              { label: "Speed (mph)", value: formatNumber(o.mph, 2) },
            ]}
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-foreground">Even-pace projections</p>
            <DataTable
              caption="Projected finish times at this pace"
              columns={[
                { key: "race", label: "Race" },
                { key: "dist", label: "Distance", align: "right" },
                { key: "time", label: "Finish time", align: "right" },
              ]}
              rows={o.projections.map((p) => ({
                race: p.label,
                dist: `${formatNumber(p.km, 4)} km`,
                time: formatDuration(p.seconds),
              }))}
            />
            <p className="text-xs text-subtle">
              Simple linear projection holding this exact pace for the whole distance. Most runners slow down over longer races.
            </p>
          </div>
          <ResultSteps
            steps={[
              step,
              "1 mile = 1.609344 km, so pace per mile = pace per km × 1.609344.",
              `Speed = 3,600 ÷ pace in seconds per km = 3,600 ÷ ${formatNumber(o.paceSecPerKm, 2)} = ${formatNumber(o.kmh, 2)} km/h.`,
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
    <CalculatorShell
      title="Pace calculator"
      onReset={reset}
      toolbar={<Segmented label="What to calculate" options={MODES} value={mode} onChange={setMode} />}
      result={result}
    >
      {needDist ? distanceFields : null}
      {needTime ? timeFields : null}
      {needPace ? paceFields : null}
    </CalculatorShell>
  );
}
