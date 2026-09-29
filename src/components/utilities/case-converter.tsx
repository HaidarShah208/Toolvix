"use client";

import { ArrowUp, Eraser } from "lucide-react";
import { useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, ResultEmpty } from "@/components/tools/result";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/ui/field";
import { CASES, convertCase, type CaseId } from "@/lib/text/case";
import { cn } from "@/lib/utils/cn";

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CaseId>("title");

  const output = convertCase(text, mode);
  const active = CASES.find((c) => c.id === mode);

  const result =
    text === "" ? (
      <ResultEmpty>Enter some text, then pick a case to convert it.</ResultEmpty>
    ) : (
      <>
        <TextareaField
          label={`Result: ${active?.label ?? ""}`}
          value={output}
          readOnly
          rows={8}
          className="min-h-48"
          spellCheck={false}
        />
        <ResultActions>
          <CopyButton text={output} label="Copy result" />
          <Button variant="outline" size="sm" onClick={() => setText(output)} disabled={output === text}>
            <ArrowUp />
            Use as input
          </Button>
        </ResultActions>
      </>
    );

  return (
    <CalculatorShell title="Case converter" layout="stacked" result={result}>
      <TextareaField
        label="Text to convert"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text, for example: the quick brown fox jumps over the lazy dog"
        rows={6}
        className="min-h-40"
      />
      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-medium text-foreground">Convert to</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {CASES.map((c) => {
            const selected = c.id === mode;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setMode(c.id)}
                className={cn(
                  "min-w-0 rounded-xl border px-3 py-2 text-left break-words text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  selected
                    ? "border-primary bg-primary-soft text-primary-soft-foreground"
                    : "border-border-strong bg-surface text-foreground hover:bg-surface-muted",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={text === ""}>
          <Eraser />
          Clear
        </Button>
      </div>
    </CalculatorShell>
  );
}
