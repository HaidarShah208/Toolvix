"use client";

import { Download } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { CalculatorShell } from "@/components/tools/calculator-shell";
import { Badge, ResultActions, ResultEmpty, ResultError, StatGrid } from "@/components/tools/result";
import { Alert } from "@/components/ui/alert";
import { buttonClasses } from "@/components/ui/button";
import { CheckboxField, NumberField, RangeField } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import {
  MAX_DIMENSION,
  MIME_LABEL,
  fitWithin,
  formatBytes,
  outputFileName,
  resizeAndEncode,
  type OutputMime,
} from "@/lib/image/process";
import { formatPercent, parseNumber } from "@/lib/utils/number";
import { ImageDropzone, useBlobUrl, useLoadedImage } from "./image-dropzone";

const FORMATS = [
  { value: "image/jpeg", label: "JPEG" },
  { value: "image/webp", label: "WebP" },
  { value: "image/png", label: "PNG" },
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

export default function ImageCompressor() {
  const { image, error: loadError, loading, load, clear } = useLoadedImage();
  const [blob, setBlob] = useBlobUrl();
  const [format, setFormat] = useState<OutputMime>("image/jpeg");
  const [quality, setQuality] = useState(75);
  const [limit, setLimit] = useState(false);
  const [maxSide, setMaxSide] = useState("1920");
  const [output, setOutput] = useState<Output | null>(null);
  const [busy, setBusy] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  async function onFile(file: File) {
    const img = await load(file);
    if (img) {
      setOutput(null);
      setBlob(null);
      setProcessError(null);
    }
  }

  const parsedMax = parseNumber(maxSide, { label: "Max width/height", integer: true, min: 16, max: MAX_DIMENSION });
  const maxError = limit && maxSide.trim() !== "" && !parsedMax.ok ? parsedMax.error : undefined;
  const lossy = format !== "image/png";

  let target: { width: number; height: number } | null = null;
  if (image) {
    if (!limit) target = { width: image.width, height: image.height };
    else if (parsedMax.ok) target = fitWithin(image.width, image.height, parsedMax.value, parsedMax.value);
  }
  const oversize = target ? target.width * target.height > 50_000_000 || target.width > MAX_DIMENSION || target.height > MAX_DIMENSION : false;
  const settingsKey = image && target ? `${image.url}|${target.width}x${target.height}|${format}|${lossy ? quality : ""}` : "";

  async function compress() {
    if (!image) {
      setProcessError("Choose an image first.");
      return;
    }
    if (!target || busy) return;
    if (oversize) {
      setProcessError("This image is larger than 10,000 px or 50 megapixels. Turn on “Limit size” to shrink it first.");
      return;
    }
    setBusy(true);
    setProcessError(null);
    try {
      const res = await resizeAndEncode(image.decoded, {
        width: target.width,
        height: target.height,
        type: format,
        quality: quality / 100,
      });
      setBlob(res.blob);
      setOutput({
        key: settingsKey,
        width: res.width,
        height: res.height,
        requested: format,
        type: res.type,
        fileName: outputFileName(image.file.name, res.width, res.height, res.type, "compressed"),
        filledWhite: format === "image/jpeg" && image.transparent,
      });
    } catch (e) {
      setProcessError(e instanceof Error ? e.message : "The image could not be compressed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    clear();
    setBlob(null);
    setOutput(null);
    setFormat("image/jpeg");
    setQuality(75);
    setLimit(false);
    setMaxSide("1920");
    setProcessError(null);
  }

  let result: ReactNode;
  if (!image) {
    result = <ResultEmpty>Choose an image, pick a format and quality, then press “Compress image”.</ResultEmpty>;
  } else {
    const originalFigure = (
      <figure className="flex min-w-0 flex-col gap-2">
        <figcaption className="text-sm font-semibold text-foreground">Original</figcaption>
        <div className="flex justify-center rounded-xl border border-border bg-surface p-2">
          <Image
            src={image.url}
            alt={`Original image: ${image.file.name}`}
            width={image.width}
            height={image.height}
            unoptimized
            className="h-auto max-h-48 w-auto max-w-full object-contain"
          />
        </div>
        <p className="text-xs text-muted">
          {image.width} × {image.height} px · {formatBytes(image.file.size)}
        </p>
      </figure>
    );

    if (processError) {
      result = (
        <>
          {originalFigure}
          <ResultError>{processError}</ResultError>
        </>
      );
    } else if (output && blob) {
      const before = image.file.size;
      const after = blob.blob.size;
      const saved = before > 0 ? ((before - after) / before) * 100 : 0;
      const larger = after >= before;
      const stale = output.key !== settingsKey;
      result = (
        <>
          {stale ? (
            <Alert tone="info">Settings changed since this was made. Press “Compress image” to update it.</Alert>
          ) : null}
          <div className="grid gap-3 min-[480px]:grid-cols-2">
            {originalFigure}
            <figure className="flex min-w-0 flex-col gap-2">
              <figcaption className="text-sm font-semibold text-foreground">Compressed</figcaption>
              <div className="flex justify-center rounded-xl border border-border bg-surface p-2">
                <Image
                  src={blob.url}
                  alt={`Compressed image, ${output.width} by ${output.height} pixels`}
                  width={output.width}
                  height={output.height}
                  unoptimized
                  className="h-auto max-h-48 w-auto max-w-full object-contain"
                />
              </div>
              <p className="text-xs text-muted">
                {output.width} × {output.height} px · {formatBytes(after)}
              </p>
            </figure>
          </div>
          <StatGrid
            columns={3}
            items={[
              { label: "Original size", value: formatBytes(before) },
              { label: "Compressed size", value: formatBytes(after), hint: MIME_LABEL[output.type] ?? output.type },
              {
                label: larger ? "Size change" : "Saved",
                value: larger ? `+${formatPercent(-saved, 1)}` : formatPercent(saved, 1),
                hint: larger ? "Larger than the original" : `${formatBytes(before - after)} smaller`,
              },
            ]}
          />
          {larger ? (
            <Alert tone="warning" title="The result is not smaller">
              This setting produced a file {after === before ? "the same size as" : "larger than"} the original, so keep
              the original. Try a lower quality, JPEG or WebP, or limit the dimensions.
            </Alert>
          ) : (
            <Badge tone="success">{formatPercent(saved, 1)} smaller</Badge>
          )}
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
              Download compressed image
            </a>
          </ResultActions>
        </>
      );
    } else {
      result = (
        <>
          {originalFigure}
          <p className="text-sm text-muted">
            {target
              ? `Output will be ${target.width} × ${target.height} px as ${MIME_LABEL[format]}. Press “Compress image”.`
              : "Enter a valid maximum width/height."}
          </p>
        </>
      );
    }
  }

  return (
    <CalculatorShell
      title="Image compressor"
      onSubmit={compress}
      submitLabel={busy ? "Compressing…" : "Compress image"}
      onReset={reset}
      privacyNote="Compression happens entirely in your browser. Your images are never uploaded."
      result={result}
    >
      <ImageDropzone onFile={onFile} fileName={image?.file.name} loading={loading} />
      {loadError ? <ResultError>{loadError}</ResultError> : null}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-foreground">Output format</p>
        <Segmented label="Output format" options={FORMATS} value={format} onChange={setFormat} />
        {format === "image/png" ? (
          <p className="text-xs text-subtle">
            PNG is lossless, so quality does not apply. Savings come from reducing the dimensions below.
          </p>
        ) : null}
        {format === "image/jpeg" && image?.transparent ? (
          <p className="text-xs text-subtle">This image has transparency; JPEG will use a white background. Choose WebP or PNG to keep it.</p>
        ) : null}
      </div>

      {lossy ? (
        <RangeField
          label="Quality"
          valueLabel={`${quality}`}
          min={10}
          max={100}
          step={1}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
      ) : null}

      <CheckboxField
        label="Limit size"
        description="Shrink the image so neither side exceeds a maximum. Smaller images are never enlarged."
        checked={limit}
        onChange={(e) => setLimit(e.target.checked)}
      />
      {limit ? (
        <NumberField
          label="Max width/height"
          inputMode="numeric"
          suffix="px"
          value={maxSide}
          onChange={(e) => setMaxSide(e.target.value)}
          placeholder="1920"
          error={maxError}
        />
      ) : null}
    </CalculatorShell>
  );
}
