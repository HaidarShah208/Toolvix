"use client";

import { Eraser } from "lucide-react";
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { StatGrid } from "@/components/tools/result";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/ui/field";
import { charStats, smsInfo, xWeightedLength } from "@/lib/text/stats";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/number";

function LimitRow({
  label,
  used,
  limit,
  note,
}: {
  label: string;
  used: number;
  limit: number;
  note?: ReactNode;
}) {
  const over = used - limit;
  const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
  const status =
    over > 0 ? `${formatNumber(over)} over` : `${formatNumber(limit - used)} left`;
  return (
    <li className="flex min-w-0 flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular text-muted">
          {formatNumber(used)} / {formatNumber(limit)} ·{" "}
          <span className={cn("font-semibold", over > 0 ? "text-danger" : "text-foreground")}>{status}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-muted ring-1 ring-border" aria-hidden="true">
        <div
          className={cn("h-full rounded-full", over > 0 ? "bg-danger" : pct >= 90 ? "bg-warning" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
      {note ? <p className="text-xs text-subtle">{note}</p> : null}
    </li>
  );
}

export default function CharacterCounter() {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);
  const s = useMemo(() => charStats(deferred), [deferred]);
  const sms = useMemo(() => smsInfo(deferred), [deferred]);
  const xLength = useMemo(() => xWeightedLength(deferred), [deferred]);

  const smsNote =
    sms.encoding === "GSM-7" ? (
      <>
        GSM-7 encoding. Characters such as {"{ } [ ] ~ ^ | € \\"} use two of the 160 slots.
        {sms.segments > 1 ? ` Sent as ${sms.segments} parts of up to 153 characters each.` : ""}
      </>
    ) : (
      <>
        Contains characters outside the GSM-7 alphabet ({sms.nonGsmChars.join(" ")}), so the message is sent as UCS-2:
        70 characters fit in one SMS and each part of a longer message holds 67. Emoji count as 2.
        {sms.segments > 1 ? ` This message needs ${sms.segments} parts.` : ""}
      </>
    );

  const result = (
    <>
      <StatGrid
        columns={3}
        items={[
          { label: "Characters", value: formatNumber(s.characters), hint: "Emoji and accented letters count as 1" },
          { label: "Without spaces", value: formatNumber(s.charactersNoSpaces) },
          { label: "Letters", value: formatNumber(s.letters) },
          { label: "Digits", value: formatNumber(s.digits) },
          { label: "Spaces", value: formatNumber(s.spaces), hint: "Excludes line breaks" },
          { label: "Punctuation & symbols", value: formatNumber(s.punctuation), hint: "Includes emoji" },
          { label: "Lines", value: formatNumber(s.lines) },
          { label: "UTF-8 size", value: `${formatNumber(s.bytes)} bytes` },
        ]}
      />
      <div className="rounded-xl border border-border bg-surface px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Common limits</p>
        <ul className="mt-3 space-y-4">
          <LimitRow
            label="X (Twitter) post"
            used={xLength}
            limit={280}
            note="Weighted like X: links count as 23, emoji and CJK characters as 2."
          />
          <LimitRow
            label={sms.encoding === "GSM-7" ? "SMS, single segment (GSM-7)" : "SMS, single segment (UCS-2)"}
            used={sms.units}
            limit={sms.singleLimit}
            note={smsNote}
          />
          <LimitRow
            label="Meta title"
            used={s.characters}
            limit={60}
            note="About 60 characters; Google actually truncates by pixel width (around 580px)."
          />
          <LimitRow
            label="Meta description"
            used={s.characters}
            limit={160}
            note="Around 155–160 characters usually show in full on desktop results."
          />
          <LimitRow label="Instagram caption" used={s.characters} limit={2200} />
        </ul>
      </div>
    </>
  );

  return (
    <CalculatorShell title="Character counter" layout="stacked" result={result}>
      <TextareaField
        label="Your text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text to count characters, bytes and check common length limits."
        rows={8}
        className="min-h-52"
      />
      <div className="flex flex-wrap gap-2">
        <CopyButton text={text} label="Copy text" />
        <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={text === ""}>
          <Eraser />
          Clear
        </Button>
      </div>
    </CalculatorShell>
  );
}
