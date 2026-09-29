import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Preview/staging deployments set NEXT_PUBLIC_ALLOW_INDEXING=false to stay out of search results.
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === "false") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/search?"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
