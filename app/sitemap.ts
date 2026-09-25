import type { MetadataRoute } from "next";
import { inhaltsquelle, leistungPfad, seitenPfad } from "@/lib/content";
import { siteUrl } from "@/lib/deploy-ziel";

/** Sitemap aller Seiten und Leistungen (nur sinnvoll mit freigegebener Indexierung; wird immer erzeugt, robots.txt verweist nur dann darauf). */
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const q = await inhaltsquelle();
  const [seiten, leistungen] = await Promise.all([q.getAlleSeiten(), q.getLeistungen()]);
  return [
    ...seiten.map((s) => ({ url: `${siteUrl}${seitenPfad(s.slug)}`, changeFrequency: "monthly" as const, priority: s.slug === "start" ? 1 : s.art === "rechtliches" ? 0.2 : 0.7 })),
    ...leistungen.map((l) => ({ url: `${siteUrl}${leistungPfad(l.slug)}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
