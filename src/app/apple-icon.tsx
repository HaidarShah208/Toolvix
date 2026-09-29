import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#4338ca",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M10 9.5v7.25a6 6 0 0 0 12 0V9.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="23.5" r="1.75" fill="#fff" fillOpacity="0.7" />
        </svg>
      </div>
    ),
    size,
  );
}
