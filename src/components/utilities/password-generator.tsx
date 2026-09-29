"use client";

import { RefreshCw } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, ResultError } from "@/components/tools/result";
import { Button } from "@/components/ui/button";
import { CheckboxField, NumberField, RangeField } from "@/components/ui/field";
import {
  DEFAULT_PASSWORD_OPTIONS,
  PASSWORD_MAX,
  PASSWORD_MIN,
  entropyBits,
  generatePassword,
  poolSize,
  strengthLabel,
  type PasswordOptions,
  type PasswordResult,
  type StrengthLabel,
} from "@/lib/generators/password";
import { cn } from "@/lib/utils/cn";
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

const STRENGTH_STYLE: Record<StrengthLabel, { bar: string; text: string; level: number }> = {
  "Very weak": { bar: "bg-danger", text: "text-danger", level: 1 },
  Weak: { bar: "bg-danger", text: "text-danger", level: 2 },
  Fair: { bar: "bg-warning", text: "text-warning", level: 3 },
  Strong: { bar: "bg-success", text: "text-success", level: 4 },
  "Very strong": { bar: "bg-success", text: "text-success", level: 5 },
};

const TYPES = [
  { key: "upper", label: "Uppercase (A–Z)" },
  { key: "lower", label: "Lowercase (a–z)" },
  { key: "digits", label: "Numbers (0–9)" },
  { key: "symbols", label: "Symbols (!@#$%…)" },
] as const;

export default function PasswordGenerator() {
  const isClient = useIsClient();
  const [opts, setOpts] = useState<PasswordOptions>(DEFAULT_PASSWORD_OPTIONS);
  const [lengthText, setLengthText] = useState(String(DEFAULT_PASSWORD_OPTIONS.length));
  const [generated, setGenerated] = useState<PasswordResult | null>(null);
  const [bulk, setBulk] = useState<string[] | null>(null);

  // First password is created on the client only, after hydration.
  const initial = useMemo(() => (isClient ? generatePassword(DEFAULT_PASSWORD_OPTIONS) : null), [isClient]);
  const current = generated ?? initial;

  function update(next: PasswordOptions) {
    setOpts(next);
    setBulk(null);
    setGenerated(generatePassword(next));
  }

  function regenerate() {
    setGenerated(generatePassword(opts));
    setBulk(null);
  }

  function generateBulk() {
    const list: string[] = [];
    for (let i = 0; i < 5; i++) {
      const r = generatePassword(opts);
      if (r.ok) list.push(r.value);
    }
    setBulk(list.length ? list : null);
  }

  const parsedLength = parseNumber(lengthText, {
    label: "Length",
    integer: true,
    min: PASSWORD_MIN,
    max: PASSWORD_MAX,
  });

  function onLengthText(value: string) {
    setLengthText(value);
    const p = parseNumber(value, { integer: true, min: PASSWORD_MIN, max: PASSWORD_MAX });
    if (p.ok) update({ ...opts, length: p.value });
  }

  const pool = poolSize(opts);
  const bits = entropyBits(opts.length, pool);
  const label = strengthLabel(bits);
  const style = STRENGTH_STYLE[label];
  const noTypes = !opts.upper && !opts.lower && !opts.digits && !opts.symbols;

  let result: React.ReactNode;
  if (noTypes) {
    result = <ResultError>Select at least one character type (uppercase, lowercase, numbers or symbols).</ResultError>;
  } else if (!current) {
    result = (
      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="h-[6.5rem] animate-pulse rounded-xl border border-border bg-surface" />
        <div className="h-24 animate-pulse rounded-xl border border-border bg-surface" />
      </div>
    );
  } else if (!current.ok) {
    result = <ResultError>{current.error}</ResultError>;
  } else {
    result = (
      <>
        <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-sm font-medium text-muted" id="pw-label">
            Your password
          </p>
          <p
            aria-labelledby="pw-label"
            className="mt-2 min-h-10 font-mono text-2xl leading-snug font-semibold tracking-wide break-all text-foreground"
          >
            {current.value}
          </p>
        </div>
        <ResultActions>
          <CopyButton text={current.value} label="Copy password" variant="primary" />
          <Button variant="outline" size="sm" onClick={regenerate}>
            <RefreshCw />
            Regenerate
          </Button>
          <Button variant="ghost" size="sm" onClick={generateBulk}>
            Generate 5
          </Button>
        </ResultActions>
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
            <span className="font-medium text-foreground">
              Strength: <span className={cn("font-semibold", style.text)}>{label}</span>
            </span>
            <span className="tabular text-muted">≈ {formatNumber(bits, 0)} bits of entropy</span>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden="true">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className={cn("h-2 rounded-full", n <= style.level ? style.bar : "bg-surface-muted ring-1 ring-border")} />
            ))}
          </div>
          <p className="mt-2 text-xs text-subtle">
            {formatNumber(opts.length)} characters from a pool of {formatNumber(pool)}: {formatNumber(opts.length)} × log₂(
            {formatNumber(pool)}) ≈ {formatNumber(bits, 1)} bits.
          </p>
        </div>
        {bulk ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">5 more passwords</p>
              <CopyButton text={bulk.join("\n")} label="Copy all" />
            </div>
            <ul className="mt-2 space-y-1 font-mono text-sm break-all text-foreground">
              {bulk.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <CalculatorShell
      title="Password generator"
      result={result}
      privacyNote="Generated in your browser with crypto.getRandomValues. Passwords are never stored or sent anywhere."
    >
      <RangeField
        label="Length"
        valueLabel={`${opts.length} characters`}
        min={PASSWORD_MIN}
        max={PASSWORD_MAX}
        step={1}
        value={opts.length}
        onChange={(e) => {
          const n = Number(e.target.value);
          setLengthText(String(n));
          update({ ...opts, length: n });
        }}
      />
      <NumberField
        label="Exact length"
        inputMode="numeric"
        value={lengthText}
        onChange={(e) => onLengthText(e.target.value)}
        hint={`${PASSWORD_MIN}–${PASSWORD_MAX} characters`}
        error={!parsedLength.ok ? parsedLength.error : undefined}
      />
      <fieldset className="min-w-0">
        <legend className="mb-2 text-sm font-medium text-foreground">Include</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TYPES.map((t) => (
            <CheckboxField
              key={t.key}
              label={t.label}
              checked={opts[t.key]}
              onChange={(e) => update({ ...opts, [t.key]: e.target.checked })}
            />
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-3">
        <CheckboxField
          label="Exclude look-alike characters"
          description="Leaves out I, l, 1, O and 0, which are easy to confuse when reading or typing."
          checked={opts.excludeLookAlike}
          onChange={(e) => update({ ...opts, excludeLookAlike: e.target.checked })}
        />
        <CheckboxField
          label="Require at least one of each selected type"
          description="Many sign-up forms insist on this."
          checked={opts.requireEach}
          onChange={(e) => update({ ...opts, requireEach: e.target.checked })}
        />
      </div>
    </CalculatorShell>
  );
}
