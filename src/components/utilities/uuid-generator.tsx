"use client";

import { Download } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions } from "@/components/tools/result";
import { Button } from "@/components/ui/button";
import { CheckboxField, NumberField, SelectField, TextareaField } from "@/components/ui/field";
import { formatUuid, generateUuids, uuidV4, uuidV7Timestamp, type UuidVersion } from "@/lib/generators/uuid";
import { downloadText } from "@/lib/text/download";
import { formatNumber, parseNumber } from "@/lib/utils/number";

const noopSubscribe = () => () => {};

/** False during server rendering and hydration, true afterwards. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

const VERSIONS = [
  { value: "v4", label: "Version 4 (random)" },
  { value: "v7", label: "Version 7 (time-ordered)" },
] as const;

const MAX_COUNT = 500;

interface Batch {
  version: UuidVersion;
  ids: string[];
}

export default function UuidGenerator() {
  const isClient = useIsClient();
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [countText, setCountText] = useState("1");
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [braces, setBraces] = useState(false);
  const [batch, setBatch] = useState<Batch | null>(null);

  // One random UUID is ready right after hydration; nothing random runs on the server.
  const initial = useMemo<Batch | null>(() => (isClient ? { version: "v4", ids: [uuidV4()] } : null), [isClient]);
  const current = batch ?? initial;

  const count = parseNumber(countText, { label: "How many", integer: true, min: 1, max: MAX_COUNT });

  function generate() {
    if (!count.ok) return;
    setBatch({ version, ids: generateUuids(version, count.value) });
  }

  function reset() {
    setVersion("v4");
    setCountText("1");
    setUppercase(false);
    setNoHyphens(false);
    setBraces(false);
    setBatch({ version: "v4", ids: [uuidV4()] });
  }

  const fmt = { uppercase, hyphens: !noHyphens, braces };
  const lines = current ? current.ids.map((id) => formatUuid(id, fmt)) : [];
  const output = lines.join("\n");

  let result: React.ReactNode;
  if (!current) {
    result = (
      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="h-40 animate-pulse rounded-xl border border-border bg-surface" />
        <div className="h-9 w-48 animate-pulse rounded-xl bg-surface" />
      </div>
    );
  } else {
    const ts = current.version === "v7" ? uuidV7Timestamp(current.ids[0]) : null;
    result = (
      <>
        <TextareaField
          label={`${formatNumber(lines.length)} UUID${lines.length === 1 ? "" : "s"} (${current.version === "v7" ? "version 7" : "version 4"})`}
          value={output}
          readOnly
          spellCheck={false}
          wrap="off"
          rows={Math.min(12, Math.max(3, lines.length))}
          className="min-h-0 font-mono text-sm whitespace-pre"
          hint={
            ts !== null
              ? `The first ID embeds the time ${new Date(ts).toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC")}.`
              : undefined
          }
        />
        <ResultActions>
          <CopyButton text={output} label={lines.length === 1 ? "Copy UUID" : "Copy all"} />
          <Button variant="outline" size="sm" onClick={() => downloadText("uuids.txt", `${output}\n`)}>
            <Download />
            Download .txt
          </Button>
        </ResultActions>
      </>
    );
  }

  return (
    <CalculatorShell
      title="UUID generator"
      result={result}
      onSubmit={generate}
      submitLabel="Generate"
      onReset={reset}
      privacyNote="Generated in your browser with the Web Crypto API. Nothing is sent to a server."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Version"
          options={VERSIONS}
          value={version}
          onChange={(e) => setVersion(e.target.value as UuidVersion)}
          hint={version === "v7" ? "Starts with a millisecond timestamp, so IDs sort by creation time." : "122 random bits."}
        />
        <NumberField
          label="How many"
          inputMode="numeric"
          value={countText}
          onChange={(e) => setCountText(e.target.value)}
          hint={`1–${MAX_COUNT}`}
          error={countText.trim() !== "" && !count.ok ? count.error : countText.trim() === "" ? "How many is required." : undefined}
        />
      </div>
      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-medium text-foreground">Format</legend>
        <div className="flex flex-col gap-3">
          <CheckboxField label="Uppercase" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
          <CheckboxField
            label="No hyphens"
            description="Outputs the compact 32-character form."
            checked={noHyphens}
            onChange={(e) => setNoHyphens(e.target.checked)}
          />
          <CheckboxField
            label="Wrap in braces"
            description="Registry/GUID style, e.g. {…}."
            checked={braces}
            onChange={(e) => setBraces(e.target.checked)}
          />
        </div>
      </fieldset>
    </CalculatorShell>
  );
}
