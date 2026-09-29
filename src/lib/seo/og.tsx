import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Shared Open Graph card: brand, eyebrow, title and a short description. */
export function renderOgImage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0b1120 0%, #1e1b4b 100%)",
          color: "#f1f5f9",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "#818cf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b1120",
              fontSize: 36,
              fontWeight: 700,
            }}
          >
            U
          </div>
          <div style={{ fontSize: 34, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, color: "#a5b4fc", textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 34 ? 64 : 76, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          {description ? (
            <div style={{ fontSize: 30, color: "#cbd5e1", lineHeight: 1.35, maxWidth: 1000 }}>
              {description.length > 130 ? `${description.slice(0, 127)}…` : description}
            </div>
          ) : null}
        </div>
        <div style={{ fontSize: 24, color: "#94a3b8" }}>{siteConfig.tagline}</div>
      </div>
    ),
    ogSize,
  );
}
