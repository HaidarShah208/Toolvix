"use client";

import { ArrowUp, Eraser } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, ResultEmpty, StatGrid } from "@/components/tools/result";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextareaField } from "@/components/ui/field";
import { cleanText, DEFAULT_CLEAN_OPTIONS, TAB_WIDTH, type CleanOptions } from "@/lib/text/clean";
import { formatNumber } from "@/lib/utils/number";

const OPTIONS: { key: keyof CleanOptions; label: string; description?: string }[] = [
  { key: "trimLines", label: "Trim each line", description: "Removes spaces at the start and end of lines." },
  { key: "collapseSpaces", label: "Collapse repeated spaces", description: "Turns runs of spaces into one." },
  { key: "collapseBlankLines", label: "Collapse multiple blank lines into one" },
  { key: "removeBlankLines", label: "Remove all blank lines" },
  { key: "removeLineBreaks", label: "Remove line breaks", description: "Joins everything into one line with spaces." },
  { key: "removeDuplicateLines", label: "Remove duplicate lines", description: "Keeps the first occurrence." },
  {
    key: "stripHtml",
    label: "Strip HTML tags",
    description: "Also decodes entities such as &amp; and &nbsp;. The HTML is never rendered.",
  },
  {
    key: "plainPunctuation",
    label: "Convert smart quotes and dashes",
    description: "“ ” ‘ ’ – — … become \" ' - and ...",
  },
  {
    key: "removeInvisible",
    label: "Remove invisible characters",
    description: "Zero-width spaces and joiners, soft hyphens, byte order marks.",
  },
  { key: "tabsToSpaces", label: "Convert tabs to spaces", description: `Each tab becomes ${TAB_WIDTH} spaces.` },
  { key: "removeEmoji", label: "Remove emoji" },
];

export default function TextCleaner() {
  const [text, setText] = useState("");
  const [opts, setOpts] = useState<CleanOptions>(DEFAULT_CLEAN_OPTIONS);
  const deferred = useDeferredValue(text);
  const r = useMemo(() => cleanText(deferred, opts), [deferred, opts]);

  function reset() {
    setText("");
    setOpts(DEFAULT_CLEAN_OPTIONS);
  }

  const linesRemoved = Math.max(0, r.linesBefore - r.linesAfter);
  const result =
    text === "" ? (
      <ResultEmpty>Paste text to clean it. The result updates as you change the options.</ResultEmpty>
    ) : (
      <>
        <TextareaField label="Cleaned text" value={r.text} readOnly rows={10} className="min-h-56" spellCheck={false} />
        <ResultActions>
          <CopyButton text={r.text} label="Copy cleaned text" />
          <Button variant="outline" size="sm" onClick={() => setText(r.text)} disabled={r.text === text}>
            <ArrowUp />
            Use as input
          </Button>
        </ResultActions>
        <StatGrid
          columns={3}
          items={[
            { label: "Characters before", value: formatNumber(r.charsBefore) },
            {
              label: "Characters after",
              value: formatNumber(r.charsAfter),
              hint:
                r.charsBefore > r.charsAfter
                  ? `${formatNumber(r.charsBefore - r.charsAfter)} removed`
                  : r.charsAfter > r.charsBefore
                    ? `${formatNumber(r.charsAfter - r.charsBefore)} added`
                    : "No change",
            },
            {
              label: "Lines removed",
              value: formatNumber(linesRemoved),
              hint: `${formatNumber(r.linesBefore)} → ${formatNumber(r.linesAfter)} lines`,
            },
          ]}
        />
      </>
    );

  return (
    <CalculatorShell title="Text cleaner" layout="stacked" result={result} onReset={reset}>
      <TextareaField
        label="Text to clean"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste messy text: copied web pages, PDFs, spreadsheets or emails."
        rows={8}
        className="min-h-48"
      />
      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-medium text-foreground">Cleaning options</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {OPTIONS.map((o) => (
            <CheckboxField
              key={o.key}
              label={o.label}
              description={o.description}
              checked={opts[o.key]}
              onChange={(e) => setOpts({ ...opts, [o.key]: e.target.checked })}
            />
          ))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={text === ""}>
          <Eraser />
          Clear text
        </Button>
      </div>
    </CalculatorShell>
  );
}
