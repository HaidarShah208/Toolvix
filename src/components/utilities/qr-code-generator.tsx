"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultActions, ResultEmpty, ResultError } from "@/components/tools/result";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { CheckboxField, InputField, RangeField, SelectField, TextareaField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  BYTE_CAPACITY,
  buildPayload,
  checkColors,
  describeQrError,
  utf8Length,
  type ErrorLevel,
  type QrContentType,
  type QrFields,
  type WifiEncryption,
} from "@/lib/generators/qr";

const TYPES = [
  { value: "url", label: "URL" },
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "wifi", label: "Wi-Fi" },
] as const;

const TYPE_NAME: Record<QrContentType, string> = {
  url: "a web link",
  text: "text",
  email: "an email",
  phone: "a phone number",
  wifi: "Wi-Fi network",
};

const LEVELS = [
  { value: "L", label: "L · 7%" },
  { value: "M", label: "M · 15%" },
  { value: "Q", label: "Q · 25%" },
  { value: "H", label: "H · 30%" },
] as const;

const EMPTY_FIELDS: QrFields = {
  url: "",
  text: "",
  email: "",
  subject: "",
  body: "",
  phone: "",
  ssid: "",
  password: "",
  encryption: "WPA",
  hidden: false,
};

interface RenderRequest {
  payload: string;
  level: ErrorLevel;
  size: number;
  margin: number;
  fg: string;
  bg: string;
}

type Rendered = { key: string; png: string; svg: string } | { key: string; error: string };

type QrModule = typeof import("qrcode");

export default function QrCodeGenerator() {
  const fgId = useId();
  const bgId = useId();
  const [type, setType] = useState<QrContentType>("url");
  const [fields, setFields] = useState<QrFields>(EMPTY_FIELDS);
  const [size, setSize] = useState(512);
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [level, setLevel] = useState<ErrorLevel>("M");
  const [margin, setMargin] = useState(4);
  const [rendered, setRendered] = useState<Rendered | null>(null);

  const set = <K extends keyof QrFields>(key: K, value: QrFields[K]) => setFields((f) => ({ ...f, [key]: value }));

  const built = buildPayload(type, fields);
  const request: RenderRequest | null = built.ok ? { payload: built.payload, level, size, margin, fg, bg } : null;
  const key = request ? JSON.stringify(request) : "";

  useEffect(() => {
    if (!key) return;
    const req = JSON.parse(key) as RenderRequest;
    let canceled = false;
    const timer = setTimeout(async () => {
      try {
        const mod = (await import("qrcode")) as QrModule & { default?: QrModule };
        const QR = mod.default ?? mod;
        const options = {
          errorCorrectionLevel: req.level,
          margin: req.margin,
          width: req.size,
          color: { dark: req.fg, light: req.bg },
        };
        const png = await QR.toDataURL(req.payload, { ...options, type: "image/png" });
        const svg = await QR.toString(req.payload, { ...options, type: "svg" });
        if (!canceled) setRendered({ key, png, svg });
      } catch (err) {
        if (!canceled) setRendered({ key, error: describeQrError(err, req.level) });
      }
    }, 120);
    return () => {
      canceled = true;
      clearTimeout(timer);
    };
  }, [key]);

  const colors = checkColors(fg, bg);
  const errorFor = (field: keyof QrFields) =>
    !built.ok && built.field === field && !built.empty && String(fields[field]).trim() !== "" ? built.error : undefined;

  function reset() {
    setType("url");
    setFields(EMPTY_FIELDS);
    setSize(512);
    setFg("#000000");
    setBg("#ffffff");
    setLevel("M");
    setMargin(4);
  }

  let result: ReactNode;
  if (!built.ok) {
    result = built.empty ? (
      <ResultEmpty>Fill in the content to generate a QR code.</ResultEmpty>
    ) : (
      <ResultError>{built.error}</ResultError>
    );
  } else {
    const bytes = utf8Length(built.payload);
    // Keep showing the previous code while a new one renders, to avoid flicker.
    const current = rendered && (rendered.key === key || !("error" in rendered)) ? rendered : null;
    const warnings: ReactNode[] = [];
    if (colors?.inverted) {
      warnings.push(
        <Alert key="inv" tone="warning" title="Light code on a dark background">
          Some scanners only read dark modules on a light background. Test it with several phones or swap the colors.
        </Alert>,
      );
    }
    if (colors?.lowContrast) {
      warnings.push(
        <Alert key="low" tone="warning" title={`Low contrast (${colors.ratio.toFixed(2)}:1)`}>
          The foreground and background are too similar to scan reliably. Aim for at least 4:1, ideally a dark color on
          white.
        </Alert>,
      );
    }
    if (margin < 2) {
      warnings.push(
        <Alert key="margin" tone="info">
          A quiet zone under 2 modules can stop some readers finding the code. Keep a light border around it when printing.
        </Alert>,
      );
    }

    result = (
      <>
        {built.hint ? <Alert tone="info">{built.hint}</Alert> : null}
        {!current ? (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border-strong text-sm text-muted">
            Generating QR code…
          </div>
        ) : "error" in current ? (
          <ResultError>{current.error}</ResultError>
        ) : (
          <>
            <div className="flex justify-center rounded-xl border border-border bg-surface p-4">
              <Image
                src={current.png}
                alt={`QR code for ${TYPE_NAME[type]}`}
                width={size}
                height={size}
                unoptimized
                className="h-auto w-full max-w-64"
              />
            </div>
            <ResultActions>
              <a href={current.png} download={`qr-code-${type}.png`} className={buttonClasses("primary", "sm")}>
                <Download />
                Download PNG
              </a>
              <a
                href={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(current.svg)}`}
                download={`qr-code-${type}.svg`}
                className={buttonClasses("outline", "sm")}
              >
                <Download />
                Download SVG
              </a>
              <CopyButton text={built.payload} label="Copy encoded text" />
            </ResultActions>
          </>
        )}
        {warnings}
        <div className="rounded-xl border border-border bg-surface px-4 py-3">
          <p className="text-xs font-medium text-muted">Encoded content</p>
          <p className="mt-1 font-mono text-sm break-all text-foreground">{built.payload}</p>
          <p className="mt-2 text-xs text-subtle">
            {bytes.toLocaleString("en-US")} bytes · level {level} holds up to about{" "}
            {BYTE_CAPACITY[level].toLocaleString("en-US")} bytes
          </p>
        </div>
      </>
    );
  }

  return (
    <CalculatorShell
      title="QR code generator"
      onReset={reset}
      privacyNote="QR codes are generated in your browser. Nothing you enter is sent anywhere."
      toolbar={<Segmented label="Content type" options={TYPES} value={type} onChange={setType} size="sm" />}
      result={result}
    >
      {type === "url" ? (
        <InputField
          label="Website URL"
          type="url"
          inputMode="url"
          value={fields.url}
          onChange={(e) => set("url", e.target.value)}
          placeholder="https://example.com"
          autoComplete="off"
          spellCheck={false}
          error={errorFor("url")}
          hint="https:// is added if you leave it out."
        />
      ) : null}
      {type === "text" ? (
        <TextareaField
          label="Text"
          value={fields.text}
          onChange={(e) => set("text", e.target.value)}
          placeholder="Any text, up to a few hundred characters for easy scanning"
          className="min-h-28"
        />
      ) : null}
      {type === "email" ? (
        <>
          <InputField
            label="Email address"
            type="email"
            value={fields.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="name@example.com"
            autoComplete="off"
            error={errorFor("email")}
          />
          <InputField
            label="Subject (optional)"
            value={fields.subject}
            onChange={(e) => set("subject", e.target.value)}
          />
          <TextareaField
            label="Message (optional)"
            value={fields.body}
            onChange={(e) => set("body", e.target.value)}
            className="min-h-24"
          />
        </>
      ) : null}
      {type === "phone" ? (
        <InputField
          label="Phone number"
          type="tel"
          value={fields.phone}
          onChange={(e) => set("phone", e.target.value)}
          placeholder="+44 20 7946 0000"
          autoComplete="off"
          error={errorFor("phone")}
          hint="Include the country code so it works from anywhere. Spaces are removed."
        />
      ) : null}
      {type === "wifi" ? (
        <>
          <InputField
            label="Network name (SSID)"
            value={fields.ssid}
            onChange={(e) => set("ssid", e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="Security"
              options={[
                { value: "WPA", label: "WPA/WPA2/WPA3" },
                { value: "WEP", label: "WEP" },
                { value: "nopass", label: "None (open)" },
              ]}
              value={fields.encryption}
              onChange={(e) => set("encryption", e.target.value as WifiEncryption)}
            />
            {fields.encryption !== "nopass" ? (
              <InputField
                label="Password"
                type="text"
                value={fields.password}
                onChange={(e) => set("password", e.target.value)}
                autoComplete="off"
                spellCheck={false}
                error={errorFor("password")}
              />
            ) : null}
          </div>
          <CheckboxField
            label="Hidden network"
            checked={fields.hidden}
            onChange={(e) => set("hidden", e.target.checked)}
          />
        </>
      ) : null}

      <div className="flex flex-col gap-4 border-t border-border pt-4">
        <RangeField
          label="Size"
          valueLabel={`${size} px`}
          min={128}
          max={1024}
          step={32}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
        />
        <div className="grid grid-cols-2 gap-4">
          {[
            { id: fgId, label: "Foreground", value: fg, onChange: setFg },
            { id: bgId, label: "Background", value: bg, onChange: setBg },
          ].map((c) => (
            <div key={c.id} className="flex min-w-0 flex-col gap-1.5">
              <label htmlFor={c.id} className="text-sm font-medium text-foreground">
                {c.label}
              </label>
              <div className="flex items-center gap-2">
                <input
                  id={c.id}
                  type="color"
                  value={c.value}
                  onChange={(e) => c.onChange(e.target.value)}
                  className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-border-strong bg-surface p-1"
                />
                <span className="tabular min-w-0 truncate font-mono text-sm text-muted">{c.value}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">Error correction</p>
          <Segmented label="Error correction level" options={LEVELS} value={level} onChange={setLevel} size="sm" />
          <p className="text-xs text-subtle">
            Higher levels survive more damage or a logo overlay but hold less data and make denser codes.
          </p>
        </div>
        <RangeField
          label="Quiet zone (margin)"
          valueLabel={`${margin} module${margin === 1 ? "" : "s"}`}
          min={0}
          max={8}
          step={1}
          value={margin}
          onChange={(e) => setMargin(Number(e.target.value))}
        />
      </div>
    </CalculatorShell>
  );
}
