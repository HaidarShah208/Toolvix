"use client";

import { ArrowUpDown, Eraser } from "lucide-react";
import { useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, ResultEmpty } from "@/components/tools/result";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { reverseText, type ReverseMode } from "@/lib/text/reverse";

const MODES = [
  { value: "characters", label: "Reverse characters" },
  { value: "words", label: "Reverse word order" },
  { value: "each-word", label: "Reverse each word" },
  { value: "lines", label: "Reverse line order" },
] as const;

export default function TextReverser() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<ReverseMode>("characters");
  const output = reverseText(text, mode);

  const result =
    text === "" ? (
      <ResultEmpty>Type or paste text to see it reversed.</ResultEmpty>
    ) : (
      <>
        <TextareaField label="Reversed text" value={output} readOnly rows={8} className="min-h-48" spellCheck={false} />
        <ResultActions>
          <CopyButton text={output} label="Copy result" />
          <Button variant="outline" size="sm" onClick={() => setText(output)} disabled={output === text}>
            <ArrowUpDown />
            Swap
          </Button>
        </ResultActions>
      </>
    );

  return (
    <CalculatorShell
      title="Text reverser"
      layout="stacked"
      result={result}
      toolbar={<Segmented label="Reverse mode" options={MODES} value={mode} onChange={setMode} size="sm" />}
    >
      <TextareaField
        label="Text to reverse"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Hello world 👋"
        rows={6}
        className="min-h-40"
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={text === ""}>
          <Eraser />
          Clear
        </Button>
      </div>
    </CalculatorShell>
  );
}
