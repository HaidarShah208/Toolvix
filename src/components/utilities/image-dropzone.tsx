"use client";

import { ImageUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import {
  ACCEPT_ATTRIBUTE,
  decodeImage,
  hasTransparency,
  validateImageFile,
  type DecodedImage,
} from "@/lib/image/process";
import { cn } from "@/lib/utils/cn";

/** Largest source image we try to decode (pixels). */
const MAX_SOURCE_PIXELS = 150_000_000;

export interface LoadedImage {
  file: File;
  /** Object URL for previewing the original. */
  url: string;
  width: number;
  height: number;
  transparent: boolean;
  decoded: DecodedImage;
}

function release(img: LoadedImage | null) {
  if (!img) return;
  URL.revokeObjectURL(img.url);
  img.decoded.close();
}

/** Decodes a chosen file and owns its preview URL and bitmap (freed on change and unmount). */
export function useLoadedImage() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const current = useRef<LoadedImage | null>(null);
  const token = useRef(0);

  useEffect(() => {
    const ref = current;
    return () => {
      release(ref.current);
      ref.current = null;
    };
  }, []);

  const load = useCallback(async (file: File): Promise<LoadedImage | null> => {
    const problem = validateImageFile(file);
    const id = ++token.current;
    if (problem) {
      setError(problem);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const decoded = await decodeImage(file);
      if (id !== token.current) {
        decoded.close();
        return null;
      }
      if (decoded.width * decoded.height > MAX_SOURCE_PIXELS) {
        decoded.close();
        setError("This image is too large to process in the browser (over 150 megapixels).");
        return null;
      }
      const next: LoadedImage = {
        file,
        url: URL.createObjectURL(file),
        width: decoded.width,
        height: decoded.height,
        transparent: hasTransparency(decoded),
        decoded,
      };
      release(current.current);
      current.current = next;
      setImage(next);
      return next;
    } catch (e) {
      if (id === token.current) {
        setError(e instanceof Error ? e.message : "This image could not be read.");
      }
      return null;
    } finally {
      if (id === token.current) setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    token.current++;
    release(current.current);
    current.current = null;
    setImage(null);
    setError(null);
    setLoading(false);
  }, []);

  return { image, error, loading, load, clear };
}

/** Holds an object URL for a generated blob, revoking the previous one automatically. */
export function useBlobUrl() {
  const [state, setState] = useState<{ blob: Blob; url: string } | null>(null);
  const current = useRef<string | null>(null);

  useEffect(() => {
    const ref = current;
    return () => {
      if (ref.current) URL.revokeObjectURL(ref.current);
      ref.current = null;
    };
  }, []);

  const set = useCallback((blob: Blob | null) => {
    if (current.current) URL.revokeObjectURL(current.current);
    if (!blob) {
      current.current = null;
      setState(null);
      return;
    }
    const url = URL.createObjectURL(blob);
    current.current = url;
    setState({ blob, url });
  }, []);

  return [state, set] as const;
}

/**
 * Click-or-drop image picker. The real file input stays in the tab order
 * (visually hidden), so the zone works with keyboard and screen readers.
 */
export function ImageDropzone({
  onFile,
  fileName,
  loading,
}: {
  onFile: (file: File) => void;
  fileName?: string;
  loading?: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  function onDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  }

  return (
    <label
      onDragEnter={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
      }}
      onDrop={onDrop}
      className={cn(
        "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/20",
        dragging ? "border-primary bg-primary-soft" : "border-border-strong bg-surface hover:border-subtle hover:bg-surface-muted",
      )}
    >
      <input
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <span className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-primary ring-1 ring-border">
        <ImageUp className="size-5" aria-hidden="true" />
      </span>
      <span className="text-sm font-medium text-foreground">
        {loading ? "Reading image…" : fileName ? "Choose a different image" : "Choose an image or drop it here"}
      </span>
      {fileName ? (
        <span className="max-w-full text-xs break-all text-muted">Current: {fileName}</span>
      ) : null}
      <span className="text-xs text-subtle">PNG, JPEG, WebP, GIF or BMP, up to 50 MB</span>
    </label>
  );
}
