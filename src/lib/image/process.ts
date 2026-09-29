/**
 * Browser-only image helpers shared by the image resizer and compressor.
 * Everything runs locally with <canvas>; nothing is uploaded.
 */

export const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/bmp"] as const;
export const ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_TYPES.join(",");
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
export const MAX_DIMENSION = 10_000;
export const MAX_PIXELS = 50_000_000;

export type OutputMime = "image/jpeg" | "image/png" | "image/webp";

export const MIME_EXTENSION: Record<OutputMime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const MIME_LABEL: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/gif": "GIF",
  "image/bmp": "BMP",
};

/** Returns a friendly error, or null when the file is acceptable. */
export function validateImageFile(file: File): string | null {
  const type = file.type.toLowerCase();
  const byExt = /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name);
  if (type && !type.startsWith("image/")) {
    return `“${file.name}” is not an image. Choose a PNG, JPEG, WebP, GIF or BMP file.`;
  }
  if (!(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(type) && !(type === "" && byExt)) {
    return `This format (${type || "unknown"}) is not supported. Choose a PNG, JPEG, WebP, GIF or BMP file.`;
  }
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_FILE_BYTES) {
    return `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(MAX_FILE_BYTES)}.`;
  }
  return null;
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${units[i]}`;
}

export interface DecodedImage {
  source: CanvasImageSource;
  width: number;
  height: number;
  /** Frees decoder memory. */
  close: () => void;
}

/** Decodes a file into something drawable, preferring createImageBitmap. */
export async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
    } catch {
      // Fall back to <img>, which some browsers handle better (e.g. certain BMPs).
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      close: () => undefined,
    };
  } catch {
    throw new Error("This image could not be read. It may be corrupted or in an unsupported format.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  return c;
}

function context(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create an image canvas.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return ctx;
}

/** Checks a small copy of the image for any non-opaque pixel. */
export function hasTransparency(img: DecodedImage): boolean {
  try {
    const scale = Math.min(1, 256 / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const c = makeCanvas(w, h);
    const ctx = context(c);
    ctx.drawImage(img.source, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 255) return true;
    return false;
  } catch {
    return false;
  }
}

export function validateDimensions(width: number, height: number): string | null {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    return "Width and height must be whole numbers of at least 1 pixel.";
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return `The output can be at most ${MAX_DIMENSION.toLocaleString("en-US")} × ${MAX_DIMENSION.toLocaleString("en-US")} pixels.`;
  }
  if (width * height > MAX_PIXELS) {
    return `The output would be ${((width * height) / 1e6).toFixed(1)} megapixels. The limit is 50 megapixels.`;
  }
  return null;
}

/** Scales (w, h) down to fit inside a box, never upscaling. */
export function fitWithin(width: number, height: number, maxW: number, maxH: number) {
  const scale = Math.min(1, maxW / width, maxH / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/**
 * Draws the image at the target size. Large downscales are done in halving
 * steps so detail is averaged instead of skipped.
 */
export function renderResized(
  img: DecodedImage,
  width: number,
  height: number,
  background?: string,
): HTMLCanvasElement {
  let src: CanvasImageSource = img.source;
  let sw = img.width;
  let sh = img.height;
  while (sw / 2 >= width && sh / 2 >= height && sw > 1 && sh > 1) {
    const nw = Math.max(width, Math.floor(sw / 2));
    const nh = Math.max(height, Math.floor(sh / 2));
    const step = makeCanvas(nw, nh);
    context(step).drawImage(src, 0, 0, sw, sh, 0, 0, nw, nh);
    src = step;
    sw = nw;
    sh = nh;
  }
  const out = makeCanvas(width, height);
  const ctx = context(out);
  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(src, 0, 0, sw, sh, 0, 0, width, height);
  return out;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: OutputMime, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The browser could not encode the image. Try a smaller size."))),
      type,
      type === "image/png" ? undefined : quality,
    );
  });
}

export interface EncodeResult {
  blob: Blob;
  /** The type the browser actually produced (Safari may fall back to PNG for WebP). */
  type: string;
  width: number;
  height: number;
}

export async function resizeAndEncode(
  img: DecodedImage,
  opts: { width: number; height: number; type: OutputMime; quality?: number },
): Promise<EncodeResult> {
  const background = opts.type === "image/jpeg" ? "#ffffff" : undefined;
  const canvas = renderResized(img, opts.width, opts.height, background);
  const blob = await canvasToBlob(canvas, opts.type, opts.quality);
  canvas.width = 0;
  canvas.height = 0;
  return { blob, type: blob.type || opts.type, width: opts.width, height: opts.height };
}

/** Output type for "same as original": GIF and BMP cannot be encoded by canvas, so PNG is used. */
export function sameFormatMime(inputType: string): OutputMime {
  if (inputType === "image/jpeg" || inputType === "image/png" || inputType === "image/webp") return inputType;
  return "image/png";
}

/** "photo.png" + 800×600 + jpeg → "photo-800x600.jpg". */
export function outputFileName(original: string, width: number, height: number, mime: string, suffix?: string): string {
  const base = (original.replace(/\.[^.]+$/, "") || "image").replace(/[^\w.-]+/g, "-").slice(0, 80) || "image";
  const ext = MIME_EXTENSION[mime as OutputMime] ?? "png";
  return `${base}-${suffix ?? `${width}x${height}`}.${ext}`;
}
