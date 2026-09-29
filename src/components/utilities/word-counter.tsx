"use client";

import { Eraser } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, StatGrid } from "@/components/tools/result";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/ui/field";
import { formatDuration, READING_WPM, SPEAKING_WPM, wordStats } from "@/lib/text/stats";
import { formatNumber } from "@/lib/utils/number";

export default function WordCounter() {
  const [text, setText] = useState("");
  // Stats trail typing slightly on very long texts so the textarea stays responsive.
  const deferred = useDeferredValue(text);
  const s = useMemo(() => wordStats(deferred), [deferred]);

  const summary = [
    `Words: ${formatNumber(s.words)}`,
    `Characters: ${formatNumber(s.characters)}`,
    `Characters (no spaces): ${formatNumber(s.charactersNoSpaces)}`,
    `Sentences: ${formatNumber(s.sentences)}`,
    `Paragraphs: ${formatNumber(s.paragraphs)}`,
    `Reading time: ${formatDuration(s.readingSeconds)}`,
    `Speaking time: ${formatDuration(s.speakingSeconds)}`,
  ].join("\n");

  const result = (
    <>
      <StatGrid
        columns={3}
        items={[
          { label: "Words", value: formatNumber(s.words) },
          { label: "Characters", value: formatNumber(s.characters) },
          { label: "Characters (no spaces)", value: formatNumber(s.charactersNoSpaces) },
          { label: "Sentences", value: formatNumber(s.sentences) },
          { label: "Paragraphs", value: formatNumber(s.paragraphs) },
          {
            label: "Average word length",
            value: `${formatNumber(s.averageWordLength, 1, 1)} chars`,
          },
          { label: "Reading time", value: formatDuration(s.readingSeconds), hint: `At ${READING_WPM} words per minute` },
          { label: "Speaking time", value: formatDuration(s.speakingSeconds), hint: `At ${SPEAKING_WPM} words per minute` },
        ]}
      />

      <div className="rounded-xl border border-border bg-surface px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Top keywords</p>
        {s.keywords.length === 0 ? (
          <p className="mt-1 text-sm text-muted">
            Words of three or more letters that appear at least twice will show here. Common words such as
            &ldquo;the&rdquo; and &ldquo;with&rdquo; are ignored.
          </p>
        ) : (
          <ol className="mt-2 space-y-2">
            {s.keywords.map((k, i) => (
              <li key={k.word} className="flex min-w-0 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 font-medium break-words text-foreground">
                    <span className="tabular mr-2 text-subtle">{i + 1}.</span>
                    {k.word}
                  </span>
                  <span className="tabular shrink-0 text-muted">
                    {formatNumber(k.count)}× · {formatNumber(k.density, 1, 1)}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.min(100, (k.count / s.keywords[0].count) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      <ResultActions>
        <CopyButton text={s.words > 0 ? summary : ""} label="Copy stats" />
      </ResultActions>
    </>
  );

  return (
    <CalculatorShell title="Word counter" layout="stacked" result={result}>
      <TextareaField
        label="Your text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here. The counts update as you type."
        rows={10}
        className="min-h-64"
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
