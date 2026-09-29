"use client";

import { Download, FileText } from "lucide-react";
import { useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, ResultEmpty, ResultError } from "@/components/tools/result";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField, SelectField, TextareaField } from "@/components/ui/field";
import { SAMPLE_JSON, stringifyJson, type Indent } from "@/lib/json/format";
import { errorSnippet, validateJson } from "@/lib/json/validate";
import { downloadText } from "@/lib/text/download";
import { utf8Bytes } from "@/lib/text/segment";
import { formatNumber } from "@/lib/utils/number";

type Action = "format" | "minify";

type Outcome =
  | { kind: "output"; action: Action; text: string; lossyNumbers: number }
  | { kind: "error"; message: string; line: number; column: number; source: string };

const INDENTS = [
  { value: "2", label: "2 spaces" },
  { value: "4", label: "4 spaces" },
  { value: "tab", label: "Tab" },
] as const;

function run(input: string, action: Action, indent: Indent, sortKeys: boolean): Outcome {
  const check = validateJson(input);
  if (!check.ok) {
    return { kind: "error", message: check.message, line: check.line, column: check.column, source: input };
  }
  let value: unknown;
  try {
    value = JSON.parse(input);
  } catch {
    return { kind: "error", message: "This JSON could not be parsed.", line: 1, column: 1, source: input };
  }
  const text = stringifyJson(value, { indent: action === "minify" ? null : indent, sortKeys });
  return { kind: "output", action, text, lossyNumbers: check.lossyNumbers };
}

function formatBytes(n: number): string {
  if (n < 1024) return `${formatNumber(n)} B`;
  if (n < 1024 * 1024) return `${formatNumber(n / 1024, 1)} KB`;
  return `${formatNumber(n / (1024 * 1024), 2)} MB`;
}

export function JsonErrorSnippet({ text, line, column }: { text: string; line: number; column: number }) {
  const s = errorSnippet(text, line, column);
  const gutter = String(line);
  return (
    <pre className="overflow-x-auto rounded-lg bg-surface p-3 font-mono text-xs leading-relaxed text-foreground ring-1 ring-border">
      <code>
        <span className="text-subtle select-none">{gutter} | </span>
        {s.truncatedStart ? "…" : ""}
        {s.before}
        <mark className="rounded-sm bg-danger-soft px-px font-bold text-danger underline decoration-wavy">{s.at}</mark>
        {s.after}
        {s.truncatedEnd ? "…" : ""}
        {"\n"}
        <span className="text-subtle select-none">{" ".repeat(gutter.length)} | </span>
        {" ".repeat(s.caretOffset + (s.truncatedStart ? 1 : 0))}
        <span className="font-bold text-danger">^</span>
      </code>
    </pre>
  );
}

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState<Indent>("2");
  const [sortKeys, setSortKeys] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  function act(action: Action, nextIndent = indent, nextSort = sortKeys) {
    if (input.trim() === "") {
      setOutcome(null);
      return;
    }
    setOutcome(run(input, action, nextIndent, nextSort));
  }

  function reset() {
    setInput("");
    setOutcome(null);
  }

  let result: React.ReactNode;
  if (!outcome) {
    result = (
      <ResultEmpty>
        {input.trim() === ""
          ? "Paste JSON (or load the sample), then choose Format or Minify."
          : "Choose Format to pretty-print or Minify to strip whitespace."}
      </ResultEmpty>
    );
  } else if (outcome.kind === "error") {
    result = (
      <>
        <ResultError>
          <p className="font-semibold">
            Invalid JSON at line {formatNumber(outcome.line)}, column {formatNumber(outcome.column)}
          </p>
          <p>{outcome.message}.</p>
        </ResultError>
        <JsonErrorSnippet text={outcome.source} line={outcome.line} column={outcome.column} />
      </>
    );
  } else {
    const inBytes = utf8Bytes(input);
    const outBytes = utf8Bytes(outcome.text);
    result = (
      <>
        {outcome.lossyNumbers > 0 ? (
          <Alert tone="warning">
            {formatNumber(outcome.lossyNumbers)} number{outcome.lossyNumbers === 1 ? " has" : "s have"} more digits than
            JavaScript can store exactly, so {outcome.lossyNumbers === 1 ? "it was" : "they were"} rounded in the output.
            Store very large IDs as strings to keep them intact.
          </Alert>
        ) : null}
        <TextareaField
          label={outcome.action === "minify" ? "Minified JSON" : "Formatted JSON"}
          value={outcome.text}
          readOnly
          spellCheck={false}
          rows={14}
          className="min-h-72 font-mono text-sm whitespace-pre"
          wrap="off"
          hint={`${formatBytes(inBytes)} → ${formatBytes(outBytes)}`}
        />
        <ResultActions>
          <CopyButton text={outcome.text} label="Copy JSON" />
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              downloadText(
                outcome.action === "minify" ? "data.min.json" : "data.json",
                outcome.text,
                "application/json;charset=utf-8",
              )
            }
          >
            <Download />
            Download .json
          </Button>
        </ResultActions>
      </>
    );
  }

  return (
    <CalculatorShell title="JSON formatter" layout="stacked" result={result} onReset={reset}>
      <TextareaField
        label="JSON input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          if (outcome?.kind === "error") setOutcome(null);
        }}
        placeholder='{"name": "Toolora", "tools": 40}'
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        rows={12}
        wrap="off"
        className="min-h-64 font-mono text-sm whitespace-pre"
      />
      <div className="grid items-end gap-4 sm:grid-cols-2">
        <SelectField
          label="Indentation"
          options={INDENTS}
          value={indent}
          onChange={(e) => {
            const next = e.target.value as Indent;
            setIndent(next);
            if (outcome?.kind === "output" && outcome.action === "format") act("format", next, sortKeys);
          }}
        />
        <CheckboxField
          label="Sort keys alphabetically"
          className="pb-3"
          checked={sortKeys}
          onChange={(e) => {
            setSortKeys(e.target.checked);
            if (outcome?.kind === "output") act(outcome.action, indent, e.target.checked);
          }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => act("format")} disabled={input.trim() === ""}>
          Format
        </Button>
        <Button variant="outline" onClick={() => act("minify")} disabled={input.trim() === ""}>
          Minify
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setInput(SAMPLE_JSON);
            setOutcome(null);
          }}
        >
          <FileText />
          Load sample
        </Button>
      </div>
    </CalculatorShell>
  );
}
