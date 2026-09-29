import Script from "next/script";

/**
 * Analytics integration point. Nothing loads unless NEXT_PUBLIC_GA_ID is set,
 * so the site ships with no tracking by default. Add other providers here.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (!gaId || process.env.NODE_ENV !== "production") return null;
  if (!/^G-[A-Z0-9]+$/i.test(gaId)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}

/** Loads the AdSense library only when a publisher ID is configured. */
export function AdSenseScript() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client || process.env.NODE_ENV !== "production") return null;
  if (!/^ca-pub-\d+$/.test(client)) return null;
  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
