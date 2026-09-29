"use client";

// Replaces the root layout when it fails, so it must render its own document
// and cannot rely on global CSS. Styles are inline and follow the OS theme.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          background: "Canvas",
          color: "CanvasText",
          colorScheme: "light dark",
          padding: 16,
        }}
      >
        <title>Something went wrong | Toolora</title>
        <main style={{ maxWidth: 480, textAlign: "center" }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ opacity: 0.8, lineHeight: 1.6 }}>
            The site couldn&apos;t load properly. Please try again. If the problem continues, come back in a few
            minutes.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                padding: "12px 20px",
                borderRadius: 12,
                border: "none",
                background: "#4338ca",
                color: "#fff",
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* A full reload is intended here: the app shell itself failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" style={{ padding: "12px 20px", borderRadius: 12, border: "1px solid currentColor", color: "inherit", textDecoration: "none", fontSize: 15 }}>
              Go to home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
