"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { ResultActions, ResultEmpty, ResultError, StatGrid } from "@/components/tools/result";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { CheckboxField, NumberField, RangeField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  MAX_DIMENSION,
  MIME_LABEL,
  formatBytes,
  outputFileName,
  resizeAndEncode,
  sameFormatMime,
  validateDimensions,
  type OutputMime,
} from "@/lib/image/process";
import { parseNumber } from "@/lib/utils/number";
import { ImageDropzone, useBlobUrl, useLoadedImage } from "./image-dropzone";

type Mode = "pixels" | "percent";
type Format = "same" | OutputMime;

const FORMATS = [
  { value: "same", label: "Same as original" },
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/png", label: "PNG" },
  { value: "image/webp", label: "WebP" },
] as const;

interface Output {
  key: string;
  width: number;
  height: number;
  requested: OutputMime;
  type: string;
  fileName: string;
  filledWhite: boolean;
}

export default function ImageResizer() {
  const { image, error: loadError, loading, load, clear } = useLoadedImage();
  const [blob, setBlob] = useBlobUrl();
  const [mode, setMode] = useState<Mode>("pixels");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [keepAspect, setKeepAspect] = useState(true);
  const [percent, setPercent] = useState("50");
  const [format, setFormat] = useState<Format>("same");
  const [quality, setQuality] = useState(90);
  const [output, setOutput] = useState<Output | null>(null);
  const [busy, setBusy] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  async function onFile(file: File) {
    const img = await load(file);
    if (img) {
      setWidth(String(img.width));
      setHeight(String(img.height));
      setOutput(null);
      setBlob(null);
      setProcessError(null);
    }
  }

  function onWidth(v: string) {
    setWidth(v);
    if (keepAspect && image) {
      const p = parseNumber(v, { integer: true, min: 1 });
      if (p.ok) setHeight(String(Math.max(1, Math.round((p.value * image.height) / image.width))));
    }
  }

  function onHeight(v: string) {
    setHeight(v);
    if (keepAspect && image) {
      const p = parseNumber(v, { integer: true, min: 1 });
      if (p.ok) setWidth(String(Math.max(1, Math.round((p.value * image.width) / image.height))));
    }
  }

  function toggleAspect(checked: boolean) {
    setKeepAspect(checked);
    if (checked && image) {
      const p = parseNumber(width, { integer: true, min: 1 });
      if (p.ok) setHeight(String(Math.max(1, Math.round((p.value * image.height) / image.width))));
    }
  }

  // Target dimensions derived from the inputs.
  let target: { width: number; height: number } | null = null;
  let widthError: string | undefined;
  let heightError: string | undefined;
  let percentError: string | undefined;
  if (image) {
    if (mode === "pixels") {
      const pw = parseNumber(width, { label: "Width", integer: true, min: 1, max: MAX_DIMENSION });
      const ph = parseNumber(height, { label: "Height", integer: true, min: 1, max: MAX_DIMENSION });
      if (!pw.ok) widthError = pw.error;
      if (!ph.ok) heightError = ph.error;
      if (pw.ok && ph.ok) target = { width: pw.value, height: ph.value };
    } else {
      const pp = parseNumber(percent, { label: "Percentage", min: 1, max: 500 });
      if (!pp.ok) percentError = pp.error;
      else
        target = {
          width: Math.max(1, Math.round((image.width * pp.value) / 100)),
          height: Math.max(1, Math.round((image.height * pp.value) / 100)),
        };
    }
  }
  const dimError = target ? validateDimensions(target.width, target.height) : null;
  const mime: OutputMime = format === "same" ? sameFormatMime(image?.file.type ?? "image/png") : format;
  const lossy = mime !== "image/png";
  const settingsKey = image && target ? `${image.url}|${target.width}x${target.height}|${mime}|${lossy ? quality : ""}` : "";

  async function resize() {
    if (!image || !target || dimError || busy) {
      if (!image) setProcessError("Choose an image first.");
      return;
    }
    setBusy(true);
    setProcessError(null);
    try {
      const res = await resizeAndEncode(image.decoded, {
        width: target.width,
        height: target.height,
        type: mime,
        quality: quality / 100,
      });
      setBlob(res.blob);
      setOutput({
        key: settingsKey,
        width: res.width,
        height: res.height,
        requested: mime,
        type: res.type,
        fileName: outputFileName(image.file.name, res.width, res.height, res.type),
        filledWhite: mime === "image/jpeg" && image.transparent,
      });
    } catch (e) {
      setProcessError(e instanceof Error ? e.message : "The image could not be resized.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    clear();
    setBlob(null);
    setOutput(null);
    setMode("pixels");
    setWidth("");
    setHeight("");
    setKeepAspect(true);
    setPercent("50");
    setFormat("same");
    setQuality(90);
    setProcessError(null);
  }

  let result: ReactNode;
  if (!image) {
    result = <ResultEmpty>Choose an image to see its size and resize it.</ResultEmpty>;
  } else {
    const original = (
      <figure className="flex flex-col gap-2">
        <figcaption className="text-sm font-semibold text-foreground">Original</figcaption>
        <div className="flex justify-center rounded-xl border border-border bg-surface p-2">
          <Image
            src={image.url}
            alt={`Original image: ${image.file.name}`}
            width={image.width}
            height={image.height}
            unoptimized
            className="h-auto max-h-56 w-auto max-w-full object-contain"
          />
        </div>
        <p className="text-xs text-muted">
          {image.width} × {image.height} px · {formatBytes(image.file.size)} · {MIME_LABEL[image.file.type] ?? "Image"}
        </p>
      </figure>
    );

    let out: ReactNode = null;
    if (processError) {
      out = <ResultError>{processError}</ResultError>;
    } else if (output && blob) {
      const stale = output.key !== settingsKey;
      out = (
        <>
          {stale ? (
            <Alert tone="info">Settings changed since this was made. Press “Resize image” to update it.</Alert>
          ) : null}
          <figure className="flex flex-col gap-2">
            <figcaption className="text-sm font-semibold text-foreground">Resized</figcaption>
            <div className="flex justify-center rounded-xl border border-border bg-surface p-2">
              <Image
                src={blob.url}
                alt={`Resized image, ${output.width} by ${output.height} pixels`}
                width={output.width}
                height={output.height}
                unoptimized
                className="h-auto max-h-56 w-auto max-w-full object-contain"
              />
            </div>
          </figure>
          <StatGrid
            columns={3}
            items={[
              { label: "New dimensions", value: `${output.width} × ${output.height}`, hint: "pixels" },
              {
                label: "New file size",
                value: formatBytes(blob.blob.size),
                hint: `Original ${formatBytes(image.file.size)}`,
              },
              { label: "Format", value: MIME_LABEL[output.type] ?? output.type },
            ]}
          />
          {output.filledWhite ? (
            <Alert tone="info">JPEG has no transparency, so transparent areas were filled with white.</Alert>
          ) : null}
          {output.type !== output.requested ? (
            <Alert tone="warning">
              Your browser cannot save {MIME_LABEL[output.requested]}, so the image was saved as{" "}
              {MIME_LABEL[output.type] ?? output.type} instead.
            </Alert>
          ) : null}
          <ResultActions>
            <a href={blob.url} download={output.fileName} className={buttonClasses("primary", "md")}>
              <Download />
              Download {output.fileName}
            </a>
          </ResultActions>
        </>
      );
    } else if (target && !dimError) {
      out = (
        <p className="text-sm text-muted">
          Output will be {target.width} × {target.height} px as {MIME_LABEL[mime]}. Press “Resize image”.
        </p>
      );
    }
    result = (
      <>
        {original}
        {out}
      </>
    );
  }

  return (
    <CalculatorShell
      title="Image resizer"
      onSubmit={resize}
      submitLabel={busy ? "Resizing…" : "Resize image"}
      onReset={reset}
      privacyNote="Images are processed in your browser and never uploaded."
      result={result}
    >
      <ImageDropzone onFile={onFile} fileName={image?.file.name} loading={loading} />
      {loadError ? <ResultError>{loadError}</ResultError> : null}

      <Segmented
        label="Resize by"
        options={[
          { value: "pixels", label: "Pixels" },
          { value: "percent", label: "Percentage" },
        ]}
        value={mode}
        onChange={setMode}
      />

      {mode === "pixels" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberField
              label="Width"
              inputMode="numeric"
              suffix="px"
              value={width}
              onChange={(e) => onWidth(e.target.value)}
              placeholder={image ? String(image.width) : "800"}
              disabled={!image}
              error={image && width.trim() !== "" ? widthError : undefined}
            />
            <NumberField
              label="Height"
              inputMode="numeric"
              suffix="px"
              value={height}
              onChange={(e) => onHeight(e.target.value)}
              placeholder={image ? String(image.height) : "600"}
              disabled={!image}
              error={image && height.trim() !== "" ? heightError : undefined}
            />
          </div>
          <CheckboxField
            label="Keep aspect ratio"
            description="Changing one side updates the other to match the original shape."
            checked={keepAspect}
            onChange={(e) => toggleAspect(e.target.checked)}
          />
        </>
      ) : (
        <NumberField
          label="Scale"
          suffix="%"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          placeholder="50"
          hint="1% to 500% of the original size."
          disabled={!image}
          error={percent.trim() !== "" ? percentError : undefined}
        />
      )}

      {image && dimError ? <ResultError>{dimError}</ResultError> : null}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">
          Output format
        </p>
        <Segmented label="Output format" options={FORMATS} value={format} onChange={setFormat} size="sm" />
        {format === "same" && image && sameFormatMime(image.file.type) !== image.file.type ? (
          <p className="text-xs text-subtle">
            Browsers cannot save {MIME_LABEL[image.file.type] ?? "this format"}, so PNG will be used
            {image.file.type === "image/gif" ? " (only the first frame of an animated GIF is kept)" : ""}.
          </p>
        ) : null}
        {mime === "image/jpeg" && image?.transparent ? (
          <p className="text-xs text-subtle">This image has transparency; JPEG output will use a white background.</p>
        ) : null}
      </div>

      {lossy ? (
        <RangeField
          label="Quality"
          valueLabel={`${quality}%`}
          min={10}
          max={100}
          step={1}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
      ) : null}
    </CalculatorShell>
  );
}
