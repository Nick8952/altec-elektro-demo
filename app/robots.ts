import type { MetadataRoute } from "next";
import { indexierungErlaubt } from "@/lib/seo";
import { siteUrl } from "@/lib/deploy-ziel";

/**
 * robots.txt abhängig von der Freigabe: Demo (Standard) sperrt alles, mit INDEXIERUNG=1 (Go-Live) erlaubt sie alles und
 * nennt die Sitemap. Wird im statischen Export als out/robots.txt geschrieben.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return indexierungErlaubt
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
