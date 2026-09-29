"use client";

import { Eraser } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { ResultEmpty, ResultError, StatGrid } from "@/components/tools/result";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TextareaField } from "@/components/ui/field";
import { summarizeJson, type JsonSummary } from "@/lib/json/format";
import { validateJson } from "@/lib/json/validate";
import { formatNumber } from "@/lib/utils/number";
import { JsonErrorSnippet } from "./json-formatter";

type Check =
  | { kind: "empty" }
  | { kind: "valid"; summary: JsonSummary; lossyNumbers: number }
  | { kind: "invalid"; message: string; line: number; column: number };

function check(text: string): Check {
  if (text.trim() === "") return { kind: "empty" };
  const v = validateJson(text);
  if (!v.ok) return { kind: "invalid", message: v.message, line: v.line, column: v.column };
  try {
    return { kind: "valid", summary: summarizeJson(JSON.parse(text), text), lossyNumbers: v.lossyNumbers };
  } catch {
    return { kind: "invalid", message: "This JSON could not be parsed", line: 1, column: 1 };
  }
}

function plural(n: number, one: string, many: string) {
  return `${formatNumber(n)} ${n === 1 ? one : many}`;
}

function formatBytes(n: number): string {
  if (n < 1024) return plural(n, "byte", "bytes");
  if (n < 1024 * 1024) return `${formatNumber(n / 1024, 1)} KB`;
  return `${formatNumber(n / (1024 * 1024), 2)} MB`;
}

export default function JsonValidator() {
  const [text, setText] = useState("");
  // Validation follows typing without blocking it on large documents.
  const deferred = useDeferredValue(text);
  const res = useMemo(() => check(deferred), [deferred]);

  let result: React.ReactNode;
  if (res.kind === "empty") {
    result = <ResultEmpty>Paste or type JSON to check it. Results update as you type.</ResultEmpty>;
  } else if (res.kind === "invalid") {
    result = (
      <>
        <ResultError>
          <p className="font-semibold">
            Invalid JSON at line {formatNumber(res.line)}, column {formatNumber(res.column)}
          </p>
          <p>{res.message}.</p>
        </ResultError>
        <JsonErrorSnippet text={deferred} line={res.line} column={res.column} />
      </>
    );
  } else {
    const s = res.summary;
    const rootLabel =
      s.rootType === "object"
        ? plural(s.rootSize, "key", "keys")
        : s.rootType === "array"
          ? plural(s.rootSize, "item", "items")
          : "single value";
    result = (
      <>
        <Alert tone="success" title="Valid JSON" live>
          {s.rootType === "array" || s.rootType === "object"
            ? `The root is an ${s.rootType} with ${rootLabel}.`
            : `The root is a single ${s.rootType} value.`}
        </Alert>
        {res.lossyNumbers > 0 ? (
          <Alert tone="warning">
            {plural(res.lossyNumbers, "number is", "numbers are")} too precise for JavaScript and would be rounded when
            parsed (for example large IDs). Consider storing them as strings.
          </Alert>
        ) : null}
        <StatGrid
          columns={3}
          items={[
            { label: "Root type", value: s.rootType, hint: rootLabel },
            { label: "Objects", value: formatNumber(s.objects) },
            { label: "Arrays", value: formatNumber(s.arrays) },
            { label: "Strings", value: formatNumber(s.strings) },
            { label: "Numbers", value: formatNumber(s.numbers) },
            { label: "Booleans", value: formatNumber(s.booleans) },
            { label: "Nulls", value: formatNumber(s.nulls) },
            { label: "Max depth", value: formatNumber(s.maxDepth) },
            { label: "Size", value: formatBytes(s.bytes), hint: "UTF-8" },
          ]}
        />
      </>
    );
  }

  return (
    <CalculatorShell title="JSON validator" layout="stacked" result={result}>
      <TextareaField
        label="JSON to validate"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='{"valid": true, "items": [1, 2, 3]}'
        spellCheck={false}
        autoComplete="off"
        autoCapitalize="off"
        rows={12}
        wrap="off"
        className="min-h-64 font-mono text-sm whitespace-pre"
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
