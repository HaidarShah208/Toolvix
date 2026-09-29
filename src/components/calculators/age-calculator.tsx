"use client";

import { useState, useSyncExternalStore } from "react";
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
import { ShareButton } from "@/components/tools/share-button";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/ui/field";
import { calculateAge } from "@/lib/calculators/age";
import {
  formatCalendarDate,
  parseISODate,
  plural,
  toISODate,
  today,
  WEEKDAYS,
} from "@/lib/utils/date";

const noopSubscribe = () => () => {};
/** Today's date as YYYY-MM-DD on the client; empty during server render and hydration. */
function useTodayISO(): string {
  return useSyncExternalStore(
    noopSubscribe,
    () => toISODate(today()),
    () => "",
  );
}

export default function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [asOf, setAsOf] = useState("");
  const todayISO = useTodayISO();

  const onValue = asOf || todayISO;
  const usingToday = asOf === "" || asOf === todayISO;

  function reset() {
    setDob("");
    setAsOf("");
  }

  const dobDate = dob ? parseISODate(dob) : null;
  const onDate = onValue ? parseISODate(onValue) : null;
  const dobError = dob && !dobDate ? "Enter a real calendar date, for example 1990-05-14." : undefined;
  const onError = asOf && !onDate ? "Enter a real calendar date." : undefined;

  let result: React.ReactNode;
  if (!dob) {
    result = <ResultEmpty>Enter a date of birth to see the exact age.</ResultEmpty>;
  } else if (!dobDate) {
    result = <ResultError>The date of birth is not a valid date. Check the day, month and year.</ResultError>;
  } else if (!onDate) {
    result = onValue ? (
      <ResultError>The &ldquo;age on&rdquo; date is not a valid date.</ResultError>
    ) : (
      <ResultEmpty>Choose the date to calculate the age on.</ResultEmpty>
    );
  } else {
    const r = calculateAge(dobDate, onDate);
    if (!r.ok) {
      result = <ResultError>{r.error}</ResultError>;
    } else {
      const v = r.value;
      const ageText = `${plural(v.age.years, "year")}, ${plural(v.age.months, "month")}, ${plural(v.age.days, "day")}`;
      const onLabel = usingToday ? "today" : `on ${formatCalendarDate(onDate)}`;
      const birthdayText = v.isBirthdayToday
        ? `Happy birthday! ${v.turning > 0 ? `Turning ${v.turning} ${usingToday ? "today" : "on this date"}.` : ""}`
        : `${formatCalendarDate(v.nextBirthday)} (in ${plural(v.daysUntilBirthday, "day")}, turning ${v.turning})`;
      const summary = [
        `Age ${onLabel}: ${ageText}`,
        `Born on a ${WEEKDAYS[v.bornWeekday]} (${formatCalendarDate(dobDate)})`,
        `Total: ${plural(v.totalMonths, "month")}, ${plural(v.totalWeeks, "week")} and ${plural(v.weekRemainderDays, "day")}, or ${plural(v.totalDays, "day")}`,
        `Next birthday: ${birthdayText}`,
      ].join("\n");

      result = (
        <>
          <ResultHighlight
            label={`Age ${onLabel}`}
            value={ageText}
            badge={v.isBirthdayToday ? <Badge tone="success">Happy birthday!</Badge> : null}
            sub={`Born on a ${WEEKDAYS[v.bornWeekday]}, ${formatCalendarDate(dobDate).split(", ").slice(1).join(", ")}`}
          />
          <StatGrid
            items={[
              { label: "Total months", value: v.totalMonths.toLocaleString("en-US") },
              {
                label: "Total weeks",
                value: plural(v.totalWeeks, "week"),
                hint: v.weekRemainderDays ? `plus ${plural(v.weekRemainderDays, "day")}` : "exactly",
              },
              { label: "Total days", value: v.totalDays.toLocaleString("en-US") },
              { label: "Day of the week born", value: WEEKDAYS[v.bornWeekday] },
              {
                label: "Next birthday",
                value: v.isBirthdayToday ? "Today" : formatCalendarDate(v.nextBirthday),
                hint: v.isBirthdayToday
                  ? `Happy birthday! Turning ${v.turning}.`
                  : `In ${plural(v.daysUntilBirthday, "day")}, turning ${v.turning}${v.birthdayMovedTo28Feb ? " (observed on 28 February)" : ""}`,
              },
            ]}
          />
          <ResultSteps
            steps={[
              `Count whole years and months from ${formatCalendarDate(dobDate)}: ${plural(v.totalMonths, "month")} = ${plural(v.age.years, "year")} and ${plural(v.age.months, "month")}.`,
              `Count the days left over after the last whole month: ${plural(v.age.days, "day")}.`,
              `Total days between the dates: ${v.totalDays.toLocaleString("en-US")} = ${plural(v.totalWeeks, "week")} × 7 + ${plural(v.weekRemainderDays, "day")}.`,
            ]}
          />
          <ResultActions>
            <CopyButton text={summary} label="Copy result" />
            <ShareButton title="Age Calculator" text={`Age ${onLabel}: ${ageText}`} />
          </ResultActions>
        </>
      );
    }
  }

  const leapHint =
    dobDate && dobDate.month === 2 && dobDate.day === 29
      ? "Born on 29 February: in common years your birthday is counted on 28 February."
      : "Pick or type the date, e.g. 1990-05-14.";

  return (
    <CalculatorShell title="Age calculator" onReset={reset} result={result}>
      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          type="date"
          label="Date of birth"
          value={dob}
          max="9999-12-31"
          onChange={(e) => setDob(e.target.value)}
          error={dobError}
          hint={leapHint}
        />
        <div className="flex min-w-0 flex-col gap-2">
          <InputField
            type="date"
            label="Age on date"
            value={onValue}
            max="9999-12-31"
            onChange={(e) => setAsOf(e.target.value)}
            error={onError}
            hint={usingToday ? "Defaults to today." : "Calculating the age on a custom date."}
          />
          {!usingToday ? (
            <Button variant="outline" size="sm" className="self-start" onClick={() => setAsOf("")}>
              Use today
            </Button>
          ) : null}
        </div>
      </div>
    </CalculatorShell>
  );
}
